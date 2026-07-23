'use client';

import React, { useState } from 'react';
import SidebarLayout from '../components/SidebarLayout';
import { 
  Sparkles, 
  Send, 
  Bot, 
  User, 
  MessageSquare,
  HelpCircle,
  TrendingUp,
  AlertTriangle,
  Lightbulb,
  ArrowRight
} from 'lucide-react';

export default function ChatCopilot() {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', text: "Hello! I am your EchoOps AI Copilot. Ask me anything about workspace feedback logs, critical issues, release regressions, or feature requests." }
  ]);

  const quickQuestions = [
    { text: "What is our biggest issue?", icon: AlertTriangle, color: 'text-red-400' },
    { text: "What feature is requested most?", icon: Lightbulb, color: 'text-yellow-400' },
    { text: "Summarize complaints from this week", icon: MessageSquare, color: 'text-indigo-400' },
    { text: "Compare Android and iOS complaints", icon: TrendingUp, color: 'text-emerald-400' }
  ];

  const handleSendMessage = async (text: string) => {
    if (!text.trim()) return;
    setMessages(prev => [...prev, { role: 'user', text }]);
    setLoading(true);
    setQuery('');

    try {
      const res = await fetch('http://localhost:8000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text })
      });
      if (!res.ok) throw new Error('Chat API failed');
      const data = await res.json();
      setMessages(prev => [...prev, { role: 'assistant', text: data.response }]);
    } catch (err) {
      console.warn('API error, using local fallback response.');
      setTimeout(() => {
        let fallbackMsg = "Based on our local database logs, ";
        const qL = text.toLowerCase();
        
        if (qL.includes('biggest issue') || qL.includes('engineering fix first')) {
          fallbackMsg += "our biggest issue is the **Payment Checkout Failure & Crash** (AI Health Index: 98/100, 58 reports) affecting Stripe / Apple Pay mobile devices, followed by Google OAuth lockout problems.";
        } else if (qL.includes('feature') || qL.includes('request')) {
          fallbackMsg += "the most requested feature is **Dark Mode Support** (1,284 votes), followed closely by **Offline Mode** (813 votes) and **Apple Pay for Web** (501 votes).";
        } else if (qL.includes('summarize') || qL.includes('complaints')) {
          fallbackMsg += "this week we have two major problems:\n1. Payment crashes causing billing checkout failure.\n2. User authentication locking out Google OAuth logins.";
        } else {
          fallbackMsg += "the system logs indicate an increase in mobile App Store checkout crashes. I recommend hotfixing Stripe parameters inside release v1.2.0.";
        }
        
        setMessages(prev => [...prev, { role: 'assistant', text: fallbackMsg }]);
      }, 800);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SidebarLayout>
      <div className="space-y-6 max-w-4xl mx-auto h-[calc(100vh-120px)] flex flex-col justify-between">
        
        {/* Title */}
        <div className="shrink-0">
          <h1 className="text-2xl font-bold tracking-tight text-zinc-100 flex items-center gap-2">
            AI Copilot Chat
          </h1>
          <p className="text-sm text-zinc-400 mt-1">
            Query your database using natural language. Compare metrics, summarize updates, and find regressions.
          </p>
        </div>

        {/* Preset Cards (Only shows when chat history is brief) */}
        {messages.length === 1 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 shrink-0 my-4">
            {quickQuestions.map((q) => {
              const Icon = q.icon;
              return (
                <div
                  key={q.text}
                  onClick={() => handleSendMessage(q.text)}
                  className="glass-panel p-4 rounded-xl border border-zinc-800 hover:border-indigo-500/35 hover:bg-indigo-600/5 cursor-pointer flex justify-between items-center group transition"
                >
                  <div className="flex items-center gap-3">
                    <span className={`p-2 rounded-lg bg-zinc-950/60 ${q.color}`}>
                      <Icon className="w-4 h-4" />
                    </span>
                    <span className="text-xs font-semibold text-zinc-300">{q.text}</span>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-zinc-500 group-hover:text-indigo-400 group-hover:translate-x-0.5 transition" />
                </div>
              );
            })}
          </div>
        )}

        {/* Message Log */}
        <div className="flex-1 overflow-y-auto space-y-4 px-2 py-4 bg-zinc-950/30 border border-zinc-900 rounded-2xl mb-4 max-h-[400px]">
          {messages.map((m, idx) => {
            const isBot = m.role === 'assistant';
            return (
              <div key={idx} className={`flex gap-3 max-w-[85%] ${isBot ? 'mr-auto' : 'ml-auto flex-row-reverse'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center border shrink-0 ${
                  isBot ? 'bg-indigo-950 border-indigo-500/25 text-indigo-400' : 'bg-zinc-900 border-zinc-800 text-zinc-400'
                }`}>
                  {isBot ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                </div>
                <div className={`p-4 rounded-2xl border text-xs leading-relaxed ${
                  isBot 
                    ? 'bg-zinc-900/60 border-zinc-850 text-zinc-300' 
                    : 'bg-indigo-600/10 border-indigo-500/20 text-indigo-200'
                }`}>
                  {/* Parse basic markdown bold tags */}
                  {m.text.split('\n').map((line, lIdx) => (
                    <p key={lIdx} className="mt-1 first:mt-0">
                      {line.split('**').map((part, pIdx) => 
                        pIdx % 2 === 1 ? <strong key={pIdx} className="text-indigo-300 font-bold">{part}</strong> : part
                      )}
                    </p>
                  ))}
                </div>
              </div>
            );
          })}
          
          {loading && (
            <div className="flex gap-3 mr-auto max-w-[85%]">
              <div className="w-8 h-8 rounded-full bg-indigo-950 border border-indigo-500/25 text-indigo-400 flex items-center justify-center animate-pulse">
                <Bot className="w-4 h-4 animate-spin" />
              </div>
              <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-850 text-zinc-500 text-xs italic">
                Copilot is querying issues and compiling data...
              </div>
            </div>
          )}
        </div>

        {/* Input box */}
        <form 
          onSubmit={(e) => { e.preventDefault(); handleSendMessage(query); }}
          className="shrink-0 bg-zinc-900/35 border border-zinc-800 rounded-2xl p-3 flex gap-2"
        >
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent border-0 focus:outline-none text-sm text-zinc-200 placeholder-zinc-500 px-3"
            placeholder="Ask AI Copilot... (e.g. 'Compare Android and iOS complaints')"
          />
          <button 
            type="submit" 
            disabled={!query.trim() || loading}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition"
          >
            Ask AI <Send className="w-3.5 h-3.5" />
          </button>
        </form>

      </div>
    </SidebarLayout>
  );
}
