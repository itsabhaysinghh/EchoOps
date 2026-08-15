'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Building2, 
  Layers, 
  UserPlus, 
  Share2, 
  ArrowRight, 
  Check, 
  Mail, 
  Shield, 
  Plus, 
  Trash2,
  AlertCircle,
  Inbox,
  Play
} from 'lucide-react';
import IntegrationIcon from '../components/IntegrationIcon';

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Protect route - redirect if not logged in
  React.useEffect(() => {
    const loggedIn = localStorage.getItem('echoops_logged_in');
    if (!loggedIn) {
      router.push('/login');
    }
  }, [router]);

  // Step 1: Company Info
  const [companyName, setCompanyName] = useState('Acme Corp');
  const [industry, setIndustry] = useState('Enterprise software');
  const [website, setWebsite] = useState('https://acme.io');
  const [timezone, setTimezone] = useState('America/New_York');

  // Step 2: Workspace Info
  const [workspaceName, setWorkspaceName] = useState('Acme Feedback Workspace');

  // Step 3: Invite Members
  const [invites, setInvites] = useState([
    { email: 'pm@acme.io', role: 'Product Manager' },
    { email: 'dev@acme.io', role: 'Developer' }
  ]);
  const [newEmail, setNewEmail] = useState('');
  const [newRole, setNewRole] = useState('Developer');

  // Step 4: Data Sources & Link Pasting
  const [playStoreUrl, setPlayStoreUrl] = useState('');
  const [appStoreUrl, setAppStoreUrl] = useState('');
  const [instagramUrl, setInstagramUrl] = useState('');

  const fillSampleLinks = () => {
    setPlayStoreUrl('https://play.google.com/store/apps/details?id=com.acme.feedback');
    setAppStoreUrl('https://apps.apple.com/us/app/acme-desk/id987654321');
    setInstagramUrl('https://www.instagram.com/p/C-checkout-crash-reports/');
  };

  const addInvite = () => {
    if (newEmail.trim() && newEmail.includes('@')) {
      setInvites([...invites, { email: newEmail, role: newRole }]);
      setNewEmail('');
    }
  };

  const removeInvite = (index: number) => {
    setInvites(invites.filter((_, i) => i !== index));
  };

  const handleNextStep = async () => {
    setErrorMsg('');
    if (step === 1) {
      if (!companyName.trim()) {
        setErrorMsg('Company Name is required.');
        return;
      }
      setStep(2);
    } else if (step === 2) {
      if (!workspaceName.trim()) {
        setErrorMsg('Workspace Name is required.');
        return;
      }
      setStep(3);
    } else if (step === 3) {
      setStep(4);
    } else if (step === 4) {
      setLoading(true);
      const token = localStorage.getItem('echoops_token') || '';
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      try {
        // Step 1 API Call: Create Company
        const compRes = await fetch('http://localhost:8000/api/onboarding/company', {
          method: 'POST',
          headers,
          body: JSON.stringify({ name: companyName, industry, website, timezone })
        });
        if (!compRes.ok) throw new Error('Failed to create company on API server');
        const companyData = await compRes.json();
        
        // Step 2 API Call: Create Workspace
        const wsRes = await fetch('http://localhost:8000/api/onboarding/workspace', {
          method: 'POST',
          headers,
          body: JSON.stringify({ name: workspaceName, company_id: companyData.id })
        });
        if (!wsRes.ok) throw new Error('Failed to create workspace on API server');
        const wsData = await wsRes.json();
        
        // Step 3 API Call: Invite Members
        if (invites.length > 0) {
          await fetch(`http://localhost:8000/api/onboarding/invite?company_id=${companyData.id}&workspace_id=${wsData.id}`, {
            method: 'POST',
            headers,
            body: JSON.stringify(invites)
          });
        }
        
        // Step 4 API Call: Connect & Scan Pasted Links
        const sourcesToConnect = [
          { name: 'Google Play Store', url: playStoreUrl },
          { name: 'Apple App Store', url: appStoreUrl },
          { name: 'Instagram', url: instagramUrl }
        ];

        for (const src of sourcesToConnect) {
          if (src.url.trim()) {
            await fetch('http://localhost:8000/api/integrations/connect', {
              method: 'POST',
              headers,
              body: JSON.stringify({
                tool_name: src.name,
                config_data: { url: src.url.trim(), connected_at: new Date().toISOString() }
              })
            });
          }
        }
        
        // Save preferences locally
        localStorage.setItem('echoops_company', companyName);
        localStorage.setItem('echoops_workspace', workspaceName);
        localStorage.setItem('echoops_onboarding_completed', 'true');
        
        // Redirect to Dashboard
        router.push('/');
      } catch (err) {
        console.error('Onboarding submission warning:', err);
        localStorage.setItem('echoops_company', companyName);
        localStorage.setItem('echoops_workspace', workspaceName);
        localStorage.setItem('echoops_onboarding_completed', 'true');
        router.push('/');
      } finally {
        setLoading(false);
      }
    }
  };


  const stepsList = [
    { num: 1, label: 'Company Profile', icon: Building2 },
    { num: 2, label: 'Workspace Setup', icon: Layers },
    { num: 3, label: 'Team Invitations', icon: UserPlus },
    { num: 4, label: 'Connect Data', icon: Share2 }
  ];

  const integrationCategories = [
    {
      title: 'Customer Feedback',
      sources: ['Google Play Store', 'Apple App Store', 'Gmail', 'Trustpilot', 'Zendesk', 'Intercom', 'CSV Upload']
    },
    {
      title: 'Engineering & Chat Tools',
      sources: ['Jira', 'GitHub', 'Linear', 'Trello', 'Slack', 'Microsoft Teams']
    }
  ];

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      
      {/* Background Glow */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-indigo-500/10 blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-purple-500/10 blur-3xl" />
      
      <div className="w-full max-w-3xl z-10">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex w-14 h-14 rounded-2xl bg-zinc-950/80 items-center justify-center p-2 border border-indigo-500/30 shadow-xl shadow-purple-500/20 mb-2 overflow-hidden">
            <img src="/logo.png" alt="EchoOps Logo" className="w-full h-full object-contain" />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Welcome to EchoOps
          </h1>
          <p className="text-sm text-zinc-400 mt-2">
            Let's configure your AI feedback operating system in a few simple steps.
          </p>
        </div>

        {/* Horizontal Stepper Progress */}
        <div className="flex justify-between items-center mb-8 px-4">
          {stepsList.map((s, idx) => {
            const Icon = s.icon;
            const isCompleted = step > s.num;
            const isCurrent = step === s.num;
            return (
              <React.Fragment key={s.num}>
                <div className="flex flex-col items-center relative">
                  <div 
                    className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-all duration-300 ${
                      isCompleted 
                        ? 'bg-indigo-600 border-indigo-500 text-white' 
                        : isCurrent 
                          ? 'bg-zinc-900 border-indigo-500 text-indigo-400 shadow-[0_0_15px_rgba(99,102,241,0.2)]'
                          : 'bg-zinc-900/60 border-zinc-800 text-zinc-500'
                    }`}
                  >
                    {isCompleted ? <Check className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                  </div>
                  <span className={`text-xs mt-2 font-medium ${isCurrent ? 'text-indigo-400' : (isCompleted ? 'text-zinc-300' : 'text-zinc-500')}`}>
                    {s.label}
                  </span>
                </div>
                {idx < stepsList.length - 1 && (
                  <div className={`flex-1 h-[2px] mx-4 transition-all duration-500 ${step > s.num ? 'bg-indigo-600' : 'bg-zinc-800'}`} />
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* Wizard Main Container */}
        <div className="glass-panel rounded-2xl p-8 shadow-2xl relative">
          
          {errorMsg && (
            <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/25 flex items-center gap-3 text-red-400 text-sm">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* STEP 1: Company Profile */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="border-b border-zinc-800/50 pb-4 mb-2">
                <h2 className="text-xl font-bold text-zinc-200">Step 1: Create Company Profile</h2>
                <p className="text-xs text-zinc-500 mt-1">Specify your company details to train your customized AI engine.</p>
              </div>
              
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-zinc-400">Company Name</label>
                  <input
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500 text-zinc-200"
                    placeholder="Acme SaaS Inc."
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-zinc-400">Website URL</label>
                  <input
                    type="text"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500 text-zinc-200"
                    placeholder="https://acme.io"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-zinc-400">Industry Sector</label>
                  <select
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500 text-zinc-200"
                  >
                    <option value="SaaS companies">SaaS Companies</option>
                    <option value="Mobile apps">Mobile Apps</option>
                    <option value="E-commerce">E-Commerce</option>
                    <option value="Food delivery">Food Delivery</option>
                    <option value="Fintech">Fintech</option>
                    <option value="Healthcare">Healthcare</option>
                    <option value="Travel">Travel</option>
                    <option value="Gaming">Gaming</option>
                    <option value="Enterprise software">Enterprise Software</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-zinc-400">Default Timezone</label>
                  <input
                    type="text"
                    value={timezone}
                    onChange={(e) => setTimezone(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500 text-zinc-200"
                    placeholder="America/New_York"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Workspace Setup */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="border-b border-zinc-800/50 pb-4 mb-2">
                <h2 className="text-xl font-bold text-zinc-200">Step 2: Initialize Workspace</h2>
                <p className="text-xs text-zinc-500 mt-1">Workspaces gather feedback channels, pipelines, and engineering integrations under a single workspace namespace.</p>
              </div>
              
              <div className="space-y-2 max-w-lg">
                <label className="text-xs font-semibold text-zinc-400">Workspace Name</label>
                <input
                  type="text"
                  value={workspaceName}
                  onChange={(e) => setWorkspaceName(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500 text-zinc-200"
                  placeholder="Acme Feedback Desk"
                />
              </div>
            </div>
          )}

          {/* STEP 3: Invite Team Members */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="border-b border-zinc-800/50 pb-4 mb-2">
                <h2 className="text-xl font-bold text-zinc-200">Step 3: Invite Team Members</h2>
                <p className="text-xs text-zinc-500 mt-1">Add colleagues to collaborative workflows. Assigned issues map to these accounts.</p>
              </div>
              
              {/* Form to add user */}
              <div className="flex gap-4 items-end bg-zinc-950/40 p-4 rounded-xl border border-zinc-850">
                <div className="flex-1 space-y-2">
                  <label className="text-xs font-semibold text-zinc-400 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-zinc-500" />
                    Team Member Email
                  </label>
                  <input
                    type="email"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-indigo-500 text-zinc-200"
                    placeholder="engineer@acme.io"
                  />
                </div>
                <div className="w-48 space-y-2">
                  <label className="text-xs font-semibold text-zinc-400 flex items-center gap-1.5">
                    <Shield className="w-3.5 h-3.5 text-zinc-500" />
                    Role Type
                  </label>
                  <select
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-indigo-500 text-zinc-200"
                  >
                    <option value="Super Admin">Super Admin</option>
                    <option value="Admin">Admin</option>
                    <option value="Product Manager">Product Manager</option>
                    <option value="Engineering Manager">Engineering Manager</option>
                    <option value="Developer">Developer</option>
                    <option value="Customer Support">Customer Support</option>
                    <option value="Viewer">Viewer</option>
                  </select>
                </div>
                <button
                  type="button"
                  onClick={addInvite}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-semibold flex items-center gap-1.5 transition"
                >
                  <Plus className="w-4 h-4" /> Add
                </button>
              </div>

              {/* Invitation list */}
              <div className="space-y-2 max-h-48 overflow-y-auto">
                <span className="text-xs font-bold text-zinc-500 uppercase tracking-wide">Pending Invites ({invites.length})</span>
                {invites.length === 0 ? (
                  <p className="text-xs text-zinc-500 italic">No invitations added yet.</p>
                ) : (
                  invites.map((inv, idx) => (
                    <div key={idx} className="flex justify-between items-center bg-zinc-900/60 p-3 rounded-lg border border-zinc-850">
                      <div>
                        <span className="text-sm font-medium text-zinc-300 block">{inv.email}</span>
                        <span className="text-[10px] text-indigo-400 font-semibold font-mono tracking-wide uppercase">{inv.role}</span>
                      </div>
                      <button 
                        type="button" 
                        onClick={() => removeInvite(idx)} 
                        className="text-zinc-500 hover:text-red-400 transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* STEP 4: Paste Application & Social Feedback Links */}
          {step === 4 && (
            <div className="space-y-6">
              <div className="border-b border-zinc-800/50 pb-4 mb-2 flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-bold text-zinc-200">Step 4: Paste Feedback Channel Links</h2>
                  <p className="text-xs text-zinc-500 mt-1">Paste your Play Store, App Store, or Instagram links. EchoOps automatically scans reviews and clusters recent error spikes.</p>
                </div>
                <button
                  type="button"
                  onClick={fillSampleLinks}
                  className="px-3 py-1.5 bg-indigo-500/10 border border-indigo-500/30 hover:bg-indigo-500/20 text-indigo-300 text-xs font-semibold rounded-lg transition"
                >
                  ⚡ Auto-Fill Sample Links
                </button>
              </div>

              <div className="space-y-4">
                {/* Google Play Store Link */}
                <div className="space-y-1.5 bg-zinc-950/60 p-4 rounded-xl border border-zinc-800/80">
                  <div className="flex items-center gap-2">
                    <IntegrationIcon name="Google Play Store" className="w-5 h-5 text-indigo-400" />
                    <label className="text-xs font-bold text-zinc-200">Google Play Store App URL</label>
                  </div>
                  <input
                    type="url"
                    value={playStoreUrl}
                    onChange={(e) => setPlayStoreUrl(e.target.value)}
                    placeholder="https://play.google.com/store/apps/details?id=com.yourcompany.app"
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-zinc-200 focus:outline-none focus:border-indigo-500"
                  />
                  <span className="text-[10px] text-zinc-500 block">Ingests Play Store ratings, Android device model logs, and review sentiment.</span>
                </div>

                {/* Apple App Store Link */}
                <div className="space-y-1.5 bg-zinc-950/60 p-4 rounded-xl border border-zinc-800/80">
                  <div className="flex items-center gap-2">
                    <IntegrationIcon name="Apple App Store" className="w-5 h-5 text-indigo-400" />
                    <label className="text-xs font-bold text-zinc-200">Apple App Store App URL</label>
                  </div>
                  <input
                    type="url"
                    value={appStoreUrl}
                    onChange={(e) => setAppStoreUrl(e.target.value)}
                    placeholder="https://apps.apple.com/us/app/your-app-name/id123456789"
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-zinc-200 focus:outline-none focus:border-indigo-500"
                  />
                  <span className="text-[10px] text-zinc-500 block">Ingests iOS App Store user ratings, crash reports, and version trends.</span>
                </div>

                {/* Instagram Post / Profile Link */}
                <div className="space-y-1.5 bg-zinc-950/60 p-4 rounded-xl border border-zinc-800/80">
                  <div className="flex items-center gap-2">
                    <IntegrationIcon name="Instagram" className="w-5 h-5 text-indigo-400" />
                    <label className="text-xs font-bold text-zinc-200">Instagram Post / Profile URL</label>
                  </div>
                  <input
                    type="url"
                    value={instagramUrl}
                    onChange={(e) => setInstagramUrl(e.target.value)}
                    placeholder="https://www.instagram.com/p/C-your-post-id/"
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-zinc-200 focus:outline-none focus:border-indigo-500"
                  />
                  <span className="text-[10px] text-zinc-500 block">Scans Instagram comments for bug reports, customer complaints, and emotion analysis.</span>
                </div>
              </div>
            </div>
          )}


          {/* Stepper Footer actions */}
          <div className="flex justify-between items-center pt-6 mt-8 border-t border-zinc-800/40">
            <button
              type="button"
              disabled={step === 1 || loading}
              onClick={() => setStep(step - 1)}
              className="px-4 py-2 border border-zinc-800 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-sm font-semibold rounded-xl transition disabled:opacity-40 disabled:pointer-events-none"
            >
              Previous
            </button>
            <button
              type="button"
              disabled={loading}
              onClick={handleNextStep}
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-xl flex items-center gap-1.5 shadow-lg shadow-indigo-600/20 hover-glow transition"
            >
              {loading ? (
                <span>Saving...</span>
              ) : step === 4 ? (
                <>
                  Complete Setup <Check className="w-4 h-4" />
                </>
              ) : (
                <>
                  Continue <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
