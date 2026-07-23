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
  Zap
} from 'lucide-react';

interface SidebarLayoutProps {
  children: React.ReactNode;
}

export default function SidebarLayout({ children }: SidebarLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  
  // Workspace and User state (synced with localStorage or mock)
  const [workspace, setWorkspace] = useState('Acme Workspace');
  const [userRole, setUserRole] = useState('Super Admin');
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, type: 'critical', text: 'Critical issue detected: Payment checkout crashes', time: '5m ago', read: false },
    { id: 2, type: 'assignment', text: 'Stripe Bug assigned to Rahul Sharma', time: '1h ago', read: false },
    { id: 3, type: 'health', text: 'Health Index changed from 85 to 64', time: '3h ago', read: true }
  ]);

  // Sync role and workspace on load
  useEffect(() => {
    const savedRole = localStorage.getItem('echoops_role');
    if (savedRole) setUserRole(savedRole);
    const savedWS = localStorage.getItem('echoops_workspace');
    if (savedWS) setWorkspace(savedWS);
  }, []);

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
      
      {/* Sidebar */}
      <aside className="w-64 bg-zinc-900/60 border-r border-zinc-800/80 flex flex-col backdrop-blur-xl z-20">
        
        {/* Logo and Branding */}
        <div className="p-5 border-b border-zinc-800/50 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/20 pulse-critical">
            <Zap className="w-4 h-4 text-white" />
          </div>
          <div>
            <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-indigo-400 via-purple-400 to-indigo-300 bg-clip-text text-transparent">EchoOps</span>
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
          <div className="mt-4 flex items-center gap-2.5 pt-3 border-t border-zinc-800/30">
            <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center border border-zinc-700/80">
              <User className="w-4 h-4 text-zinc-400" />
            </div>
            <div className="overflow-hidden">
              <span className="text-xs font-semibold block text-zinc-200 truncate">Rahul Sharma</span>
              <span className="text-[10px] text-zinc-500 truncate block">rahul@acme.io</span>
            </div>
          </div>
        </div>

      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* Header */}
        <header className="h-16 bg-zinc-900/30 border-b border-zinc-800/40 flex items-center justify-between px-6 backdrop-blur-md z-10">
          
          {/* Search bar */}
          <form onSubmit={handleSearchSubmit} className="w-full max-w-lg">
            <div className="relative">
              <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Ask feedback search... (e.g. 'Show payment issues')"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-zinc-950/50 border border-zinc-800/80 rounded-xl py-2 pl-9 pr-4 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition duration-200 placeholder-zinc-500"
              />
            </div>
          </form>

          {/* Action buttons */}
          <div className="flex items-center gap-4">
            
            {/* Notification drop */}
            <div className="relative">
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="w-9 h-9 rounded-xl border border-zinc-800/85 bg-zinc-900/30 flex items-center justify-center hover:bg-zinc-800/60 transition relative"
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
                <div className="absolute right-0 mt-2 w-80 bg-zinc-900/95 border border-zinc-800 rounded-xl shadow-2xl backdrop-blur-xl py-2 text-sm z-50">
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
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
              <span className="text-[10px] text-indigo-300 font-semibold tracking-wider uppercase font-mono">Feedback Pipeline Live</span>
            </div>
            
          </div>
        </header>

        {/* Content body */}
        <main className="flex-1 overflow-y-auto p-6 bg-zinc-950/40">
          {children}
        </main>
      </div>

    </div>
  );
}
