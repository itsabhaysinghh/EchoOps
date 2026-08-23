'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  LayoutDashboard, 
  Sparkles, 
  Mic, 
  MessageSquare, 
  Lightbulb, 
  FileText, 
  Layers, 
  Settings, 
  Bell, 
  Search,
  ChevronDown,
  User,
  ShieldCheck,
  Zap,
  LogOut,
  Menu,
  X
} from 'lucide-react';

const DynamicLogo = ({ imgUrl, label }: { imgUrl: string; label: string }) => {
  const [error, setError] = useState(false);

  if (!label || label.trim() === "") return null;

  return (
    <div className="flex items-center gap-2 bg-zinc-900/50 border border-zinc-800/80 px-3 py-1.5 rounded-xl transition duration-200">
      <div className="w-5.5 h-5.5 rounded-md overflow-hidden flex items-center justify-center bg-zinc-850 border border-zinc-800 shrink-0">
        {error ? (
          <div className="w-full h-full bg-gradient-to-tr from-zinc-800 to-zinc-700 flex items-center justify-center">
            <span className="text-[10px] font-extrabold text-zinc-400 font-mono uppercase">
              {label.substring(0, 2)}
            </span>
          </div>
        ) : (
          <img 
            src={imgUrl} 
            alt={label} 
            className="w-full h-full object-contain p-0.5 bg-white"
            onError={() => setError(true)}
          />
        )}
      </div>
      <span className="font-bold text-[10px] uppercase tracking-wider text-zinc-300 font-mono">
        {label}
      </span>
    </div>
  );
};

interface SidebarLayoutProps {
  children: React.ReactNode;
}

