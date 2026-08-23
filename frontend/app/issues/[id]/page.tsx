'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import SidebarLayout from '../../components/SidebarLayout';
import { 
  ArrowLeft, 
  User, 
  Calendar, 
  AlertCircle, 
  CheckCircle,
  ExternalLink,
  Send,
  Sparkles,
  Zap,
  TrendingDown,
  Globe,
  Smartphone,
  ShieldCheck,
  DollarSign,
  Layers,
  GitBranch,
  CheckCheck,
  Activity,
  ChevronRight,
  Split,
  Plus,
  X
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

interface FeedbackItem {
  id: number;
  source: string;
  original_text: string;
  sentiment: string;
  emotion: string;
  created_at: string;
  meta_info: any;
}

interface IssueDetails {
  id: number;
  title: string;
  summary: string;
  status: string;
  priority: string;
  health_score: number;
  health_status: string;
  assigned_team: string;
  assigned_to_name: string | null;
  assigned_to_email: string | null;
  root_cause: string | null;
  confidence: number;
  release_correlation: string | null;
  affected_devices: any;
  affected_countries: any;
  affected_versions: any;
  platform_distribution: any;
  estimated_revenue_risk: number;
  estimated_churn_risk: number;
  affected_users: number;
  total_reports: number;
  average_rating: number;
  created_at: string;
  feedbacks: FeedbackItem[];
}

export default function IssueDetailPage() {
  const params = useParams();
  const router = useRouter();
  const issueId = params?.id;
  
  const [loading, setLoading] = useState(true);
  const [issue, setIssue] = useState<IssueDetails | null>(null);
  const [activeTab, setActiveTab] = useState<'evidence' | 'clusters' | 'root_cause' | 'impact'>('clusters');
  const [evidenceTab, setEvidenceTab] = useState<'Reviews' | 'Emails' | 'Calls' | 'Chats'>('Reviews');
  
  const [toast, setToast] = useState<string | null>(null);
  const [jiraModalOpen, setJiraModalOpen] = useState(false);
  const [assignModalOpen, setAssignModalOpen] = useState(false);

  const [assignTeam, setAssignTeam] = useState('Payments Engineering');
  const [assignEmployee, setAssignEmployee] = useState('Rahul Sharma');

  const fetchIssueDetails = async () => {
    try {
      const res = await fetch(`http://localhost:8000/api/issues/${issueId}`);
      if (!res.ok) throw new Error('Failed to load issue');
      const data = await res.json();
      setIssue({
        ...data,
        total_reports: data.total_reports || 2431
      });
      setAssignTeam(data.assigned_team || 'Payments Engineering');
      setAssignEmployee(data.assigned_to_name || 'Rahul Sharma');
    } catch (err) {
      setIssue({
        id: Number(issueId) || 1,
        title: "Payment crashes after UPI",
        summary: "Customers consistently report that the application crashes immediately after completing a UPI payment. Most reports indicate that the payment succeeds, but the confirmation screen fails to load. The issue increased significantly after version 12.5.",
        status: "In Progress",
        priority: "Critical",
        health_score: 98,
        health_status: "BUSINESS CRITICAL",
        assigned_team: "Payments Engineering",
        assigned_to_name: "Rahul Sharma",
        assigned_to_email: "rahul@acme.io",
        root_cause: "Payment SDK update in version 12.5 causing crash on Android 15 confirmation view",
        confidence: 92,
        release_correlation: "v12.5",
        affected_devices: {"Samsung S24": 1280, "OnePlus 12": 630, "Pixel 8": 280, "iPhone 15": 241},
        affected_countries: {"United States": 1420, "India": 680, "United Kingdom": 331},
        affected_versions: {"v12.5": 2180, "v12.4": 251},
        platform_distribution: {"Android": 1910, "iOS": 521},
        estimated_revenue_risk: 42000,
        estimated_churn_risk: 0.14,
        affected_users: 2431,
        total_reports: 2431,
        average_rating: 1.2,
        created_at: "18 July",
        feedbacks: [
          {
            id: 1,
            source: "Google Play Store",
            original_text: "Money was deducted via UPI but the app crashed immediately. Please refund or update status!",
            sentiment: "Very Negative",
            emotion: "Frustrated",
            created_at: "18 July",
            meta_info: { device: "Samsung S24", rating: 1 }
          },
          {
            id: 2,
            source: "Apple App Store",
            original_text: "Black screen after payment confirmation. Order does not show in my account history.",
            sentiment: "Very Negative",
            emotion: "Anger",
            created_at: "19 July",
            meta_info: { device: "iPhone 15 Pro", rating: 1 }
          }
        ]
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIssueDetails();
  }, [issueId]);

  const handleCreateJiraTicket = () => {
    setJiraModalOpen(false);
    setToast('✓ Jira Issue Created: PAY-4821');
    setTimeout(() => setToast(null), 4000);
    if (issue) setIssue({ ...issue, status: 'In Progress' });
  };

  const handleAssignSubmit = () => {
    setAssignModalOpen(false);
    if (issue) {
      setIssue({
        ...issue,
        assigned_team: assignTeam,
        assigned_to_name: assignEmployee,
        status: 'Assigned'
      });
    }
    setToast(`✓ Problem assigned to ${assignEmployee} (${assignTeam})`);
    setTimeout(() => setToast(null), 4000);
  };

  if (loading) {
    return (
      <SidebarLayout>
        <div className="p-12 text-center text-zinc-500">
          <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <span>Analyzing problem pattern...</span>
        </div>
      </SidebarLayout>
    );
  }

  if (!issue) return null;

  const deviceData = Object.entries(issue.affected_devices || {}).map(([name, value]) => ({ name, value }));

  const clusterPatterns = [
    { title: 'Payment succeeds → app crashes', count: 1280, pct: '53%' },
    { title: 'Black screen after payment', count: 630, pct: '26%' },
    { title: 'Order missing in account history', count: 280, pct: '12%' },
    { title: 'Retry failure on checkout loop', count: 241, pct: '9%' }
  ];

  return (
    <SidebarLayout>
      <div className="space-y-6 max-w-7xl mx-auto">
        
        {/* Toast Notification */}
        {toast && (
          <div className="fixed top-5 right-5 z-50 p-4 rounded-xl bg-[#08080A] border border-emerald-500/40 text-emerald-400 text-xs font-semibold shadow-2xl flex items-center gap-2 animate-fade-in">
            <CheckCircle className="w-4 h-4" />
            <span>{toast}</span>
          </div>
        )}

        {/* Back Link & Category */}
        <div className="flex items-center gap-2">
          <button 
            onClick={() => router.push('/')}
            className="p-1.5 rounded-lg bg-white/[0.03] border border-white/[0.06] text-zinc-400 hover:text-white transition"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <span className="text-xs font-mono text-zinc-500">← Problems / PAYMENTS</span>
        </div>

        {/* LARGE PROBLEM HERO SECTION */}
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/[0.08] bg-[#08080A] space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            
            <div className="space-y-2 max-w-2xl">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-red-400 bg-red-500/10 px-2.5 py-1 rounded-full border border-red-500/25">
                ● PAYMENT ISSUE
              </span>
              <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight font-heading">
                {issue.title}
              </h1>
              <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed font-sans">
                {issue.summary}
              </p>
              <div className="flex items-center gap-4 text-xs font-mono text-zinc-500 pt-1">
                <span><strong>{issue.total_reports.toLocaleString()}</strong> reports</span>
                <span>•</span>
                <span className="text-red-400 font-bold">↑ 42% report growth</span>
                <span>•</span>
                <span>Detected: <strong>{issue.created_at}</strong></span>
              </div>
            </div>

            {/* Giant Visual Score Gauge */}
            <div className="flex flex-col items-center justify-center p-6 rounded-2xl bg-purple-500/10 border border-purple-500/30 text-center shrink-0 min-w-[200px] glow-ai-card">
              <span className="text-5xl font-black text-purple-400 tracking-tight font-heading block">
                {issue.health_score}
              </span>
              <span className="text-[10px] font-mono font-extrabold uppercase tracking-widest text-purple-300 block mt-1">
                BUSINESS CRITICAL
              </span>
            </div>

          </div>

          {/* Actions Bar */}
          <div className="pt-4 border-t border-white/[0.06] flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-zinc-400">Assigned Team: <strong className="text-white">{issue.assigned_team}</strong></span>
              <span className="text-xs text-zinc-600">•</span>
              <span className="text-xs font-mono text-zinc-400">Assignee: <strong className="text-indigo-400">{issue.assigned_to_name || 'Rahul Sharma'}</strong></span>
            </div>
            
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setAssignModalOpen(true)}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition shadow"
              >
                Assign Problem
              </button>
              <button 
                onClick={() => setJiraModalOpen(true)}
                className="px-4 py-2 rounded-xl bg-white/[0.04] border border-white/[0.08] hover:border-indigo-500/40 text-white text-xs font-bold transition flex items-center gap-1.5"
              >
                <GitBranch className="w-3.5 h-3.5 text-indigo-400" /> Create Jira Issue
              </button>
            </div>
          </div>
        </div>

        {/* ✦ AI SUMMARY CARD */}
        <div className="glass-panel p-6 rounded-2xl border border-indigo-500/30 bg-[#08080A] glow-ai-card space-y-3">
          <div className="flex justify-between items-center">
            <h3 className="text-xs font-bold text-indigo-400 uppercase tracking-wider font-mono flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-indigo-400" /> ✦ AI Summary
            </h3>
            <span className="text-[10px] font-mono font-bold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 px-2 py-0.5 rounded-full">
              AI Confidence: 92%
            </span>
          </div>

          <div className="space-y-2 text-xs text-zinc-200 leading-relaxed font-sans">
            <p><strong>2,431 customers</strong> have reported this problem across Google Play Store, App Store, and Zendesk.</p>
            <p>The majority indicate that payment succeeds at the bank/UPI level, but the application crashes before the order confirmation screen renders.</p>
            <p>Reports increased significantly following the deployment of version 12.5 on Android 15 devices.</p>
          </div>
        </div>

        {/* BUSINESS IMPACT 4-METRIC STRIP */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
          <div className="p-4 rounded-xl bg-[#08080A] border border-white/[0.06]">
            <span className="text-zinc-500 text-[10px] uppercase block font-semibold">Affected Customers</span>
            <span className="text-xl font-bold text-white mt-1 block">2,431</span>
          </div>
          <div className="p-4 rounded-xl bg-[#08080A] border border-white/[0.06]">
            <span className="text-zinc-500 text-[10px] uppercase block font-semibold">Failed Orders</span>
            <span className="text-xl font-bold text-white mt-1 block">3,800</span>
          </div>
          <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20">
            <span className="text-red-400 text-[10px] uppercase block font-bold">Revenue Risk</span>
            <span className="text-xl font-extrabold text-red-500 mt-1 block">HIGH ($42K)</span>
          </div>
          <div className="p-4 rounded-xl bg-[#08080A] border border-white/[0.06]">
            <span className="text-zinc-500 text-[10px] uppercase block font-semibold">Churn Risk</span>
            <span className="text-xl font-bold text-amber-400 mt-1 block">14% Churn</span>
          </div>
        </div>

        {/* AI PATTERN CLUSTERS & EVIDENCE TABS */}
        <div className="glass-panel rounded-2xl border border-white/[0.06] bg-[#08080A] overflow-hidden">
          <div className="flex border-b border-white/[0.06] bg-[#050505]">
            {(['clusters', 'evidence', 'root_cause'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider border-b-2 transition ${
                  activeTab === tab 
                    ? 'border-indigo-500 text-indigo-400 bg-indigo-600/5' 
                    : 'border-transparent text-zinc-400 hover:text-zinc-200'
                }`}
              >
                {tab === 'clusters' ? 'AI Pattern Clusters (4)' : tab === 'evidence' ? 'Customer Evidence' : 'Root Cause Analysis'}
              </button>
            ))}
          </div>

          <div className="p-6 space-y-4">
            
            {/* Pattern Clusters Tab */}
            {activeTab === 'clusters' && (
              <div className="space-y-4">
                <span className="text-xs text-zinc-400 font-mono">AI grouped 2,431 customer reports into 4 recurring patterns:</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {clusterPatterns.map((c) => (
                    <div key={c.title} className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] flex items-center justify-between text-xs">
                      <div>
                        <span className="font-bold text-white block font-heading">{c.title}</span>
                        <span className="text-[10px] text-zinc-500 font-mono mt-0.5 block">{c.count} reports</span>
                      </div>
                      <span className="text-xs font-mono font-bold text-indigo-400 bg-indigo-500/10 px-2.5 py-1 rounded-lg border border-indigo-500/20">
                        {c.pct}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Evidence Tab */}
            {activeTab === 'evidence' && (
              <div className="space-y-3">
                {issue.feedbacks.map((fb) => (
                  <div key={fb.id} className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-2 text-xs">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-zinc-300">{fb.source}</span>
                      <span className="text-[10px] font-bold text-red-400 bg-red-500/10 border border-red-500/20 px-2 py-0.5 rounded">
                        ★ 1.0 • {fb.sentiment}
                      </span>
                    </div>
                    <p className="text-zinc-200 italic font-sans">"{fb.original_text}"</p>
                  </div>
                ))}
              </div>
            )}

            {/* Root Cause Tab */}
            {activeTab === 'root_cause' && (
              <div className="p-4 rounded-xl bg-indigo-500/5 border border-indigo-500/20 space-y-3 text-xs">
                <h4 className="font-bold text-indigo-400 uppercase tracking-wider font-mono flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" /> ✦ Identified Root Cause
                </h4>
                <p className="text-white font-medium">{issue.root_cause}</p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono text-[11px] pt-2 border-t border-indigo-500/15">
                  <div><span className="text-zinc-500 block">AI Confidence:</span> <strong className="text-indigo-400">92%</strong></div>
                  <div><span className="text-zinc-500 block">Related Release:</span> <strong className="text-white">v12.5</strong></div>
                  <div><span className="text-zinc-500 block">Affected OS:</span> <strong className="text-white">Android 15</strong></div>
                  <div><span className="text-zinc-500 block">SDK Target:</span> <strong className="text-white">Stripe UPI v4</strong></div>
                </div>
              </div>
            )}

          </div>
        </div>

      </div>

      {/* Jira Create Ticket Modal */}
      {jiraModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-lg bg-[#0C0C10] border border-white/[0.08] rounded-2xl p-6 space-y-4 shadow-2xl relative">
            <button onClick={() => setJiraModalOpen(false)} className="absolute top-4 right-4 text-zinc-500 hover:text-white"><X className="w-4 h-4" /></button>
            
            <div className="flex items-center gap-2">
              <GitBranch className="w-4 h-4 text-indigo-400" />
              <h3 className="text-base font-bold text-white font-heading">Create Jira Issue</h3>
            </div>

            <div className="space-y-3 text-xs font-mono">
              <div>
                <label className="text-[10px] uppercase text-zinc-400 block mb-1">Project</label>
                <select className="w-full bg-[#050505] border border-white/[0.08] rounded-xl p-2.5 text-zinc-200">
                  <option value="PAY">PAY (Payments Engine)</option>
                  <option value="MOBILE">MOBILE (Mobile App)</option>
                </select>
              </div>
              <div>
                <label className="text-[10px] uppercase text-zinc-400 block mb-1">Issue Summary</label>
                <input type="text" defaultValue={issue.title} className="w-full bg-[#050505] border border-white/[0.08] rounded-xl p-2.5 text-zinc-200" />
              </div>
              <div>
                <label className="text-[10px] uppercase text-zinc-400 block mb-1">Assignee</label>
                <input type="text" defaultValue="Rahul Sharma" className="w-full bg-[#050505] border border-white/[0.08] rounded-xl p-2.5 text-zinc-200" />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button onClick={() => setJiraModalOpen(false)} className="px-4 py-2 bg-zinc-800 text-zinc-300 text-xs rounded-xl">Cancel</button>
              <button onClick={handleCreateJiraTicket} className="px-4 py-2 bg-indigo-600 text-white text-xs font-bold rounded-xl shadow">Create Jira Issue</button>
            </div>
          </div>
        </div>
      )}

      {/* Assign Problem Modal Flow */}
      {assignModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-md bg-[#0C0C10] border border-white/[0.08] rounded-2xl p-6 space-y-4 shadow-2xl relative">
            <button onClick={() => setAssignModalOpen(false)} className="absolute top-4 right-4 text-zinc-500 hover:text-white"><X className="w-4 h-4" /></button>
            
            <h3 className="text-base font-bold text-white font-heading">Assign Problem</h3>

            <div className="p-3 rounded-xl bg-indigo-500/5 border border-indigo-500/20 text-xs space-y-1">
              <span className="font-bold text-indigo-400 font-mono text-[10px] uppercase">✦ AI Recommendation</span>
              <p className="text-zinc-300">Recommended Team: <strong>Payments Engineering</strong> (97% AI confidence)</p>
            </div>

            <div className="space-y-3 text-xs font-mono">
              <div>
                <label className="text-[10px] uppercase text-zinc-400 block mb-1">Team</label>
                <select value={assignTeam} onChange={(e) => setAssignTeam(e.target.value)} className="w-full bg-[#050505] border border-white/[0.08] rounded-xl p-2.5 text-zinc-200">
                  <option value="Payments Engineering">Payments Engineering</option>
                  <option value="Support Operations">Support Operations</option>
                  <option value="Logistics Team">Logistics Team</option>
                </select>
              </div>
              <div>
                <label className="text-[10px] uppercase text-zinc-400 block mb-1">Owner</label>
                <input type="text" value={assignEmployee} onChange={(e) => setAssignEmployee(e.target.value)} className="w-full bg-[#050505] border border-white/[0.08] rounded-xl p-2.5 text-zinc-200" />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button onClick={() => setAssignModalOpen(false)} className="px-4 py-2 bg-zinc-800 text-zinc-300 text-xs rounded-xl">Cancel</button>
              <button onClick={handleAssignSubmit} className="px-4 py-2 bg-indigo-600 text-white text-xs font-bold rounded-xl shadow">Confirm Assignment</button>
            </div>
          </div>
        </div>
      )}

    </SidebarLayout>
  );
}
