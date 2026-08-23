'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Sparkles, ArrowRight, X, Clock, Compass, ShieldAlert, Cpu } from 'lucide-react';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CommandPalette({ isOpen, onClose }: CommandPaletteProps) {
  const router = useRouter();
  const [query, setQuery] = useState('');

  // Handle Cmd+K global hotkey
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) {
          onClose();
        } else {
          // Open menu via trigger or parent
        }
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSearchSubmit = (searchStr: string) => {
    if (!searchStr.trim()) return;
    onClose();
    router.push(`/?search=${encodeURIComponent(searchStr)}`);
  };

  const handleAiQuestionSelect = (question: string) => {
    onClose();
    router.push(`/chat?prompt=${encodeURIComponent(question)}`);
  };

  const recentSearches = [
    { title: 'Payment Crash after UPI', sub: 'Critical Issue #1 • 2,431 reports', url: '/issues/1' },
    { title: 'Refund Delay & Status Inaccurate', sub: 'High Issue #2 • 1,102 reports', url: '/issues/2' },
    { title: 'Android 15 Google OAuth Lockout', sub: 'High Issue #4 • 563 reports', url: '/issues/4' }
  ];

  const aiPrompts = [
    'What are customers complaining about most?',
    'Which problems should engineering fix first?',
    'What feature do customers want most?',
    'Compare Android vs iOS crash rates'
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div 
        className="fixed inset-0" 
        onClick={onClose} 
      />
      <div className="relative w-full max-w-2xl bg-[#0B0B0F] border border-zinc-800/90 rounded-2xl shadow-2xl overflow-hidden z-10 glow-ai-card">
        
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-zinc-800/80 bg-[#0D0D12]">
          <Search className="w-5 h-5 text-zinc-400 shrink-0 mr-3" />
          <input
            type="text"
            autoFocus
            placeholder="Search feedback, problems, teams, or ask EchoOps AI... (⌘K)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSearchSubmit(query);
            }}
            className="w-full bg-transparent text-zinc-100 text-sm focus:outline-none placeholder-zinc-500"
          />
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-[10px] font-mono uppercase bg-zinc-900 border border-zinc-800 text-zinc-400 px-2 py-0.5 rounded-md">ESC</span>
            <button 
              onClick={onClose}
              className="p-1 rounded-lg text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Results / Suggestions Container */}
        <div className="p-4 space-y-5 max-h-[420px] overflow-y-auto">
          
          {/* Quick AI Query Suggestion */}
          <div>
            <div className="text-[11px] font-mono font-semibold uppercase tracking-wider text-indigo-400 mb-2.5 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              Ask EchoOps AI Copilot
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {aiPrompts.map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => handleAiQuestionSelect(prompt)}
                  className="text-left p-2.5 rounded-xl bg-[#111116] border border-zinc-800/60 hover:border-indigo-500/40 hover:bg-indigo-500/5 text-xs text-zinc-300 transition flex items-center justify-between group"
                >
                  <span className="truncate pr-2">"{prompt}"</span>
                  <ArrowRight className="w-3.5 h-3.5 text-zinc-500 group-hover:text-indigo-400 transition shrink-0" />
                </button>
              ))}
            </div>
          </div>

          {/* Recent Problems & Top Matches */}
          <div>
            <div className="text-[11px] font-mono font-semibold uppercase tracking-wider text-zinc-500 mb-2.5 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              Recent High-Priority Issues
            </div>
            <div className="space-y-1.5">
              {recentSearches.map((item) => (
                <div
                  key={item.title}
                  onClick={() => { onClose(); router.push(item.url); }}
                  className="p-3 rounded-xl bg-[#111116]/80 hover:bg-zinc-850 border border-zinc-850 cursor-pointer flex items-center justify-between transition group"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400">
                      <ShieldAlert className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-zinc-200 group-hover:text-white transition">{item.title}</p>
                      <p className="text-[10px] text-zinc-500">{item.sub}</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-indigo-400 opacity-0 group-hover:opacity-100 transition">View Issue →</span>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Shortcuts */}
          <div>
            <div className="text-[11px] font-mono font-semibold uppercase tracking-wider text-zinc-500 mb-2 flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5" />
              Quick Navigation Shortcuts
            </div>
            <div className="flex flex-wrap gap-2 text-xs">
              <button onClick={() => { onClose(); router.push('/'); }} className="px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-800 transition">
                / Dashboard
              </button>
              <button onClick={() => { onClose(); router.push('/voice'); }} className="px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-800 transition">
                / Voice Intelligence
              </button>
              <button onClick={() => { onClose(); router.push('/integrations'); }} className="px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-800 transition">
                / Integrations & Jira
              </button>
              <button onClick={() => { onClose(); router.push('/features'); }} className="px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-800 transition">
                / Feature Requests
              </button>
            </div>
          </div>

        </div>

        {/* Footer info */}
        <div className="px-4 py-2.5 bg-zinc-950 border-t border-zinc-850 flex justify-between items-center text-[10px] text-zinc-500 font-mono">
          <span>Press <kbd className="text-zinc-400 font-semibold">ENTER</kbd> to search</span>
          <span className="flex items-center gap-1 text-indigo-400">
            <Cpu className="w-3 h-3" /> EchoOps Neural Engine Active
          </span>
        </div>

      </div>
    </div>
  );
}