export default function SidebarLayout({ children }: SidebarLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [workspace, setWorkspace] = useState('Acme Workspace');
  const [userRole, setUserRole] = useState('Super Admin');
  const [userName, setUserName] = useState('Rahul Sharma');
  const [userEmail, setUserEmail] = useState('rahul@acme.io');
  const [userPicture, setUserPicture] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, type: 'critical', text: 'Critical issue detected: Payment checkout crashes', time: '5m ago', read: false },
    { id: 2, type: 'assignment', text: 'Stripe Bug assigned to Rahul Sharma', time: '1h ago', read: false },
    { id: 3, type: 'health', text: 'Health Index changed from 85 to 64', time: '3h ago', read: true }
  ]);

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Sync role, workspace, and search query on load/navigation
  useEffect(() => {
    const loggedIn = localStorage.getItem('echoops_logged_in');
    if (!loggedIn && pathname !== '/login') {
      router.push('/login');
      return;
    }

    const savedRole = localStorage.getItem('echoops_role');
    if (savedRole) setUserRole(savedRole);
    const savedWS = localStorage.getItem('echoops_workspace');
    if (savedWS) setWorkspace(savedWS);
    const savedEmail = localStorage.getItem('echoops_user_email');
    if (savedEmail) setUserEmail(savedEmail);
    const savedName = localStorage.getItem('echoops_user_name');
    if (savedName) setUserName(savedName);
    const savedPicture = localStorage.getItem('echoops_user_picture');
    if (savedPicture) {
      setUserPicture(savedPicture);
    } else {
      setUserPicture('');
    }

    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const q = params.get('search');
      if (q) {
        setSearchQuery(q);
      } else {
        setSearchQuery('');
      }
    }
  }, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem('echoops_logged_in');
    localStorage.removeItem('echoops_user_email');
    localStorage.removeItem('echoops_user_name');
    localStorage.removeItem('echoops_user_picture');
    router.push('/login');
  };

  const handleRoleChange = (role: string) => {
    setUserRole(role);
    localStorage.setItem('echoops_role', role);
    // Reload components depending on role permissions
    window.dispatchEvent(new Event('role-changed'));
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/?search=${encodeURIComponent(searchQuery)}`);
    } else {
      router.push('/');
    }
  };

  const menuItems = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard },
    { name: 'Onboarding Wizard', href: '/onboarding', icon: Sparkles },
    { name: 'Voice Intelligence', href: '/voice', icon: Mic },
    { name: 'AI Chat Copilot', href: '/chat', icon: MessageSquare },
    { name: 'Feature Requests', href: '/features', icon: Lightbulb },
    { name: 'Weekly Reports', href: '/reports', icon: FileText },
    { name: 'Integrations', href: '/integrations', icon: Settings }
  ];

  const roles = [
    'Super Admin', 'Admin', 'Product Manager', 
    'Engineering Manager', 'Developer', 'Customer Support', 'Viewer'
  ];

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="flex h-screen overflow-hidden bg-zinc-950 text-zinc-100">
      
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 bg-zinc-900/60 border-r border-zinc-800/80 flex-col backdrop-blur-xl z-20 shrink-0">
        
        {/* Logo and Branding */}
        <div className="p-5 border-b border-zinc-800/50 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-zinc-950 flex items-center justify-center p-1 border border-indigo-500/20 shadow-lg shadow-purple-500/20 shrink-0 overflow-hidden">
            <img src="/logo.png" alt="EchoOps Logo" className="w-full h-full object-contain" />
          </div>
          <div>
            <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">EchoOps</span>
            <span className="text-[10px] block text-zinc-500 font-mono tracking-wider">FEEDBACK OS</span>
          </div>
        </div>

        {/* Workspace selector */}
        <div className="px-4 py-3">
          <div className="flex items-center justify-between p-2 rounded-lg bg-zinc-950/40 border border-zinc-800/60 text-sm cursor-pointer hover:bg-zinc-900/40 transition">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-indigo-400" />
              <span className="font-medium truncate max-w-[130px]">{workspace}</span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-zinc-500" />
          </div>
        </div>

        {/* Menu Links */}
        <nav className="flex-1 px-3 py-3 space-y-1 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition duration-200 ${
                  isActive 
                    ? 'bg-indigo-600/10 text-indigo-400 border border-indigo-500/20' 
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/50'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-400' : 'text-zinc-500 group-hover:text-zinc-400'}`} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Role Simulator Selector */}
        <div className="p-4 border-t border-zinc-800/50 bg-zinc-950/20">
          <div className="text-[10px] uppercase font-bold text-zinc-500 mb-2 flex items-center gap-1.5 font-mono">
            <ShieldCheck className="w-3 h-3 text-indigo-400" />
            Simulate Role
          </div>
          <div className="relative">
            <select
              value={userRole}
              onChange={(e) => handleRoleChange(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 text-xs text-zinc-300 rounded-lg p-2 pr-8 appearance-none focus:outline-none focus:border-indigo-500 cursor-pointer"
            >
              {roles.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-zinc-500 absolute right-2.5 top-2.5 pointer-events-none" />
          </div>
          
          {/* User profile details */}
          <div className="mt-4 flex items-center justify-between pt-3 border-t border-zinc-800/30">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center border border-zinc-700/80 shrink-0 overflow-hidden">
                {userPicture ? (
                  <img src={userPicture} alt={userName} className="w-full h-full object-cover" />
                ) : (
                  <User className="w-4 h-4 text-zinc-400" />
                )}
              </div>
              <div className="overflow-hidden">
                <span className="text-xs font-semibold block text-zinc-200 truncate">{userName}</span>
                <span className="text-[10px] text-zinc-500 truncate block">{userEmail}</span>
              </div>
            </div>
            <button 
              onClick={handleLogout}
              title="Log Out"
              className="p-1.5 rounded-lg border border-zinc-850 hover:bg-red-500/10 hover:border-red-500/20 text-zinc-500 hover:text-red-400 transition"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </aside>

      {/* Mobile Drawer Navigation Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-zinc-950/80 backdrop-blur-md transition-opacity" 
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Drawer content */}
          <aside className="relative w-72 max-w-[85vw] bg-zinc-900 border-r border-zinc-800 flex flex-col h-full z-10 shadow-2xl overflow-y-auto">
            {/* Header: Logo + Close button */}
            <div className="p-4 border-b border-zinc-800/50 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-zinc-950 flex items-center justify-center p-1 border border-indigo-500/20 shadow-lg shadow-purple-500/20 shrink-0 overflow-hidden">
                  <img src="/logo.png" alt="EchoOps Logo" className="w-full h-full object-contain" />
                </div>
                <div>
                  <span className="font-bold text-base tracking-tight bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">EchoOps</span>
                  <span className="text-[9px] block text-zinc-500 font-mono tracking-wider">FEEDBACK OS</span>
                </div>
              </div>
              <button 
                onClick={() => setMobileMenuOpen(false)}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Workspace selector */}
            <div className="px-4 py-3">
              <div className="flex items-center justify-between p-2 rounded-lg bg-zinc-950/40 border border-zinc-800/60 text-xs">
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-indigo-400" />
                  <span className="font-medium truncate max-w-[130px]">{workspace}</span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-zinc-500" />
              </div>
            </div>

            {/* Nav Menu */}
            <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition duration-200 ${
                      isActive 
                        ? 'bg-indigo-600/10 text-indigo-400 border border-indigo-500/20' 
                        : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/50'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-400' : 'text-zinc-500'}`} />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Role simulator & User profile */}
            <div className="p-4 border-t border-zinc-800/50 bg-zinc-950/20 mt-auto">
              <div className="text-[10px] uppercase font-bold text-zinc-500 mb-2 flex items-center gap-1.5 font-mono">
                <ShieldCheck className="w-3 h-3 text-indigo-400" />
                Simulate Role
              </div>
              <div className="relative">
                <select
                  value={userRole}
                  onChange={(e) => handleRoleChange(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 text-xs text-zinc-300 rounded-lg p-2 pr-8 appearance-none focus:outline-none focus:border-indigo-500 cursor-pointer"
                >
                  {roles.map((r) => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-zinc-500 absolute right-2.5 top-2.5 pointer-events-none" />
              </div>
              
              <div className="mt-4 flex items-center justify-between pt-3 border-t border-zinc-800/30">
                <div className="flex items-center gap-2.5 overflow-hidden">
                  <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center border border-zinc-700/80 shrink-0 overflow-hidden">
                    {userPicture ? (
                      <img src={userPicture} alt={userName} className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-4 h-4 text-zinc-400" />
                    )}
                  </div>
                  <div className="overflow-hidden">
                    <span className="text-xs font-semibold block text-zinc-200 truncate">{userName}</span>
                    <span className="text-[10px] text-zinc-500 truncate block">{userEmail}</span>
                  </div>
                </div>
                <button 
                  onClick={handleLogout}
                  title="Log Out"
                  className="p-1.5 rounded-lg border border-zinc-850 hover:bg-red-500/10 hover:border-red-500/20 text-zinc-500 hover:text-red-400 transition"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </aside>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* Header */}
        <header className="h-16 bg-zinc-900/30 border-b border-zinc-800/40 flex items-center justify-between px-3 sm:px-6 backdrop-blur-md z-10 gap-2 sm:gap-4">
          
          <div className="flex items-center gap-2 flex-1 min-w-0">
            {/* Mobile Hamburger Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="md:hidden p-2 rounded-xl bg-zinc-900 border border-zinc-800/80 text-zinc-300 hover:text-white hover:bg-zinc-800 shrink-0 transition"
              title="Open Navigation Menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Search bar */}
            <form onSubmit={handleSearchSubmit} className="w-full max-w-xs sm:max-w-lg">
              <div className="relative">
                <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="Ask feedback search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-zinc-950/50 border border-zinc-800/80 rounded-xl py-2 pl-9 pr-3 text-xs sm:text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition duration-200 placeholder-zinc-500 truncate"
                />
              </div>
            </form>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 sm:gap-4 shrink-0">
            
            {/* Dynamic Company Logo */}
            <div className="hidden sm:block">
              {(() => {
                const target = searchQuery || workspace;
                const cleanTarget = target.trim();
                if (!cleanTarget) return null;
                
                const companyName = cleanTarget.split(' ')[0].replace(/[^a-zA-Z0-9]/g, '');
                if (!companyName) return null;
                
                const brandDomains: { [key: string]: string } = {
                  swiggy: 'swiggy.com',
                  uber: 'uber.com',
                  zomato: 'zomato.com',
                  netflix: 'netflix.com',
                  google: 'google.com',
                  apple: 'apple.com',
                  microsoft: 'microsoft.com',
                  slack: 'slack.com',
                  github: 'github.com',
                  jira: 'atlassian.com',
                  trello: 'trello.com',
                  linear: 'linear.app',
                  clickup: 'clickup.com',
                  acme: 'acme.com'
                };
                
                const cleanName = companyName.toLowerCase();
                const domain = brandDomains[cleanName] || `${cleanName}.com`;
                const logoUrl = `https://logo.clearbit.com/${domain}`;
                
                return <DynamicLogo imgUrl={logoUrl} label={companyName} key={companyName} />;
              })()}
            </div>

            {/* Notification drop */}
            <div className="relative">
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="w-9 h-9 rounded-xl border border-zinc-800/85 bg-zinc-900/30 flex items-center justify-center hover:bg-zinc-800/60 transition relative shrink-0"
              >
                <Bell className="w-4 h-4 text-zinc-300" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-red-500 text-[10px] font-bold text-white flex items-center justify-center pulse-critical">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notification dropdown */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-zinc-900/95 border border-zinc-800 rounded-xl shadow-2xl backdrop-blur-xl py-2 text-sm z-50">
                  <div className="px-4 py-2 border-b border-zinc-800 flex justify-between items-center">
                    <span className="font-semibold text-zinc-200">Alerts & Notifications</span>
                    <button 
                      onClick={() => {
                        setNotifications(notifications.map(n => ({ ...n, read: true })));
                      }}
                      className="text-xs text-indigo-400 hover:text-indigo-300 font-medium"
                    >
                      Mark all read
                    </button>
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    {notifications.map((n) => (
                      <div 
                        key={n.id} 
                        className={`px-4 py-3 border-b border-zinc-800 last:border-b-0 flex gap-2 hover:bg-zinc-850 cursor-pointer ${!n.read ? 'bg-indigo-600/5' : ''}`}
                      >
                        <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${n.type === 'critical' ? 'bg-red-500' : (n.type === 'assignment' ? 'bg-indigo-400' : 'bg-zinc-500')}`} />
                        <div>
                          <p className="text-xs text-zinc-300 font-medium">{n.text}</p>
                          <span className="text-[10px] text-zinc-500 mt-1 block">{n.time}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* AI Status Indicator */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
              <span className="text-[10px] text-indigo-300 font-semibold tracking-wider uppercase font-mono">Feedback Pipeline Live</span>
            </div>
            
          </div>
        </header>

        {/* Content body */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 bg-zinc-950/40">
          {children}
        </main>
      </div>

    </div>
  );
}
