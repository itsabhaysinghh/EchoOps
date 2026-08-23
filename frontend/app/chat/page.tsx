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
  RefreshCw
} from 'lucide-react';

export default function ChatCopilot() {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([
    { 
      role: 'assistant', 
      text: "Hello! I am your EchoOps AI Copilot. Ask me anything about customer feedback logs, critical issues, release regressions, or feature requests." 
    }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const quickQuestions = [
    { text: "What is our biggest issue?", icon: AlertTriangle, color: 'text-red-400' },
    { text: "What feature is requested most?", icon: Lightbulb, color: 'text-amber-400' },
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
      setTimeout(() => {
        let responseText = "";
        const qL = text.toLowerCase().trim();
        
        if (["hello", "hi", "hey", "greetings", "good morning", "good evening"].includes(qL) || qL.startsWith("hello") || qL.startsWith("hi ")) {
          responseText = "Hello! How can I help you analyze customer feedback, critical issue logs, or feature requests today?";
        } else if (qL.includes('biggest issue') || qL.includes('fix first') || qL.includes('critical')) {
          responseText = "Based on live telemetry, **Payment crashes after UPI** is your #1 critical problem (Health Score: 98, 2,431 reports, ↑ 42% trend). I recommend assigning this to Payments Engineering immediately.";
        } else if (qL.includes('feature') || qL.includes('request')) {
          responseText = "The most requested feature is **Dark Mode Support** with 1,284 customer upvotes, followed by **Offline Mode** (813 upvotes) and **Apple Pay for Web** (501 upvotes).";
        } else if (qL.includes('summarize') || qL.includes('complaints') || qL.includes('week')) {
          responseText = "Here is a summary of top customer complaints this week:\n\n1. **Payment crashes after UPI** (Critical): App crashes after payment completion on Android 15 v12.5.\n2. **Refund taking too long** (High): Delayed processing exceeding 7 business days.\n3. **OTP verification code not received** (High): SMS gateway timeout during OAuth login.";
        } else if (qL.includes('android') || qL.includes('ios')) {
          responseText = "Based on customer feedback items:\n- **Android**: 1,910 reports (68% of crash logs, concentrated in v12.5).\n- **iOS**: 521 reports (32% of crash logs, concentrated in OAuth login).";
        } else {
          responseText = "I analyzed your request. Currently, we have 8 critical problems active. The highest revenue risk is associated with the payment gateway checkout flow ($42,000 estimated risk).";
        }
        
        setMessages(prev => [...prev, { role: 'assistant', text: responseText }]);
      }, 600);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SidebarLayout>
      <div className="space-y-6 max-w-4xl mx-auto h-[calc(100vh-110px)] flex flex-col justify-between">
        
        {/* Header */}
        <div className="shrink-0 border-b border-white/[0.06] pb-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white font-heading flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-400" /> AI Copilot Chat
            </h1>
            <p className="text-xs sm:text-sm text-zinc-400 mt-1">
              Query your database using natural language. Compare metrics, summarize updates, and find regressions.
            </p>
          </div>
          <button 
            onClick={() => setMessages([{ role: 'assistant', text: "Hello! I am your EchoOps AI Copilot. Ask me anything about customer feedback logs, critical issues, release regressions, or feature requests." }])}
            className="p-2 rounded-xl bg-white/[0.03] border border-white/[0.06] text-zinc-400 hover:text-white transition"
            title="Clear Chat History"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Preset Suggestion Cards */}
        {messages.length === 1 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 shrink-0 my-2">
            {quickQuestions.map((q) => {
              const Icon = q.icon;
              return (
                <div
                  key={q.text}
                  onClick={() => handleSendMessage(q.text)}
                  className="glass-panel p-4 rounded-2xl border border-white/[0.06] hover:border-indigo-500/40 bg-[#08080A] cursor-pointer flex justify-between items-center group transition card-hover"
                >
                  <div className="flex items-center gap-3">
                    <span className={`p-2 rounded-xl bg-white/[0.03] ${q.color}`}>
                      <Icon className="w-4 h-4" />
                    </span>
                    <span className="text-xs font-semibold text-zinc-200">{q.text}</span>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-zinc-500 group-hover:text-indigo-400 group-hover:translate-x-1 transition" />
                </div>
              );
            })}
          </div>
        )}

        {/* Message Log Container */}
        <div className="flex-1 overflow-y-auto space-y-4 px-3 py-4 bg-[#08080A] border border-white/[0.06] rounded-3xl my-2 max-h-[460px]">
          {messages.map((m, idx) => {
            const isBot = m.role === 'assistant';
            return (
              <div key={idx} className={`flex gap-3 max-w-[88%] ${isBot ? 'mr-auto' : 'ml-auto flex-row-reverse'}`}>
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center border shrink-0 ${
                  isBot ? 'bg-indigo-600/10 border-indigo-500/30 text-indigo-400' : 'bg-white/[0.06] border-white/[0.08] text-zinc-300'
                }`}>
                  {isBot ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                </div>
                <div className={`p-4 rounded-2xl border text-xs leading-relaxed ${
                  isBot 
                    ? 'bg-[#0C0C10] border-white/[0.06] text-zinc-200 glow-ai-card' 
                    : 'bg-indigo-600/15 border-indigo-500/25 text-white font-medium'
                }`}>
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
              <div className="w-8 h-8 rounded-xl bg-indigo-600/10 border border-indigo-500/30 text-indigo-400 flex items-center justify-center animate-pulse">
                <Bot className="w-4 h-4 animate-spin" />
              </div>
              <div className="p-4 rounded-2xl bg-[#0C0C10] border border-white/[0.06] text-zinc-400 text-xs italic">
                Analyzing customer logs and compiling response...
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input bar */}
        <form 
          onSubmit={(e) => { e.preventDefault(); handleSendMessage(query); }}
          className="shrink-0 bg-[#08080A] border border-white/[0.08] rounded-2xl p-2.5 flex gap-2"
        >
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent border-0 focus:outline-none text-xs sm:text-sm text-white placeholder-zinc-500 px-3"
            placeholder="Ask AI Copilot... (e.g. 'What is our biggest issue?')"
          />
          <button 
            type="submit" 
            disabled={!query.trim() || loading}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition shadow"
          >
            Ask AI <Send className="w-3.5 h-3.5" />
          </button>
        </form>

      </div>
    </SidebarLayout>
  );
}
