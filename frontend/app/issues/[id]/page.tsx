'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import SidebarLayout from '../../components/SidebarLayout';
import { 
  ArrowLeft, 
  MessageSquare, 
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
  Plus
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
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

interface CommentItem {
  id: number;
  author_name: string;
  author_role: string;
  content: string;
  created_at: string;
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
  comments: CommentItem[];
}

export default function IssueDetailPage() {
  const params = useParams();
  const router = useRouter();
  const issueId = params?.id;
  
  const [loading, setLoading] = useState(true);
  const [issue, setIssue] = useState<IssueDetails | null>(null);
  const [activeTab, setActiveTab] = useState<'evidence' | 'root_cause' | 'impact' | 'timeline' | 'verification'>('evidence');
  const [evidenceTab, setEvidenceTab] = useState<'Reviews' | 'Emails' | 'Calls' | 'Chats'>('Reviews');
  
  const [commentText, setCommentText] = useState('');
  const [chatText, setChatText] = useState('');
  const [chatHistory, setChatHistory] = useState([
    { role: 'assistant', text: "I'm the EchoOps AI assistant. Ask me anything about this bug, such as affected devices or related releases." }
  ]);
  const [toast, setToast] = useState<string | null>(null);
  const [jiraModalOpen, setJiraModalOpen] = useState(false);
  const [assignModalOpen, setAssignModalOpen] = useState(false);

  const [recommendation] = useState({
    team: 'Payments Engineering',
    priority: 'Critical',
    effort: '2 Sprints',
    sprint: 'Sprint 18',
    fix_time: 'Tomorrow',
    reason: '84% of related reports reference the payment confirmation flow.'
  });

  const [assignTeam, setAssignTeam] = useState('Payments Engineering');
  const [assignEmployee, setAssignEmployee] = useState('Rahul Sharma');

  const fetchIssueDetails = async () => {
    try {
      const res = await fetch(`http://localhost:8000/api/issues/${issueId}`);
      if (!res.ok) throw new Error('Failed to load issue');
      const data = await res.json();
      setIssue(data);
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
        health_status: "Business Critical",
        assigned_team: "Payments Engineering",
        assigned_to_name: "Rahul Sharma",
        assigned_to_email: "rahul@acme.io",
        root_cause: "Recent payment SDK update in v12.5 causing crash on Android 15 confirmation view",
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
            meta_info: { device: "Samsung S24", rating: 1, email: "user1@gmail.com" }
          },
          {
            id: 2,
            source: "Apple App Store",
            original_text: "Black screen after payment confirmation. Order does not show in my account history.",
            sentiment: "Very Negative",
            emotion: "Anger",
            created_at: "19 July",
            meta_info: { device: "iPhone 15 Pro", rating: 1, email: "user2@icloud.com" }
          }
        ],
        comments: [
          {
            id: 1,
            author_name: "Rahul Sharma",
            author_role: "Product Manager",
            content: "Investigating the Stripe & UPI webhook response callback in v12.5 release build.",
            created_at: new Date().toISOString()
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
    if (issue) {
      setIssue({ ...issue, status: 'In Progress' });
    }
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
    setToast(`✓ Assigned to ${assignEmployee} (${assignTeam})`);
    setTimeout(() => setToast(null), 4000);
  };

  const handleMergeProblems = () => {
    setToast('✓ Merged 3 similar payment problems into PAY-4821 cluster');
    setTimeout(() => setToast(null), 4000);
  };

  if (loading) {
    return (
      <SidebarLayout>
        <div className="p-12 text-center text-zinc-500">
          <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <span>Analyzing problem clusters...</span>
        </div>
      </SidebarLayout>
    );
  }

  if (!issue) return null;

  const deviceData = Object.entries(issue.affected_devices || {}).map(([name, value]) => ({ name, value }));
  const COLORS = ['#4F46E5', '#7C3AED', '#EC4899', '#F97316', '#10B981'];

  const clusters = [
    { title: 'Payment successful but app crashes', count: 1280 },
    { title: 'Black screen after payment', count: 630 },
    { title: 'Order missing after payment', count: 280 },
    { title: 'Unable to retry payment', count: 241 }
  ];

  const timelineSteps = [
    { date: '18 Jul', text: 'Problem detected' },
    { date: '19 Jul', text: '120 reports' },
    { date: '20 Jul', text: '450 reports' },
    { date: '21 Jul', text: '1,300 reports' },
    { date: '22 Jul', text: '2,431 reports' },
    { date: '22 Jul', text: 'Assigned to Payments Engineering' },
    { date: '23 Jul', text: 'Engineering started investigation' },
    { date: '24 Jul', text: 'Fix released' },
    { date: '25 Jul', text: 'AI verification' }
  ];

  return (
    <SidebarLayout>
      <div className="space-y-6 max-w-7xl mx-auto">
        
        {/* Toast Alert Notification */}
        {toast && (
          <div className="fixed top-5 right-5 z-50 p-4 rounded-xl bg-zinc-900 border border-emerald-500/40 text-emerald-400 text-xs font-semibold shadow-2xl flex items-center gap-2 animate-fade-in">
            <CheckCircle className="w-4 h-4" />
            <span>{toast}</span>
          </div>
        )}

        {/* Top Header & Actions */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-850 pb-4">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => router.push('/')}
              className="p-2 rounded-xl bg-[#0D0D12] border border-zinc-800 hover:border-zinc-700 text-zinc-400 hover:text-white transition"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-zinc-500">← Problems</span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-purple-500/10 border border-purple-500/30 text-purple-400">
                  ● Health Score 98
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-red-500/10 border border-red-500/30 text-red-400 uppercase">
                  Critical
                </span>
              </div>
              <h1 className="text-2xl font-extrabold text-white mt-1 font-heading">
                {issue.title}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button 
              onClick={() => setAssignModalOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-[#0D0D12] border border-zinc-800 hover:border-zinc-700 text-xs font-semibold text-zinc-200 transition"
            >
              Assign
            </button>
            <button 
              onClick={() => setJiraModalOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition shadow-md flex items-center gap-1.5"
            >
              <GitBranch className="w-3.5 h-3.5" />
              <span>Create Jira Ticket</span>
            </button>
          </div>
        </div>

        {/* Overview Stats Sub-bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
          <div className="p-3 rounded-xl bg-[#0D0D12] border border-zinc-800/80">
            <span className="text-[10px] text-zinc-500 uppercase block font-semibold">Total Reports</span>
            <span className="text-base font-extrabold text-white mt-0.5 block">{issue.total_reports.toLocaleString()}</span>
          </div>
          <div className="p-3 rounded-xl bg-[#0D0D12] border border-zinc-800/80">
            <span className="text-[10px] text-zinc-500 uppercase block font-semibold">Growth Speed</span>
            <span className="text-base font-extrabold text-red-400 mt-0.5 block">↑ 42% this week</span>
          </div>
          <div className="p-3 rounded-xl bg-[#0D0D12] border border-zinc-800/80">
            <span className="text-[10px] text-zinc-500 uppercase block font-semibold">First Detected</span>
            <span className="text-base font-extrabold text-zinc-200 mt-0.5 block">{issue.created_at}</span>
          </div>
          <div className="p-3 rounded-xl bg-[#0D0D12] border border-zinc-800/80">
            <span className="text-[10px] text-zinc-500 uppercase block font-semibold">Assigned Team</span>
            <span className="text-base font-extrabold text-indigo-400 mt-0.5 block truncate">{issue.assigned_team}</span>
          </div>
        </div>

        {/* 2 Column Main Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Column: AI Summary, Tabs, Evidence, Root Cause, Timeline */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* AI Summary Card */}
            <div className="p-6 rounded-2xl bg-[#0D0D12] border border-indigo-500/30 glow-ai-card space-y-3">
              <div className="flex justify-between items-center">
                <h3 className="text-xs font-bold text-indigo-400 uppercase tracking-wider font-mono flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-indigo-400" /> ✦ AI Summary
                </h3>
                <span className="text-[10px] font-mono font-bold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 px-2 py-0.5 rounded-full">
                  AI Confidence 92%
                </span>
              </div>
              <p className="text-sm text-zinc-200 leading-relaxed font-sans">
                {issue.summary}
              </p>
            </div>

            {/* Evidence & Details Tabs */}
            <div className="glass-panel rounded-2xl border border-zinc-800/80 bg-[#0D0D12] overflow-hidden">
              <div className="flex border-b border-zinc-800 bg-[#080808]">
                {(['evidence', 'root_cause', 'impact', 'timeline', 'verification'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider border-b-2 transition ${
                      activeTab === tab 
                        ? 'border-indigo-500 text-indigo-400 bg-indigo-600/5' 
                        : 'border-transparent text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    {tab.replace('_', ' ')}
                  </button>
                ))}
              </div>

              <div className="p-6 space-y-6">
                
                {/* 1. Evidence Tab */}
                {activeTab === 'evidence' && (
                  <div className="space-y-6">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-zinc-200 font-heading">
                        2,431 customer reports • AI grouped these into 4 clusters
                      </span>
                      {/* Evidence Type Filter Buttons */}
                      <div className="flex bg-[#050505] p-1 rounded-xl border border-zinc-800 text-[11px]">
                        {(['Reviews', 'Emails', 'Calls', 'Chats'] as const).map((et) => (
                          <button
                            key={et}
                            onClick={() => setEvidenceTab(et)}
                            className={`px-2.5 py-0.5 rounded-lg font-medium transition ${evidenceTab === et ? 'bg-zinc-800 text-white font-bold' : 'text-zinc-400'}`}
                          >
                            {et}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Clusters Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {clusters.map((c) => (
                        <div key={c.title} className="p-3.5 rounded-xl bg-[#050505] border border-zinc-800/80 flex justify-between items-center">
                          <span className="text-xs font-semibold text-zinc-200">{c.title}</span>
                          <span className="text-[11px] font-mono font-bold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-md border border-indigo-500/20">{c.count}</span>
                        </div>
                      ))}
                    </div>

                    {/* Customer Evidence List */}
                    <div className="space-y-3 pt-2">
                      {issue.feedbacks.map((fb) => (
                        <div key={fb.id} className="p-4 rounded-xl bg-[#050505] border border-zinc-850 space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-xs font-bold text-zinc-300">{fb.source}</span>
                            <span className="text-[10px] font-bold text-red-400 bg-red-500/10 border border-red-500/20 px-2 py-0.5 rounded">
                              ★ 1.0 • {fb.sentiment}
                            </span>
                          </div>
                          <p className="text-xs text-zinc-200 italic font-sans leading-relaxed">
                            "{fb.original_text}"
                          </p>
                          <div className="text-[10px] font-mono text-zinc-500 pt-1 flex items-center justify-between border-t border-zinc-900">
                            <span>Device: {fb.meta_info?.device || 'Android'}</span>
                            <span>Category: Payment</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 2. Root Cause Tab */}
                {activeTab === 'root_cause' && (
                  <div className="space-y-6">
                    <div className="p-4 rounded-xl bg-indigo-500/5 border border-indigo-500/20 glow-ai-card space-y-2">
                      <h4 className="text-xs font-bold text-indigo-400 uppercase tracking-wider font-mono flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5" /> ✦ Possible Root Cause
                      </h4>
                      <p className="text-sm font-semibold text-white">Recent payment SDK update in version 12.5</p>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono pt-2">
                        <div><span className="text-zinc-500 block">Confidence:</span> <strong className="text-indigo-400">92%</strong></div>
                        <div><span className="text-zinc-500 block">Related Release:</span> <strong className="text-zinc-200">v12.5</strong></div>
                        <div><span className="text-zinc-500 block">Platform:</span> <strong className="text-zinc-200">Android</strong></div>
                        <div><span className="text-zinc-500 block">OS Version:</span> <strong className="text-zinc-200">Android 15</strong></div>
                      </div>
                    </div>

                    <div className="h-48">
                      <span className="text-xs text-zinc-400 font-semibold mb-2 block">Device Breakdown Chart</span>
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={deviceData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                          <XAxis dataKey="name" stroke="#71717a" fontSize={11} />
                          <YAxis stroke="#71717a" fontSize={11} />
                          <Tooltip contentStyle={{ backgroundColor: '#0B0B0F', borderColor: '#27272a' }} />
                          <Bar dataKey="value" fill="#4F46E5" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                )}

                {/* 3. Business Impact Tab */}
                {activeTab === 'impact' && (
                  <div className="space-y-4">
                    <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider font-mono">Business Impact Analysis</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <div className="p-4 rounded-xl bg-[#050505] border border-zinc-800">
                        <span className="text-[10px] text-zinc-500 uppercase block font-semibold font-mono">Affected Customers</span>
                        <span className="text-xl font-bold text-white mt-1 block">2,431</span>
                      </div>
                      <div className="p-4 rounded-xl bg-[#050505] border border-zinc-800">
                        <span className="text-[10px] text-zinc-500 uppercase block font-semibold font-mono">Failed Orders</span>
                        <span className="text-xl font-bold text-white mt-1 block">3,800</span>
                      </div>
                      <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20">
                        <span className="text-[10px] text-red-400 uppercase block font-bold font-mono">Revenue Risk</span>
                        <span className="text-xl font-extrabold text-red-500 mt-1 block">HIGH ($42K)</span>
                      </div>
                      <div className="p-4 rounded-xl bg-[#050505] border border-zinc-800">
                        <span className="text-[10px] text-zinc-500 uppercase block font-semibold font-mono">Rating Impact</span>
                        <span className="text-xl font-bold text-red-400 mt-1 block">-0.3 ★</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* 4. Timeline Tab */}
                {activeTab === 'timeline' && (
                  <div className="space-y-4">
                    <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider font-mono">Problem Progress Timeline</h3>
                    <div className="space-y-3 relative border-l border-zinc-800 ml-3 pl-5">
                      {timelineSteps.map((t, idx) => (
                        <div key={idx} className="relative flex items-center justify-between text-xs">
                          <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 absolute -left-[25px]" />
                          <span className="font-semibold text-zinc-200">{t.text}</span>
                          <span className="font-mono text-zinc-500 text-[10px]">{t.date}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 5. Release Verification Tab */}
                {activeTab === 'verification' && (
                  <div className="p-5 rounded-2xl bg-emerald-500/5 border border-emerald-500/30 space-y-3 glow-ai-card">
                    <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-wider font-mono flex items-center gap-1.5">
                      <CheckCheck className="w-4 h-4 text-emerald-400" /> ✦ Release Verification (Version 12.6)
                    </h3>
                    <div className="grid grid-cols-2 gap-4 text-xs font-mono pt-2">
                      <div className="p-3 bg-[#050505] border border-zinc-800 rounded-xl">
                        <span className="text-zinc-500 block">Before Fix:</span>
                        <strong className="text-red-400 text-sm">2,431 reports/week</strong>
                      </div>
                      <div className="p-3 bg-[#050505] border border-zinc-800 rounded-xl">
                        <span className="text-zinc-500 block">After Fix:</span>
                        <strong className="text-emerald-400 text-sm">183 reports/week</strong>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-xs pt-2 border-t border-emerald-500/20">
                      <span className="text-emerald-300 font-bold">92.5% improvement confirmed</span>
                      <span className="text-emerald-400 font-semibold bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/30">
                        ✓ AI recommends closing this problem
                      </span>
                    </div>
                  </div>
                )}

              </div>
            </div>

            {/* Similar Problems & Merge Option */}
            <div className="glass-panel p-5 rounded-2xl border border-zinc-800/80 bg-[#0D0D12] space-y-3">
              <div className="flex justify-between items-center">
                <h3 className="text-xs font-bold text-zinc-300 uppercase tracking-wider font-mono">Similar Problems Identified</h3>
                <button 
                  onClick={handleMergeProblems}
                  className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs text-zinc-200 font-semibold transition flex items-center gap-1.5"
                >
                  <Split className="w-3.5 h-3.5 text-indigo-400" /> Merge Problems
                </button>
              </div>
              <div className="space-y-2">
                <div className="p-3 rounded-xl bg-[#050505] border border-zinc-800/80 flex justify-between items-center text-xs">
                  <span className="font-semibold text-zinc-200">Payment timeout</span>
                  <span className="font-mono text-indigo-400 font-bold">87% similarity</span>
                </div>
                <div className="p-3 rounded-xl bg-[#050505] border border-zinc-800/80 flex justify-between items-center text-xs">
                  <span className="font-semibold text-zinc-200">UPI confirmation failure</span>
                  <span className="font-mono text-indigo-400 font-bold">82% similarity</span>
                </div>
                <div className="p-3 rounded-xl bg-[#050505] border border-zinc-800/80 flex justify-between items-center text-xs">
                  <span className="font-semibold text-zinc-200">Order missing after payment</span>
                  <span className="font-mono text-indigo-400 font-bold">76% similarity</span>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: AI Recommendations & Integration Widgets */}
          <div className="space-y-6">
            
            {/* AI Recommendation Widget */}
            <div className="glass-panel p-5 rounded-2xl border border-indigo-500/30 bg-[#0D0D12] glow-ai-card space-y-4">
              <h3 className="text-xs font-bold text-indigo-400 uppercase tracking-wider font-mono flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" /> ✦ AI Recommendation
              </h3>
              
              <div className="space-y-2.5 text-xs font-mono bg-[#050505] p-3.5 rounded-xl border border-zinc-800">
                <div className="flex justify-between border-b border-zinc-850 pb-1.5">
                  <span className="text-zinc-500">Suggested Team</span>
                  <strong className="text-indigo-400">{recommendation.team}</strong>
                </div>
                <div className="flex justify-between border-b border-zinc-850 pb-1.5">
                  <span className="text-zinc-500">Confidence</span>
                  <strong className="text-emerald-400">97% confidence</strong>
                </div>
                <div className="flex justify-between border-b border-zinc-850 pb-1.5">
                  <span className="text-zinc-500">Target Sprint</span>
                  <strong className="text-zinc-200">{recommendation.sprint}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Estimated Due</span>
                  <strong className="text-amber-400">{recommendation.fix_time}</strong>
                </div>
              </div>

              <p className="text-xs text-zinc-300 italic bg-indigo-500/5 p-3 rounded-xl border border-indigo-500/15 leading-relaxed">
                "{recommendation.reason}"
              </p>

              <button 
                onClick={() => setAssignModalOpen(true)}
                className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md transition"
              >
                Assign Problem
              </button>
            </div>

            {/* Jira Integration Box */}
            <div className="glass-panel p-5 rounded-2xl border border-zinc-800/80 bg-[#0D0D12] space-y-3">
              <h3 className="text-xs font-bold text-zinc-300 uppercase tracking-wider font-mono flex items-center justify-between">
                <span>Engineering Integration</span>
                <span className="text-[10px] text-emerald-400 font-bold">● Jira Connected</span>
              </h3>
              <p className="text-xs text-zinc-400">
                Create and synchronize engineering issues directly from EchoOps.
              </p>
              <button
                onClick={() => setJiraModalOpen(true)}
                className="w-full py-2.5 rounded-xl bg-[#050505] border border-zinc-800 hover:border-indigo-500/40 text-xs font-bold text-zinc-200 flex items-center justify-center gap-2 transition"
              >
                <GitBranch className="w-4 h-4 text-indigo-400" /> Create Jira Issue
              </button>
            </div>

          </div>

        </div>

      </div>

      {/* Jira Create Ticket Modal */}
      {jiraModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-lg bg-[#0B0B0F] border border-zinc-800 rounded-2xl p-6 space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-white font-heading">Create Jira Issue</h3>
            <div className="space-y-3 text-xs">
              <div>
                <label className="text-[10px] font-mono uppercase text-zinc-500 block mb-1">Project</label>
                <select className="w-full bg-[#050505] border border-zinc-800 rounded-xl p-2.5 text-zinc-200">
                  <option value="PAY">PAY (Payments Engine)</option>
                  <option value="MOBILE">MOBILE (Mobile App)</option>
                </select>
              </div>
              <div>
                <label className="text-[10px] font-mono uppercase text-zinc-500 block mb-1">Title</label>
                <input type="text" defaultValue={issue.title} className="w-full bg-[#050505] border border-zinc-800 rounded-xl p-2.5 text-zinc-200" />
              </div>
              <div>
                <label className="text-[10px] font-mono uppercase text-zinc-500 block mb-1">Priority</label>
                <select className="w-full bg-[#050505] border border-zinc-800 rounded-xl p-2.5 text-zinc-200">
                  <option value="Highest">Highest</option>
                  <option value="High">High</option>
                </select>
              </div>
              <div>
                <label className="text-[10px] font-mono uppercase text-zinc-500 block mb-1">Assignee</label>
                <input type="text" defaultValue="Rahul Sharma" className="w-full bg-[#050505] border border-zinc-800 rounded-xl p-2.5 text-zinc-200" />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button onClick={() => setJiraModalOpen(false)} className="px-4 py-2 bg-zinc-800 text-zinc-300 text-xs rounded-xl">Cancel</button>
              <button onClick={handleCreateJiraTicket} className="px-4 py-2 bg-indigo-600 text-white text-xs font-bold rounded-xl shadow">Create Jira Issue</button>
            </div>
          </div>
        </div>
      )}

      {/* Assign Problem Modal */}
      {assignModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-md bg-[#0B0B0F] border border-zinc-800 rounded-2xl p-6 space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-white font-heading">Assign Problem</h3>
            <div className="space-y-3 text-xs">
              <div>
                <label className="text-[10px] font-mono uppercase text-zinc-500 block mb-1">Team</label>
                <select value={assignTeam} onChange={(e) => setAssignTeam(e.target.value)} className="w-full bg-[#050505] border border-zinc-800 rounded-xl p-2.5 text-zinc-200">
                  <option value="Payments Engineering">Payments Engineering</option>
                  <option value="Support">Support</option>
                  <option value="Logistics">Logistics</option>
                </select>
              </div>
              <div>
                <label className="text-[10px] font-mono uppercase text-zinc-500 block mb-1">Assignee</label>
                <input type="text" value={assignEmployee} onChange={(e) => setAssignEmployee(e.target.value)} className="w-full bg-[#050505] border border-zinc-800 rounded-xl p-2.5 text-zinc-200" />
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
