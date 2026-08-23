'use client';

import React, { useState } from 'react';
import SidebarLayout from '../components/SidebarLayout';
import { 
  Download, 
  Sparkles, 
  CheckCircle, 
  Mail, 
  Clock, 
  Calendar,
  X
} from 'lucide-react';

export default function WeeklyReports() {
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const [recipients, setRecipients] = useState('ceo@acme.io, cto@acme.io, pm@acme.io, em@acme.io');
  const [frequency, setFrequency] = useState('Weekly');
  const [day, setDay] = useState('Monday');
  const [time, setTime] = useState('09:00 AM');

  const reportData = {
    week: 'August 17–23',
    health_score: 84,
    reports_analyzed: '18,421',
    critical_problems: 4,
    resolved_count: 17,
    executive_summary: "Weekly operations summary: EchoOps analyzed 18,421 customer feedback entries across app stores, emails, and voice calls. A critical payment crash in version 12.5 was flagged and assigned to Payments Engineering. Overall Customer Health score is 84/100 (+6.4%). AI recommends releasing v12.6 hotfix immediately.",
    top_problems: [
      { title: 'Payment crashes after UPI', priority: 'Critical', health: 98, reports: 2431, team: 'Payments Engineering' },
      { title: 'Refund taking too long', priority: 'High', health: 87, reports: 1102, team: 'Support Operations' },
      { title: 'OTP verification code not received', priority: 'High', health: 82, reports: 563, team: 'Authentication Team' }
    ],
    recommendations: [
      'Deploy v12.6 hotfix to resolve UPI checkout crash on Android 15.',
      'Increase SMS gateway rate limit on Twilio to eliminate OTP timeouts.',
      'Schedule Dark Mode Phase 1 rollout for Sprint 19.'
    ]
  };

  const handleDownloadPdf = () => {
    setToast('✓ Downloading EchoOps_Weekly_Intelligence_Aug17-23.pdf...');
    setTimeout(() => setToast(null), 4000);
  };

  const handleEmailReport = () => {
    setToast('✓ Weekly Intelligence Report emailed to executive team!');
    setTimeout(() => setToast(null), 4000);
  };

  const handleScheduleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setScheduleModalOpen(false);
    setToast(`✓ Scheduled automated PDF report for ${day}s at ${time}`);
    setTimeout(() => setToast(null), 4000);
  };

  return (
    <SidebarLayout>
      <div className="space-y-6 max-w-6xl mx-auto">
        
        {/* Toast Alert */}
        {toast && (
          <div className="fixed top-5 right-5 z-50 p-4 rounded-xl bg-[#08080A] border border-emerald-500/40 text-emerald-400 text-xs font-semibold shadow-2xl flex items-center gap-2 animate-fade-in">
            <CheckCircle className="w-4 h-4" />
            <span>{toast}</span>
          </div>
        )}

        {/* Top Header & Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.06] pb-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-zinc-500">
              <Calendar className="w-3.5 h-3.5 text-indigo-400" />
              <span>{reportData.week}</span>
            </div>
            <h1 className="text-2xl font-extrabold text-white mt-1 font-heading uppercase tracking-tight">
              WEEKLY CUSTOMER INTELLIGENCE
            </h1>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button 
              onClick={handleDownloadPdf}
              className="px-3.5 py-2 rounded-xl bg-white/[0.04] border border-white/[0.08] hover:border-white/[0.16] text-xs font-bold text-zinc-200 transition flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5 text-indigo-400" /> Download PDF
            </button>
            <button 
              onClick={handleEmailReport}
              className="px-3.5 py-2 rounded-xl bg-white/[0.04] border border-white/[0.08] hover:border-white/[0.16] text-xs font-bold text-zinc-200 transition flex items-center gap-1.5"
            >
              <Mail className="w-3.5 h-3.5 text-indigo-400" /> Email Report
            </button>
            <button 
              onClick={() => setScheduleModalOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition shadow flex items-center gap-1.5"
            >
              <Clock className="w-3.5 h-3.5" /> Schedule PDF
            </button>
          </div>
        </div>

        {/* 4 Executive KPI Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="glass-panel p-4 rounded-2xl border border-white/[0.06] bg-[#08080A]">
            <span className="text-[10px] font-mono font-bold uppercase text-zinc-500">Customer Health</span>
            <span className="text-2xl font-extrabold text-emerald-400 block mt-1">{reportData.health_score}</span>
          </div>
          <div className="glass-panel p-4 rounded-2xl border border-white/[0.06] bg-[#08080A]">
            <span className="text-[10px] font-mono font-bold uppercase text-zinc-500">Signals Analyzed</span>
            <span className="text-2xl font-extrabold text-white block mt-1">{reportData.reports_analyzed}</span>
          </div>
          <div className="glass-panel p-4 rounded-2xl border border-red-500/20 bg-[#08080A]">
            <span className="text-[10px] font-mono font-bold uppercase text-red-400">Critical Problems</span>
            <span className="text-2xl font-extrabold text-red-500 block mt-1">{reportData.critical_problems}</span>
          </div>
          <div className="glass-panel p-4 rounded-2xl border border-white/[0.06] bg-[#08080A]">
            <span className="text-[10px] font-mono font-bold uppercase text-zinc-500">Resolved</span>
            <span className="text-2xl font-extrabold text-indigo-400 block mt-1">{reportData.resolved_count}</span>
          </div>
        </div>

        {/* Executive Summary Card */}
        <div className="glass-panel p-6 rounded-2xl border border-indigo-500/30 bg-[#08080A] glow-ai-card space-y-2">
          <h3 className="text-xs font-bold text-indigo-400 uppercase tracking-wider font-mono flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-indigo-400" /> Executive Summary
          </h3>
          <p className="text-sm text-zinc-200 leading-relaxed font-sans">{reportData.executive_summary}</p>
        </div>

        {/* 2 Column Report Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Top Problems List */}
          <div className="glass-panel p-5 rounded-2xl border border-white/[0.06] bg-[#08080A] space-y-3">
            <h3 className="text-xs font-bold text-white uppercase font-heading">Biggest Customer Problems</h3>
            <div className="space-y-2">
              {reportData.top_problems.map((p) => (
                <div key={p.title} className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] flex justify-between items-center text-xs">
                  <div>
                    <span className="font-bold text-white block">{p.title}</span>
                    <span className="text-[10px] text-zinc-500 font-mono">{p.team} • {p.reports} reports</span>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-500/10 text-red-400 border border-red-500/20 font-mono">
                    ● {p.health}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* AI Recommendations List */}
          <div className="glass-panel p-5 rounded-2xl border border-white/[0.06] bg-[#08080A] space-y-3">
            <h3 className="text-xs font-bold text-indigo-400 uppercase font-mono flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-indigo-400" /> AI Recommendations
            </h3>
            <div className="space-y-2">
              {reportData.recommendations.map((rec, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] text-xs text-zinc-300 flex items-start gap-2">
                  <span className="w-4 h-4 rounded-full bg-indigo-500/20 text-indigo-400 font-mono font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">{idx + 1}</span>
                  <span className="leading-relaxed">{rec}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* Schedule Automated Weekly PDF Modal */}
      {scheduleModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-md bg-[#0C0C10] border border-white/[0.08] rounded-2xl p-6 space-y-4 shadow-2xl relative">
            <div className="flex justify-between items-center border-b border-white/[0.06] pb-3">
              <h3 className="text-base font-bold text-white font-heading">Schedule Automated Weekly PDF</h3>
              <button onClick={() => setScheduleModalOpen(false)} className="text-zinc-500 hover:text-white"><X className="w-4 h-4" /></button>
            </div>

            <form onSubmit={handleScheduleSubmit} className="space-y-3 text-xs font-mono">
              <div>
                <label className="text-[10px] uppercase text-zinc-500 block mb-1">Frequency</label>
                <select value={frequency} onChange={(e) => setFrequency(e.target.value)} className="w-full bg-[#050505] border border-white/[0.08] rounded-xl p-2.5 text-zinc-200">
                  <option value="Weekly">Weekly</option>
                  <option value="Daily">Daily</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] uppercase text-zinc-500 block mb-1">Day</label>
                  <select value={day} onChange={(e) => setDay(e.target.value)} className="w-full bg-[#050505] border border-white/[0.08] rounded-xl p-2.5 text-zinc-200">
                    <option value="Monday">Monday</option>
                    <option value="Friday">Friday</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] uppercase text-zinc-500 block mb-1">Time</label>
                  <select value={time} onChange={(e) => setTime(e.target.value)} className="w-full bg-[#050505] border border-white/[0.08] rounded-xl p-2.5 text-zinc-200">
                    <option value="09:00 AM">09:00 AM</option>
                    <option value="08:00 AM">08:00 AM</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="text-[10px] uppercase text-zinc-500 block mb-1">Recipients (CSV)</label>
                <textarea value={recipients} onChange={(e) => setRecipients(e.target.value)} className="w-full bg-[#050505] border border-white/[0.08] rounded-xl p-2.5 text-zinc-200 h-16 resize-none" />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setScheduleModalOpen(false)} className="px-4 py-2 bg-zinc-800 text-zinc-300 rounded-xl">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-indigo-600 text-white font-bold rounded-xl shadow">Save Schedule</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </SidebarLayout>
  );
}
