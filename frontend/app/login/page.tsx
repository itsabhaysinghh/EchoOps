'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Script from 'next/script';
import { Mail, Lock, ArrowRight, Sparkles, Check, AlertCircle, Settings, KeyRound, ShieldCheck, X, RefreshCw, UserCheck } from 'lucide-react';

// Decode JWT token helper to read profile data on client side
const decodeJwt = (token: string) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      window.atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Failed to decode JWT:', error);
    return null;
  }
};

declare global {
  interface Window {
    google?: any;
  }
}

export default function Login() {
  const router = useRouter();
  
  // Auth Form states
  const [isRegistering, setIsRegistering] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [authMethod, setAuthMethod] = useState<'email' | 'google' | 'google_sim' | null>(null);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Google OAuth Config states
  const [showConfigDrawer, setShowConfigDrawer] = useState(false);
  const [clientIdInput, setClientIdInput] = useState('');
  const [googleClientId, setGoogleClientId] = useState('');
  const [scriptLoaded, setScriptLoaded] = useState(false);

  // Forgot Password Modal states
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);
  const [forgotStep, setForgotStep] = useState<1 | 2>(1);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotCode, setForgotCode] = useState('');
  const [forgotNewPassword, setForgotNewPassword] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotMessage, setForgotMessage] = useState<string | null>(null);
  const [forgotError, setForgotError] = useState<string | null>(null);

  // Load client ID on mount
  useEffect(() => {
    const savedClientId = localStorage.getItem('echoops_google_client_id');
    const envClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    const activeId = savedClientId || envClientId || '';
    setGoogleClientId(activeId);
    setClientIdInput(activeId);
  }, []);

  // Initialize Google Sign In when script is loaded or Client ID updates
  const initGoogleSignIn = () => {
    if (typeof window !== 'undefined' && window.google && googleClientId) {
      try {
        window.google.accounts.id.initialize({
          client_id: googleClientId,
          callback: handleGoogleCredentialResponse,
          auto_select: false,
          cancel_on_tap_outside: true
        });

        // Trigger Google One Tap UI
        window.google.accounts.id.prompt();

        // Render the official Google button in the container
        const container = document.getElementById('google-signin-official-btn');
        if (container) {
          container.innerHTML = '';
          window.google.accounts.id.renderButton(
            container,
            { 
              theme: 'filled_black', 
              size: 'large', 
              width: 320, 
              text: 'signin_with',
              shape: 'pill'
            }
          );
        }
      } catch (err) {
        console.error('Error initializing Google Sign-In button:', err);
      }
    }
  };

  // Re-run init when script becomes available or ID changes
  useEffect(() => {
    if (scriptLoaded && googleClientId) {
      const timer = setTimeout(() => {
        initGoogleSignIn();
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [scriptLoaded, googleClientId]);

  const handleLoginSuccess = async (token: string, userEmail: string, name: string, role: string, pictureUrl: string = '') => {
    localStorage.setItem('echoops_logged_in', 'true');
    localStorage.setItem('echoops_token', token);
    localStorage.setItem('echoops_user_email', userEmail);
    localStorage.setItem('echoops_user_name', name);
    localStorage.setItem('echoops_role', role);
    if (pictureUrl) {
      localStorage.setItem('echoops_user_picture', pictureUrl);
    } else {
      localStorage.removeItem('echoops_user_picture');
    }
    
    setSuccess(true);
    setError(null);

    let hasConnectedLinks = false;
    try {
      const res = await fetch('http://localhost:8000/api/integrations', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        hasConnectedLinks = data.some((i: any) => i.is_connected);
      }
    } catch (err) {
      console.warn('Error checking integrations status on login:', err);
    }

    const onboardingCompleted = localStorage.getItem('echoops_onboarding_completed') === 'true' || hasConnectedLinks;
    if (hasConnectedLinks) {
      localStorage.setItem('echoops_onboarding_completed', 'true');
    }

    setTimeout(() => {
      if (onboardingCompleted) {
        router.push('/');
      } else {
        router.push('/onboarding');
      }
      router.refresh();
    }, 800);
  };


  // Handler for official Google OAuth script callback
  const handleGoogleCredentialResponse = async (response: any) => {
    if (!response.credential) {
      setError('Google Sign-In callback returned empty credentials.');
      return;
    }
    
    setLoading(true);
    setAuthMethod('google');
    setError(null);

    try {
      const res = await fetch('http://localhost:8000/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ credential: response.credential })
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.detail || 'Google sign-in verification failed on backend');
      }

      const data = await res.json();
      
      let pictureUrl = '';
      try {
        const payload = decodeJwt(response.credential);
        pictureUrl = payload?.picture || '';
      } catch (err) {}

      setLoading(false);
      handleLoginSuccess(
        data.access_token,
        data.user.email,
        data.user.name,
        data.user.role,
        pictureUrl
      );
    } catch (err: any) {
      setLoading(false);
      setError(err.message || 'An error occurred during Google authentication.');
      setAuthMethod(null);
    }
  };

  const handleEmailAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading || success) return;

    if (!email.trim() || !password.trim() || (isRegistering && !name.trim())) {
      setError('Please fill in all required fields');
      return;
    }

    setLoading(true);
    setAuthMethod('email');
    setError(null);

    try {
      const endpoint = isRegistering ? 'http://localhost:8000/api/auth/register' : 'http://localhost:8000/api/auth/login';
      const body = isRegistering 
        ? { email: email.trim(), password: password.trim(), name: name.trim() }
        : { email: email.trim(), password: password.trim() };

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.detail || (isRegistering ? 'Registration failed' : 'Invalid email or password'));
      }
      
      setLoading(false);
      handleLoginSuccess(data.access_token, data.user.email, data.user.name, data.user.role);
    } catch (err: any) {
      setLoading(false);
      setError(err.message || 'Authentication failed. Please verify your details.');
      setAuthMethod(null);
    }
  };


  const handleSimulatedGoogleLogin = async () => {
    if (loading || success) return;

    setLoading(true);
    setAuthMethod('google_sim');
    setError(null);

    try {
      const headerObj = { alg: "HS256", typ: "JWT" };
      const payloadObj = {
        iss: "https://accounts.google.com",
        sub: "109876543210987654321",
        email: "alex.dev@echoops.io",
        email_verified: true,
        name: "Alex Johnson",
        given_name: "Alex",
        family_name: "Johnson",
        picture: "https://lh3.googleusercontent.com/a/default-user"
      };
      
      const base64UrlEncode = (obj: any) => {
        const str = JSON.stringify(obj);
        const base64 = window.btoa(unescape(encodeURIComponent(str)));
        return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
      };
      
      const credential = `${base64UrlEncode(headerObj)}.${base64UrlEncode(payloadObj)}.signature_hash`;

      const res = await fetch('http://localhost:8000/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ credential })
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.detail || 'Google sign-in failed');
      }

      const data = await res.json();
      setLoading(false);
      handleLoginSuccess(
        data.access_token,
        data.user.email,
        data.user.name,
        data.user.role,
        payloadObj.picture
      );
    } catch (err: any) {
      setLoading(false);
      setError(err.message || 'Google login failed');
      setAuthMethod(null);
    }
  };

  const handleSaveClientId = (e: React.FormEvent) => {
    e.preventDefault();
    if (clientIdInput.trim()) {
      localStorage.setItem('echoops_google_client_id', clientIdInput.trim());
      setGoogleClientId(clientIdInput.trim());
      setShowConfigDrawer(false);
      setError(null);
    } else {
      localStorage.removeItem('echoops_google_client_id');
      setGoogleClientId('');
    }
  };

  // Quick fill credential helper for seamless testing
  const handleQuickFill = (presetEmail: string) => {
    setEmail(presetEmail);
    setPassword('password123');
    setError(null);
  };

  // Forgot Password API Handlers
  const handleRequestResetCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail.trim()) {
      setForgotError('Please enter your account email address.');
      return;
    }

    setForgotLoading(true);
    setForgotError(null);
    setForgotMessage(null);

    try {
      const res = await fetch('http://localhost:8000/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: forgotEmail.trim() })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.detail || 'Failed to request password reset code');
      }

      setForgotLoading(false);
      setForgotMessage(data.message);
      if (data.code) {
        setForgotCode(data.code);
      }
      setForgotStep(2);
    } catch (err: any) {
      setForgotLoading(false);
      setForgotError(err.message || 'An error occurred while requesting password reset.');
    }
  };

  const handleResetPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotCode.trim() || !forgotNewPassword.trim()) {
      setForgotError('Please enter both the reset code and your new password.');
      return;
    }

    setForgotLoading(true);
    setForgotError(null);
    setForgotMessage(null);

    try {
      const res = await fetch('http://localhost:8000/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: forgotEmail.trim(),
          code: forgotCode.trim(),
          new_password: forgotNewPassword.trim()
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.detail || 'Failed to reset password');
      }

      setForgotLoading(false);
      setForgotMessage('Password successfully updated! Form pre-filled with your new password.');
      setEmail(forgotEmail.trim());
      setPassword(forgotNewPassword.trim());

      setTimeout(() => {
        setShowForgotPasswordModal(false);
        setForgotStep(1);
        setForgotMessage(null);
        setForgotError(null);
      }, 1500);
    } catch (err: any) {
      setForgotLoading(false);
      setForgotError(err.message || 'Failed to update password.');
    }
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 flex flex-col items-center justify-center p-4 relative overflow-hidden font-sans">
      
      {/* Background Video */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 z-0 w-full h-full object-cover opacity-50 pointer-events-none"
      >
        <source 
          src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260606_131516_eca35265-ea66-4fbd-8d52-22aae6e1a503.mp4" 
          type="video/mp4" 
        />
      </video>

      {/* Load Google Identity Services script dynamically */}
      <Script 
        src="https://accounts.google.com/gsi/client"
        strategy="afterInteractive"
        onReady={() => setScriptLoaded(true)}
      />

      {/* Background glow effects */}
      <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] bg-[#7342E2]/20 rounded-full blur-[150px] pointer-events-none z-0" />
      <div className="absolute bottom-[-20%] right-[-20%] w-[60%] h-[60%] bg-purple-500/20 rounded-full blur-[150px] pointer-events-none z-0" />

      {/* Top Navbar Header */}
      <div className="absolute top-0 left-0 right-0 z-20 max-w-[1280px] mx-auto px-6 py-5 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <svg width="28" height="28" viewBox="0 0 256 256" fill="#F2F2EE" xmlns="http://www.w3.org/2000/svg">
            <path d="M 64 128 L 64.5 128 L 32 95 L 0 64 L 0 0 L 64 0 L 128 64 L 128 64.5 L 161 32 L 192 0 L 256 0 L 256 64 L 192 128 L 128 128 L 128 192 L 96 223 L 63.5 256 L 0 256 L 0 192 Z M 256 192 L 224 223 L 191.5 256 L 128 256 L 128 192 L 192 128 L 256 128 Z" />
          </svg>
          <span className="text-sm font-bold tracking-tight text-white font-mono uppercase">EchoOps Vault</span>
        </div>
        <a
          href="/password-hero"
          className="text-xs font-semibold px-4 py-2 rounded-full transition-all hover:scale-105 shadow-md flex items-center gap-1.5"
          style={{ backgroundColor: '#7342E2', color: '#FFFFFF' }}
        >
          <Sparkles className="w-3.5 h-3.5" /> View Vault Landing Hero
        </a>
      </div>

      {/* Main Container */}
      <div className="w-full max-w-md relative z-10 space-y-6 mt-12 sm:mt-0">
        
        {/* Brand header */}
        <div className="text-center space-y-2">
          <div className="inline-flex w-16 h-16 rounded-2xl bg-zinc-950/80 items-center justify-center p-2.5 border border-[#7342E2]/30 shadow-2xl shadow-[#7342E2]/30 mb-2 overflow-hidden backdrop-blur-md">
            <img src="/logo.png" alt="EchoOps Logo" className="w-full h-full object-contain" />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-zinc-100 via-indigo-200 to-purple-300 bg-clip-text text-transparent">
            Welcome to EchoOps
          </h1>
          <p className="text-sm text-zinc-400">
            The AI-powered Feedback Operating System
          </p>
        </div>

        {/* Login Card */}
        <div className="glass-panel p-8 rounded-3xl border border-zinc-800/80 shadow-2xl backdrop-blur-xl relative bg-zinc-950/80">

          
          {/* Overlay loading/success screen */}
          {(loading || success) && (
            <div className="absolute inset-0 bg-zinc-950/80 backdrop-blur-md rounded-3xl z-30 flex flex-col items-center justify-center p-6 text-center animate-fade-in">
              {loading && (
                <div className="space-y-4">
                  <div className="w-10 h-10 border-3 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto" />
                  <p className="text-sm font-semibold text-zinc-300">
                    {authMethod === 'google' 
                      ? 'Authenticating with Google OAuth...' 
                      : (authMethod === 'google_sim' ? 'Authenticating with Google...' : 'Verifying credentials...')}
                  </p>
                </div>
              )}
              {success && (
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-400 animate-scale-up">
                    <Check className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-zinc-200">Access Granted</p>
                    <p className="text-xs text-zinc-500 mt-1">Opening your Command Center...</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Card body */}
          <div className="space-y-6">
            
            {/* Mode Switcher: Sign In vs Create Account */}
            <div className="flex bg-zinc-950 p-1 rounded-xl border border-zinc-800">
              <button
                type="button"
                onClick={() => { setIsRegistering(false); setError(null); }}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                  !isRegistering 
                    ? 'bg-indigo-600 text-white shadow-md' 
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => { setIsRegistering(true); setError(null); }}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                  isRegistering 
                    ? 'bg-indigo-600 text-white shadow-md' 
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                Create Account
              </button>
            </div>

            {error && (
              <div className="p-3.5 rounded-xl border bg-red-500/10 border-red-500/20 text-red-400 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Email & Password Credentials Form Section */}
            <form onSubmit={handleEmailAuthSubmit} className="space-y-4">
              
              {isRegistering && (
                <div className="space-y-1.5 animate-fade-in">
                  <label className="text-[10px] text-zinc-400 font-bold uppercase font-mono tracking-wider">Full Name</label>
                  <div className="relative">
                    <UserCheck className="w-4 h-4 text-zinc-500 absolute left-3 top-3.5" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Sarah Connor"
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-3 pl-9.5 pr-4 text-sm focus:outline-none focus:border-indigo-500 text-zinc-200"
                    />
                  </div>
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-[10px] text-zinc-400 font-bold uppercase font-mono tracking-wider">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-zinc-500 absolute left-3 top-3.5" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@company.com"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-3 pl-9.5 pr-4 text-sm focus:outline-none focus:border-indigo-500 text-zinc-200"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] text-zinc-400 font-bold uppercase font-mono tracking-wider">Password</label>
                  {!isRegistering && (
                    <button
                      type="button"
                      onClick={() => {
                        setShowForgotPasswordModal(true);
                        setForgotStep(1);
                        setForgotEmail(email || 'superadmin@acme.io');
                        setForgotMessage(null);
                        setForgotError(null);
                      }}
                      className="text-[10px] text-indigo-400 hover:text-indigo-300 font-semibold uppercase tracking-wide font-mono flex items-center gap-1 transition"
                    >
                      <KeyRound className="w-3 h-3" /> Forgot?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-zinc-500 absolute left-3 top-3.5" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-3 pl-9.5 pr-4 text-sm focus:outline-none focus:border-indigo-500 text-zinc-200"
                  />
                </div>
              </div>

              {/* Quick Fill Demo Credentials (only on Sign In) */}
              {!isRegistering && (
                <div className="pt-1 space-y-1.5">
                  <div className="flex items-center justify-between text-[10px] text-zinc-500 font-mono">
                    <span>Quick Credentials Login:</span>
                    <span className="text-zinc-600 font-bold">Pass: password123</span>
                  </div>
                  <div className="grid grid-cols-3 gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleQuickFill('superadmin@acme.io')}
                      className="py-1.5 px-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-indigo-500/40 rounded-lg text-[11px] font-medium text-zinc-300 transition text-center truncate"
                    >
                      Super Admin
                    </button>
                    <button
                      type="button"
                      onClick={() => handleQuickFill('pm@acme.io')}
                      className="py-1.5 px-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-indigo-500/40 rounded-lg text-[11px] font-medium text-zinc-300 transition text-center truncate"
                    >
                      Product Mgr
                    </button>
                    <button
                      type="button"
                      onClick={() => handleQuickFill('dev@acme.io')}
                      className="py-1.5 px-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-indigo-500/40 rounded-lg text-[11px] font-medium text-zinc-300 transition text-center truncate"
                    >
                      Developer
                    </button>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={loading || success}
                className="w-full mt-2 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.01] active:scale-[0.99]"
              >
                {isRegistering ? 'Create Account' : 'Sign In with Credentials'} <ArrowRight className="w-4 h-4" />
              </button>
            </form>


            {/* Separator line */}
            <div className="flex items-center gap-3 text-xs text-zinc-500 font-medium">
              <div className="flex-1 h-px bg-zinc-800" />
              <span>or sign in with Google</span>
              <div className="flex-1 h-px bg-zinc-800" />
            </div>

            {/* Google OAuth Section */}
            <div className="space-y-3">
              {googleClientId ? (
                <div className="flex flex-col items-center justify-center p-3 bg-zinc-950/60 rounded-2xl border border-indigo-500/20 space-y-2">
                  <div id="google-signin-official-btn" className="w-full flex justify-center py-1" />
                  <div className="flex items-center justify-center w-full px-2 pt-1 text-[10px] text-zinc-400 font-mono">
                    <span className="text-emerald-400 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                      Google One Tap Active
                    </span>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <button
                    onClick={handleSimulatedGoogleLogin}
                    disabled={loading || success}
                    type="button"
                    className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-white hover:bg-zinc-100 text-zinc-900 font-semibold text-sm rounded-2xl shadow-lg transition duration-200 hover:scale-[1.01] active:scale-[0.99] border border-zinc-200"
                  >
                    <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z" />
                      <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.29v3.15C3.26 21.3 7.35 24 12 24z" />
                      <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.29C.47 8.21 0 10.05 0 12s.47 3.79 1.29 5.42l3.99-3.15z" />
                      <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.35 0 3.26 2.7 1.29 6.58l3.99 3.15c.95-2.83 3.6-4.98 6.72-4.98z" />
                    </svg>
                    <span>Continue with Google</span>
                  </button>
                  <div className="text-center text-[10px] text-zinc-500">
                    <span>1-Tap Instant Google Sign-In</span>
                  </div>
                </div>
              )}
            </div>

          </div>

        </div>

        {/* Footer legal links */}
        <div className="flex items-center justify-center space-x-4 text-xs text-zinc-500 font-medium">
          <a href="/privacy" className="hover:text-indigo-400 transition-colors">
            Privacy Policy
          </a>
          <span>•</span>
          <a href="/terms" className="hover:text-indigo-400 transition-colors">
            Terms of Service
          </a>
        </div>

      </div>

      {/* Forgot Password Modal */}
      {showForgotPasswordModal && (
        <div className="fixed inset-0 z-50 bg-zinc-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
          <div className="w-full max-w-md glass-panel p-6 rounded-3xl border border-indigo-500/30 shadow-2xl relative space-y-5 bg-zinc-900/90">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
                  <KeyRound className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-zinc-100">Reset Password</h3>
                  <p className="text-xs text-zinc-400">
                    {forgotStep === 1 ? 'Step 1 of 2: Verify your account email' : 'Step 2 of 2: Enter code & new password'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowForgotPasswordModal(false)}
                className="p-1 rounded-lg text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {forgotError && (
              <div className="p-3 rounded-xl border bg-red-500/10 border-red-500/20 text-red-400 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{forgotError}</span>
              </div>
            )}

            {forgotMessage && (
              <div className="p-3 rounded-xl border bg-emerald-500/10 border-emerald-500/20 text-emerald-400 text-xs flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 shrink-0" />
                <span>{forgotMessage}</span>
              </div>
            )}

            {forgotStep === 1 ? (
              <form onSubmit={handleRequestResetCode} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] text-zinc-400 font-bold uppercase font-mono tracking-wider">Account Email Address</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-zinc-500 absolute left-3 top-3.5" />
                    <input
                      type="email"
                      required
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      placeholder="superadmin@acme.io"
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-3 pl-9.5 pr-4 text-sm focus:outline-none focus:border-indigo-500 text-zinc-200"
                    />
                  </div>
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowForgotPasswordModal(false)}
                    className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-semibold rounded-xl transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={forgotLoading}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-md shadow-indigo-600/20 transition disabled:opacity-50"
                  >
                    {forgotLoading ? 'Sending...' : 'Send Verification Code'} <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleResetPasswordSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] text-zinc-400 font-bold uppercase font-mono tracking-wider">6-Digit Verification Code</label>
                  <input
                    type="text"
                    required
                    value={forgotCode}
                    onChange={(e) => setForgotCode(e.target.value)}
                    placeholder="849201"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-2.5 px-3 text-sm focus:outline-none focus:border-indigo-500 text-zinc-200 font-mono tracking-widest text-center"
                  />
                  <p className="text-[10px] text-zinc-500">Universal test code: <code className="text-indigo-400">849201</code> or <code className="text-indigo-400">123456</code></p>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] text-zinc-400 font-bold uppercase font-mono tracking-wider">New Password</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-zinc-500 absolute left-3 top-3.5" />
                    <input
                      type="password"
                      required
                      value={forgotNewPassword}
                      onChange={(e) => setForgotNewPassword(e.target.value)}
                      placeholder="Enter your new password"
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-3 pl-9.5 pr-4 text-sm focus:outline-none focus:border-indigo-500 text-zinc-200"
                    />
                  </div>
                </div>

                <div className="pt-2 flex justify-between items-center">
                  <button
                    type="button"
                    onClick={() => setForgotStep(1)}
                    className="text-xs text-zinc-400 hover:text-zinc-200 underline"
                  >
                    ← Back
                  </button>
                  <button
                    type="submit"
                    disabled={forgotLoading}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-md shadow-indigo-600/20 transition disabled:opacity-50"
                  >
                    {forgotLoading ? 'Updating...' : 'Update Password'} <Check className="w-3.5 h-3.5" />
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
