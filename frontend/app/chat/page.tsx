'use client';

import React, { useState, useRef, useEffect } from 'react';
import SidebarLayout from '../components/SidebarLayout';
import { 
  Sparkles, 
  Send, 
  Bot, 
  User, 
  MessageSquare,
  AlertTriangle,
  Lightbulb,
  TrendingUp,
  ArrowRight,
  RefreshCw,
  Plus,
  Clock,
  CheckCircle,
  ExternalLink,
  GitBranch,
  Layers,
  Search,
  Paperclip,
  ChevronRight,
  Activity,
  X,
  ArrowUp,
  Zap
} from 'lucide-react';
import { useRouter } from 'next/navigation';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  suggested_issues?: any[];
  sources?: any[];
}

export default function ChatCopilot() {
  const router = useRouter();

  const [historySidebarOpen, setHistorySidebarOpen] = useState(true);
  const [conversations, setConversations] = useState([
    { id: 'c1', title: 'What should engineering fix first?', date: 'Just now' },
    { id: 'c2', title: 'Why is customer satisfaction dropping?', date: 'Yesterday' },
    { id: 'c3', title: 'Analyze version 12.5 release', date: 'Aug 20' },
    { id: 'c4', title: 'Feature requests ranking', date: 'Aug 19' }
  ]);
  const [activeConvId, setActiveConvId] = useState<string | null>(null);

  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [showCommandsMenu, setShowCommandsMenu] = useState(false);

  const [jiraModalOpen, setJiraModalOpen] = useState(false);
  const [jiraProblemTitle, setJiraProblemTitle] = useState('Payment crashes after UPI');
  const [toast, setToast] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const quickSuggestions = [
    { text: "What is our biggest customer problem?", icon: AlertTriangle, color: 'text-red-400' },
    { text: "What should engineering fix first?", icon: Zap, color: 'text-indigo-400' },
    { text: "Why is customer satisfaction changing?", icon: TrendingUp, color: 'text-emerald-400' },
    { text: "What feature do customers want most?", icon: Lightbulb, color: 'text-amber-400' },
    { text: "What changed after the latest release?", icon: Activity, color: 'text-purple-400' },
    { text: "Show me critical issues.", icon: AlertTriangle, color: 'text-red-500' }
  ];

  const commandsList = [
    { cmd: '/problems', label: 'Show top active problems' },
    { cmd: '/feedback', label: 'View recent customer signals' },
    { cmd: '/releases', label: 'Analyze release regressions' },
    { cmd: '/features', label: 'Rank feature requests' },
    { cmd: '/teams', label: 'View team assignments' }
  ];

  const handleNewConversation = () => {
    setMessages([]);
    setActiveConvId(null);
    setQuery('');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    if (val.startsWith('/')) {
      setShowCommandsMenu(true);
    } else {
      setShowCommandsMenu(false);
    }
  };

  const selectCommand = (cmd: string) => {
    setQuery(cmd + ' ');
    setShowCommandsMenu(false);
  };

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || query;
    if (!text.trim()) return;

    const userMsg: ChatMessage = { id: Date.now().toString(), role: 'user', text };
    setMessages(prev => [...prev, userMsg]);
    setQuery('');
    setShowCommandsMenu(false);
    setLoading(true);

    try {
      const res = await fetch('http://localhost:8000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text })
      });
      if (!res.ok) throw new Error('Chat API failed');
      const data = await res.json();
      
      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        text: data.response,
        suggested_issues: data.suggested_issues || [],
        sources: [
          { name: 'Play Store', count: '8,421 reviews' },
          { name: 'App Store', count: '4,218 reviews' },
          { name: 'Customer Calls', count: '1,204 recordings' },
          { name: 'Zendesk', count: '3,829 tickets' }
        ]
      };
      setMessages(prev => [...prev, botMsg]);
    } catch (err) {
      setTimeout(() => {
        let responseText = "";
        const qL = text.toLowerCase().trim();

        // Out of Scope Filter
        if (["who is modi", "capital of france", "tell a joke", "write a python", "write code"].some(k => qL.includes(k))) {
          responseText = "I’m EchoOps AI, focused on your company’s customer feedback, product issues, releases, and operational data. Try asking me about customer problems, trends, feature requests, or product performance.";
        } else if (qL.includes('biggest') || qL.includes('fix first') || qL.includes('engineering') || qL.includes('/problems')) {
          responseText = "Based on 152,948 customer signals, I recommend prioritizing these problems:\n\n1. **Payment crashes after UPI** (Health Score: 98, 2,431 reports, ↑ 42% growth)\n2. **Refund taking too long** (Health Score: 87, 1,102 reports, ↑ 18% growth)\n3. **OTP verification code not received** (Health Score: 82, 563 reports, ↑ 22% growth)";
        } else if (qL.includes('feature') || qL.includes('want most') || qL.includes('/features')) {
          responseText = "The most requested feature is **Dark Mode Support** with 1,284 customer upvotes (↑ 32%), followed by **Offline Mode** (813 upvotes) and **Apple Pay for Web** (501 upvotes).";
        } else if (qL.includes('release') || qL.includes('v14') || qL.includes('v12.5') || qL.includes('/releases')) {
          responseText = "**RELEASE ANALYSIS (Version 12.5)**\n\n- Customer Satisfaction: 78% → 84%\n- Crash Reports: ↓ 42%\n- Payment Complaints: ↑ 18%\n\n**✦ AI Assessment**: Overall release impact is positive, but payment confirmation crashes increased on Android 15 and require investigation.";
        } else {
          responseText = "I analyzed your request across 152,948 customer signals. Currently, we have 8 critical problems active. The highest revenue risk is associated with the payment gateway checkout flow ($42,000 estimated risk).";
        }

        const botMsg: ChatMessage = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          text: responseText,
          suggested_issues: [
            { id: 1, title: 'Payment crashes after UPI', score: 98, status: 'In Progress' },
            { id: 2, title: 'Refund taking too long', score: 87, status: 'Open' }
          ],
          sources: [
            { name: 'Play Store', count: '8,421 reviews' },
            { name: 'App Store', count: '4,218 reviews' },
            { name: 'Customer Calls', count: '1,204 recordings' }
          ]
        };
        setMessages(prev => [...prev, botMsg]);
      }, 600);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateJiraConfirm = () => {
    setJiraModalOpen(false);
    setToast('✓ Created Jira Issue PAY-4821 in Acme Engineering project');
    setTimeout(() => setToast(null), 4000);
  };

  return (
    <SidebarLayout>
      <div className="flex h-[calc(100vh-100px)] overflow-hidden max-w-7xl mx-auto border border-white/[0.06] rounded-3xl bg-[#050505]">
        
        {/* Toast Alert */}
        {toast && (
          <div className="fixed top-5 right-5 z-50 p-4 rounded-xl bg-[#08080A] border border-emerald-500/40 text-emerald-400 text-xs font-semibold shadow-2xl flex items-center gap-2 animate-fade-in">
            <CheckCircle className="w-4 h-4" />
            <span>{toast}</span>
          </div>
        )}

        {/* Collapsible History Sidebar */}
        <div className={`${historySidebarOpen ? 'w-64' : 'w-0 opacity-0'} transition-all duration-300 bg-[#08080A] border-r border-white/[0.06] flex flex-col justify-between overflow-hidden shrink-0`}>
          <div className="p-4 space-y-4">
            <button 
              onClick={handleNewConversation}
              className="w-full py-2.5 px-3 rounded-xl bg-white/[0.04] border border-white/[0.08] hover:border-white/[0.16] text-xs font-bold text-white flex items-center justify-center gap-2 transition"
            >
              <Plus className="w-4 h-4 text-indigo-400" /> New conversation
            </button>

            <div className="space-y-1">
              <span className="text-[10px] font-mono uppercase font-bold text-zinc-500 tracking-wider px-2">Recent Conversations</span>
              <div className="space-y-1 pt-1">
                {conversations.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => {
                      setActiveConvId(c.id);
                      handleSendMessage(c.title);
                    }}
                    className={`w-full text-left p-2.5 rounded-xl text-xs transition truncate block ${
                      activeConvId === c.id ? 'bg-white/[0.08] text-white font-semibold' : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.03]'
                    }`}
                  >
                    <span className="block truncate">{c.title}</span>
                    <span className="text-[9px] text-zinc-600 font-mono block mt-0.5">{c.date}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="p-4 border-t border-white/[0.06] text-[11px] font-mono text-zinc-500">
            EchoOps AI Analyst v2.4
          </div>
        </div>

        {/* Main Conversation Area */}
        <div className="flex-1 flex flex-col justify-between h-full bg-[#050505] relative overflow-hidden">
          
          {/* Header Toggle */}
          <div className="px-6 py-3.5 border-b border-white/[0.06] bg-[#08080A] flex justify-between items-center shrink-0">
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setHistorySidebarOpen(!historySidebarOpen)}
                className="p-1.5 rounded-lg bg-white/[0.03] border border-white/[0.06] text-zinc-400 hover:text-white transition"
              >
                <Layers className="w-4 h-4" />
              </button>
              <div>
                <h2 className="text-sm font-bold text-white font-heading flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-indigo-400" /> Ask EchoOps
                </h2>
                <span className="text-[10px] font-mono text-zinc-500 block">Customer Intelligence Copilot</span>
              </div>
            </div>

            <button onClick={handleNewConversation} className="p-1.5 rounded-lg bg-white/[0.03] text-zinc-400 hover:text-white transition">
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>

          {/* EMPTY STATE OR CONVERSATION LOG */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-6 max-w-2xl mx-auto py-8">
                
                {/* Center Animated Logo */}
                <div className="w-16 h-16 rounded-3xl bg-indigo-600/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shadow-xl ambient-signal-pulse">
                  <Sparkles className="w-8 h-8" />
                </div>

                <div className="space-y-2">
                  <h1 className="text-3xl font-extrabold text-white tracking-tight font-heading">
                    Ask EchoOps
                  </h1>
                  <p className="text-xs sm:text-sm text-zinc-400">
                    Your AI analyst for customer feedback, product problems, and engineering priorities.
                  </p>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.03] border border-white/[0.06] text-[11px] font-mono text-zinc-400 mt-2">
                    <span>152,948 signals analyzed</span>
                    <span>•</span>
                    <span>248 active problems</span>
                    <span>•</span>
                    <span className="text-red-400 font-bold">8 critical</span>
                  </div>
                </div>

                {/* Suggested Questions Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full text-left pt-2">
                  {quickSuggestions.map((s) => {
                    const Icon = s.icon;
                    return (
                      <div
                        key={s.text}
                        onClick={() => handleSendMessage(s.text)}
                        className="glass-panel p-4 rounded-2xl border border-white/[0.06] hover:border-indigo-500/40 bg-[#08080A] cursor-pointer flex justify-between items-center group transition card-hover"
                      >
                        <div className="flex items-center gap-3">
                          <span className={`p-2 rounded-xl bg-white/[0.03] ${s.color}`}>
                            <Icon className="w-4 h-4" />
                          </span>
                          <span className="text-xs font-semibold text-zinc-200">{s.text}</span>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-zinc-500 group-hover:text-indigo-400 group-hover:translate-x-1 transition" />
                      </div>
                    );
                  })}
                </div>

              </div>
            ) : (
              
              /* Conversation Message List */
              <div className="space-y-6 max-w-4xl mx-auto">
                {messages.map((m) => {
                  const isBot = m.role === 'assistant';
                  return (
                    <div key={m.id} className="space-y-3">
                      <div className="flex items-center gap-2 text-xs font-mono">
                        <span className={`w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-bold ${
                          isBot ? 'bg-indigo-600/10 text-indigo-400 border border-indigo-500/30' : 'bg-white/[0.06] text-zinc-300'
                        }`}>
                          {isBot ? '✦' : <User className="w-3 h-3" />}
                        </span>
                        <span className="font-bold text-zinc-300">{isBot ? 'EchoOps AI Analyst' : 'You'}</span>
                        {isBot && (
                          <span className="text-[9px] bg-indigo-500/10 text-indigo-300 px-2 py-0.5 rounded-full font-mono border border-indigo-500/20">
                            AI Confidence 92%
                          </span>
                        )}
                      </div>

                      {/* Content Card */}
                      <div className={`p-5 rounded-2xl border text-xs leading-relaxed ${
                        isBot 
                          ? 'bg-[#08080A] border-white/[0.06] text-zinc-200 glow-ai-card space-y-4' 
                          : 'bg-white/[0.03] border-white/[0.06] text-white font-medium'
                      }`}>
                        {m.text.split('\n').map((line, lIdx) => (
                          <p key={lIdx} className="mt-1.5 first:mt-0">
                            {line.split('**').map((part, pIdx) => 
                              pIdx % 2 === 1 ? <strong key={pIdx} className="text-indigo-300 font-bold">{part}</strong> : part
                            )}
                          </p>
                        ))}

                        {/* Interactive Problem Recommendation Cards */}
                        {isBot && m.suggested_issues && m.suggested_issues.length > 0 && (
                          <div className="pt-3 border-t border-white/[0.06] space-y-3">
                            <span className="text-[10px] font-mono uppercase text-zinc-400 font-bold">Recommended Engineering Priorities</span>
                            
                            <div className="space-y-2">
                              {m.suggested_issues.map((issue: any) => (
                                <div key={issue.id} className="p-4 rounded-xl bg-[#050505] border border-white/[0.06] flex items-center justify-between gap-4">
                                  <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                      <span className="font-bold text-white text-sm font-heading">{issue.title}</span>
                                      <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold bg-purple-500/10 text-purple-400 border border-purple-500/30">
                                        ● Health {issue.score}
                                      </span>
                                    </div>
                                    <span className="text-[10px] font-mono text-zinc-400 block">2,431 reports • Revenue Risk: HIGH ($42K)</span>
                                  </div>

                                  <div className="flex items-center gap-2 shrink-0">
                                    <button 
                                      onClick={() => {
                                        setJiraProblemTitle(issue.title);
                                        setJiraModalOpen(true);
                                      }}
                                      className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition shadow flex items-center gap-1"
                                    >
                                      <GitBranch className="w-3.5 h-3.5" /> Create Jira Issue
                                    </button>
                                    <button 
                                      onClick={() => router.push(`/issues/${issue.id}`)}
                                      className="px-3 py-1.5 rounded-lg bg-white/[0.04] text-zinc-200 text-xs font-bold hover:bg-white/[0.08] transition"
                                    >
                                      View Problem →
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Data Source Transparency Bar */}
                        {isBot && m.sources && (
                          <div className="pt-2 border-t border-white/[0.04] flex items-center gap-3 text-[10px] font-mono text-zinc-500">
                            <span>Based on:</span>
                            {m.sources.map((s: any, idx: number) => (
                              <span key={idx} className="bg-white/[0.03] px-2 py-0.5 rounded text-zinc-400 border border-white/[0.06]">
                                {s.name}: {s.count}
                              </span>
                            ))}
                          </div>
                        )}

                      </div>
                    </div>
                  );
                })}

                {loading && (
                  <div className="p-4 rounded-2xl bg-[#08080A] border border-white/[0.06] text-xs text-zinc-400 flex items-center gap-3 animate-pulse">
                    <Sparkles className="w-4 h-4 text-indigo-400 animate-spin" />
                    <span>EchoOps is analyzing customer telemetry & generating structured recommendation...</span>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>

            )}

          </div>

          {/* FIXED BOTTOM COMMAND INPUT BAR */}
          <div className="p-4 border-t border-white/[0.06] bg-[#08080A] shrink-0 relative">
            
            {/* Slash Command Suggestions Menu */}
            {showCommandsMenu && (
              <div className="absolute bottom-full left-4 mb-2 w-72 bg-[#0C0C10] border border-white/[0.08] rounded-2xl p-2 shadow-2xl z-30 space-y-1">
                <span className="text-[10px] font-mono uppercase text-zinc-500 px-2 font-bold block mb-1">Commands</span>
                {commandsList.map((c) => (
                  <button
                    key={c.cmd}
                    onClick={() => selectCommand(c.cmd)}
                    className="w-full text-left p-2 rounded-xl text-xs hover:bg-white/[0.06] transition flex justify-between items-center"
                  >
                    <span className="font-mono text-indigo-400 font-bold">{c.cmd}</span>
                    <span className="text-[10px] text-zinc-400">{c.label}</span>
                  </button>
                ))}
              </div>
            )}

            <form 
              onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }}
              className="bg-[#050505] border border-white/[0.08] rounded-2xl p-2.5 flex items-center gap-2 focus-within:border-indigo-500/50 transition shadow-lg"
            >
              <div className="flex items-center gap-1.5 px-2 text-zinc-500 text-xs font-mono border-r border-white/[0.06]">
                <Paperclip className="w-3.5 h-3.5 hover:text-zinc-300 cursor-pointer" />
                <span className="text-[10px] bg-white/[0.04] px-1.5 py-0.5 rounded text-zinc-400">All Sources</span>
              </div>

              <input
                type="text"
                value={query}
                onChange={handleInputChange}
                className="flex-1 bg-transparent border-0 focus:outline-none text-xs sm:text-sm text-white placeholder-zinc-500 px-2 font-sans"
                placeholder="Ask EchoOps anything... (or type / for commands)"
              />

              <button 
                type="submit" 
                disabled={!query.trim() || loading}
                className="w-8 h-8 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white flex items-center justify-center transition shadow"
              >
                <ArrowUp className="w-4 h-4" />
              </button>
            </form>
          </div>

        </div>

      </div>

      {/* Jira Action Confirmation Modal */}
      {jiraModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-md bg-[#0C0C10] border border-white/[0.08] rounded-2xl p-6 space-y-4 shadow-2xl relative">
            <button onClick={() => setJiraModalOpen(false)} className="absolute top-4 right-4 text-zinc-500 hover:text-white"><X className="w-4 h-4" /></button>
            
            <div className="flex items-center gap-2">
              <GitBranch className="w-4 h-4 text-indigo-400" />
              <h3 className="text-base font-bold text-white font-heading">Confirm Jira Issue Creation</h3>
            </div>

            <p className="text-xs text-zinc-400">
              EchoOps will create a Jira issue in project <strong>PAY (Payments Engine)</strong>.
            </p>

            <div className="p-3.5 rounded-xl bg-[#050505] border border-white/[0.06] text-xs font-mono space-y-1.5">
              <div><span className="text-zinc-500">Title:</span> <strong className="text-white block">{jiraProblemTitle}</strong></div>
              <div><span className="text-zinc-500">Priority:</span> <strong className="text-red-400">Highest</strong></div>
              <div><span className="text-zinc-500">Assignee:</span> <strong className="text-indigo-400">Payments Engineering</strong></div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button onClick={() => setJiraModalOpen(false)} className="px-4 py-2 bg-zinc-800 text-zinc-300 text-xs rounded-xl">Cancel</button>
              <button onClick={handleCreateJiraConfirm} className="px-4 py-2 bg-indigo-600 text-white text-xs font-bold rounded-xl shadow">Confirm & Create Ticket</button>
            </div>
          </div>
        </div>
      )}

    </SidebarLayout>
  );
}
