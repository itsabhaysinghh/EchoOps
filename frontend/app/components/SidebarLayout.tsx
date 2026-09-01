'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import CommandPalette from './CommandPalette';
import AIChatDrawer from './AIChatDrawer';
import { 
  LayoutDashboard, 
  CircleAlert, 
  MessageSquare, 
  Mic, 
  Lightbulb, 
  Sparkles, 
  Users, 
  Plug, 
  FileText, 
  BarChart3, 
  Settings, 
  HelpCircle,
  Search,
  ChevronDown,
  User,
  ShieldCheck,
  Zap,
  LogOut,
  Menu,
  X,
  Bell,
  Layers,
  Bot
} from 'lucide-react';

const DynamicLogo = ({ imgUrl, label }: { imgUrl: string; label: string }) => {
  const [error, setError] = useState(false);

  if (!label || label.trim() === "") return null;

  return (
    <div className="flex items-center gap-2 bg-[#0D0D12] border border-zinc-800/80 px-2.5 py-1.5 rounded-xl transition">
      <div className="w-5 h-5 rounded-md overflow-hidden flex items-center justify-center bg-zinc-900 border border-zinc-800 shrink-0">
        {error ? (
          <div className="w-full h-full bg-zinc-800 flex items-center justify-center">
            <span className="text-[9px] font-extrabold text-zinc-400 font-mono uppercase">
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
  const [cmdPaletteOpen, setCmdPaletteOpen] = useState(false);
  const [aiDrawerOpen, setAiDrawerOpen] = useState(false);

  const [workspace, setWorkspace] = useState('Acme Workspace');
  const [userRole, setUserRole] = useState('Super Admin');
  const [userName, setUserName] = useState('Rahul Sharma');
  const [userEmail, setUserEmail] = useState('rahul@acme.io');
  const [userPicture, setUserPicture] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, type: 'critical', text: 'Critical problem: Payment crash after UPI', time: '5m ago', read: false },
    { id: 2, type: 'assignment', text: 'Stripe Bug assigned to Rahul Sharma', time: '1h ago', read: false },
    { id: 3, type: 'health', text: 'Health Index changed from 85 to 64', time: '3h ago', read: true }
  ]);

  // Handle Cmd+K keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setCmdPaletteOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Sync auth state on load
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
      if (q) setSearchQuery(q);
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
    window.dispatchEvent(new Event('role-changed'));
  };

  const navSections = [
    {
      title: 'Intelligence',
      items: [
        { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
        { name: 'Problems', href: '/problems', icon: CircleAlert },
        { name: 'Feedback', href: '/feedback', icon: MessageSquare },
        { name: 'Voice', href: '/voice', icon: Mic },
        { name: 'Insights', href: '/insights', icon: Sparkles },
        { name: 'Features', href: '/features', icon: Lightbulb },
        { name: 'AI Copilot', href: '/ai', icon: Bot }
      ]
    },
    {
      title: 'Operations',
      items: [
        { name: 'Teams', href: '/teams', icon: Users },
        { name: 'Releases', href: '/releases', icon: Layers },
        { name: 'Integrations', href: '/integrations', icon: Plug }
      ]
    },
    {
      title: 'Analytics & Admin',
      items: [
        { name: 'Reports', href: '/reports', icon: FileText },
        { name: 'Analytics', href: '/analytics', icon: BarChart3 },
        { name: 'Settings', href: '/settings', icon: Settings }
      ]
    }
  ];

  const unreadCount = notifications.filter(n => !n.read).length;

  // Breadcrumb formatting helper
  const getPageTitle = () => {
    if (pathname === '/' || pathname === '/dashboard') return 'Customer Intelligence';
    if (pathname.startsWith('/problems') || pathname.startsWith('/issues')) return 'Problems & Evidence';
    if (pathname === '/feedback' || pathname === '/vault') return 'Feedback Inbox';
    if (pathname === '/voice') return 'Voice Intelligence';
    if (pathname === '/insights') return 'AI Insights';
    if (pathname === '/features') return 'Feature Requests';
    if (pathname === '/ai' || pathname === '/chat') return 'AI Copilot';
    if (pathname === '/teams' || pathname === '/team') return 'Team Operations';
    if (pathname === '/releases') return 'Release Impact';
    if (pathname === '/integrations') return 'Integrations & Jira';
    if (pathname === '/reports') return 'Weekly Reports';
    if (pathname === '/analytics') return 'Product Analytics';
    if (pathname === '/settings') return 'Workspace Settings';
    if (pathname === '/onboarding') return 'Onboarding Wizard';
    return 'EchoOps';
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[#050505] text-zinc-100 font-sans">
      
      {/* Command Palette Modal */}
      <CommandPalette isOpen={cmdPaletteOpen} onClose={() => setCmdPaletteOpen(false)} />
      
      {/* Top Nav AI Copilot Drawer */}
      <AIChatDrawer isOpen={aiDrawerOpen} onClose={() => setAiDrawerOpen(false)} />

      {/* Desktop 230px Sidebar */}
      <aside className="hidden md:flex w-[230px] bg-[#050505] border-r border-white/[0.06] flex-col z-20 shrink-0 select-none">
        
        {/* Brand Header */}
        <div className="p-4 border-b border-white/[0.06] flex items-center justify-between">
          <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => router.push('/')}>
            <div className="w-7 h-7 rounded-xl bg-black border border-white/[0.08] flex items-center justify-center p-1 overflow-hidden shrink-0">
              <img src="/logo.png" alt="EchoOps Logo" className="w-full h-full object-contain" />
            </div>
            <div>
              <span className="font-bold text-sm tracking-tight text-white font-heading">EchoOps</span>
              <span className="text-[9px] block text-zinc-500 font-mono tracking-wider">PRODUCT OS</span>
            </div>
          </div>
        </div>

        {/* Workspace Selector */}
        <div className="px-3 py-2.5 border-b border-white/[0.06]">
          <div className="flex items-center justify-between p-2 rounded-lg bg-white/[0.03] border border-white/[0.06] text-xs cursor-pointer hover:bg-white/[0.06] transition">
            <div className="flex items-center gap-2">
              <Layers className="w-3.5 h-3.5 text-indigo-400" />
              <span className="font-medium truncate max-w-[120px] text-zinc-200">{workspace}</span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-zinc-500" />
          </div>
        </div>

        {/* Navigation Sections */}
        <nav className="flex-1 px-2 py-3 space-y-4 overflow-y-auto">
          {navSections.map((section) => (
            <div key={section.title} className="space-y-0.5">
              <div className="px-3 text-[10px] uppercase font-mono font-semibold text-zinc-500 tracking-wider mb-1">
                {section.title}
              </div>
              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`relative flex items-center gap-2.5 px-3 py-1.5 rounded-md text-xs font-medium transition duration-150 ${
                      isActive 
                        ? 'bg-white/[0.07] text-white font-semibold before:absolute before:left-0 before:top-1 before:bottom-1 before:w-0.5 before:rounded-r-full before:bg-ai-gradient' 
                        : 'text-zinc-400 hover:text-zinc-100 hover:bg-white/[0.04]'
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-indigo-400' : 'text-zinc-500'}`} />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>

        {/* Bottom Role Simulator & Profile */}
        <div className="p-3 border-t border-zinc-850 bg-[#09090D] space-y-3">
          <div className="space-y-1">
            <div className="text-[9px] uppercase font-mono font-bold text-zinc-500 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-indigo-400" />
              Role Simulator
            </div>
            <div className="relative">
              <select
                value={userRole}
                onChange={(e) => handleRoleChange(e.target.value)}
                className="w-full bg-[#111116] border border-zinc-800 text-[11px] text-zinc-300 rounded-lg p-1.5 pr-6 appearance-none focus:outline-none focus:border-indigo-500 cursor-pointer"
              >
                {['Super Admin', 'Admin', 'Product Manager', 'Engineering Manager', 'Developer', 'Customer Support', 'Viewer'].map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
              <ChevronDown className="w-3 h-3 text-zinc-500 absolute right-2 top-2 pointer-events-none" />
            </div>
          </div>
          
          <div className="flex items-center justify-between pt-2 border-t border-zinc-800/40">
            <div className="flex items-center gap-2 overflow-hidden">
              <div className="w-7 h-7 rounded-full bg-zinc-800 flex items-center justify-center border border-zinc-700 shrink-0 overflow-hidden">
                {userPicture ? (
                  <img src={userPicture} alt={userName} className="w-full h-full object-cover" />
                ) : (
                  <User className="w-3.5 h-3.5 text-zinc-400" />
                )}
              </div>
              <div className="overflow-hidden">
                <span className="text-[11px] font-semibold block text-zinc-200 truncate leading-tight">{userName}</span>
                <span className="text-[9px] text-zinc-500 truncate block font-mono">{userEmail}</span>
              </div>
            </div>
            <button 
              onClick={handleLogout}
              title="Log Out"
              className="p-1 rounded-lg border border-zinc-800 hover:bg-red-500/10 hover:border-red-500/20 text-zinc-500 hover:text-red-400 transition"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </aside>

      {/* Mobile Navigation Overlay Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md" onClick={() => setMobileMenuOpen(false)} />
          <aside className="relative w-72 max-w-[85vw] bg-[#080808] border-r border-zinc-800 flex flex-col h-full z-10 shadow-2xl overflow-y-auto">
            <div className="p-4 border-b border-zinc-850 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <img src="/logo.png" alt="EchoOps" className="w-7 h-7 object-contain" />
                <span className="font-bold text-base text-white">EchoOps</span>
              </div>
              <button onClick={() => setMobileMenuOpen(false)} className="p-1.5 text-zinc-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <nav className="flex-1 p-3 space-y-4">
              {navSections.map((sec) => (
                <div key={sec.title} className="space-y-1">
                  <div className="text-[10px] font-mono text-zinc-500 uppercase px-2">{sec.title}</div>
                  {sec.items.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-zinc-300 hover:bg-zinc-800"
                    >
                      <item.icon className="w-4 h-4 text-indigo-400" />
                      <span>{item.name}</span>
                    </Link>
                  ))}
                </div>
              ))}
            </nav>
          </aside>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-[#050505]">
        
        {/* Top Minimal Navigation Bar */}
        <header className="h-14 bg-[#080808]/90 border-b border-zinc-800/70 flex items-center justify-between px-4 sm:px-6 backdrop-blur-md z-10 gap-3">
          
          {/* Left: Breadcrumb & Title */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="md:hidden p-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white"
            >
              <Menu className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-2 text-xs font-medium">
              <span className="text-zinc-500">EchoOps</span>
              <span className="text-zinc-600">/</span>
              <span className="text-zinc-200 font-semibold">{getPageTitle()}</span>
            </div>
          </div>

          {/* Center: Command Palette Trigger Bar */}
          <button
            onClick={() => setCmdPaletteOpen(true)}
            className="hidden sm:flex items-center gap-2 w-full max-w-sm px-3.5 py-1.5 rounded-xl bg-[#0D0D12] border border-zinc-800 hover:border-zinc-700 text-xs text-zinc-400 transition"
          >
            <Search className="w-3.5 h-3.5 text-zinc-500" />
            <span className="flex-1 text-left truncate">Search feedback, problems, teams...</span>
            <kbd className="text-[10px] font-mono uppercase bg-zinc-900 border border-zinc-800 px-1.5 py-0.5 rounded text-zinc-400">⌘ K</kbd>
          </button>

          {/* Right Action Items */}
          <div className="flex items-center gap-2.5 shrink-0">
            
            {/* AI Assistant Button */}
            <button
              onClick={() => setAiDrawerOpen(true)}
              className="px-3 py-1.5 rounded-xl bg-indigo-500/10 border border-indigo-500/25 hover:bg-indigo-500/20 text-indigo-300 text-xs font-semibold flex items-center gap-1.5 transition shadow-sm"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
              <span className="hidden sm:inline">Ask AI</span>
            </button>

            {/* Notification Bell */}
            <div className="relative">
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="w-8 h-8 rounded-xl border border-zinc-800 bg-[#0D0D12] flex items-center justify-center hover:bg-zinc-800 transition relative"
              >
                <Bell className="w-3.5 h-3.5 text-zinc-300" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-[9px] font-bold text-white flex items-center justify-center pulse-critical">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notification Menu */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-[#0B0B0F] border border-zinc-800 rounded-xl shadow-2xl backdrop-blur-xl py-2 text-xs z-50">
                  <div className="px-4 py-2 border-b border-zinc-800 flex justify-between items-center">
                    <span className="font-semibold text-zinc-200">Alerts & Notifications</span>
                    <button 
                      onClick={() => setNotifications(notifications.map(n => ({ ...n, read: true })))}
                      className="text-[11px] text-indigo-400 hover:text-indigo-300"
                    >
                      Mark all read
                    </button>
                  </div>
                  <div className="max-h-60 overflow-y-auto">
                    {notifications.map((n) => (
                      <div key={n.id} className="px-4 py-2.5 border-b border-zinc-850 hover:bg-zinc-900/60 cursor-pointer flex gap-2">
                        <div className={`w-2 h-2 rounded-full mt-1 shrink-0 ${n.type === 'critical' ? 'bg-red-500' : 'bg-indigo-400'}`} />
                        <div>
                          <p className="text-zinc-300 font-medium">{n.text}</p>
                          <span className="text-[9px] text-zinc-500">{n.time}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Workspace & User Profile */}
            <div className="w-7 h-7 rounded-full bg-zinc-800 flex items-center justify-center border border-zinc-700 overflow-hidden cursor-pointer" onClick={() => router.push('/login')}>
              {userPicture ? (
                <img src={userPicture} alt={userName} className="w-full h-full object-cover" />
              ) : (
                <User className="w-3.5 h-3.5 text-zinc-400" />
              )}
            </div>

          </div>
        </header>

        {/* Content Viewport */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 bg-[#050505]">
          {children}
        </main>
      </div>

    </div>
  );
}
