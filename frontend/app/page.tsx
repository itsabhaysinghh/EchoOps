'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import SidebarLayout from './components/SidebarLayout';
import { 
  TrendingDown, 
  TrendingUp, 
  AlertTriangle, 
  Percent, 
  Star, 
  CheckCircle,
  Inbox,
  ArrowRight,
  Sparkles,
  RefreshCw,
  Clock,
  Zap,
  Activity,
  Flame,
  Bot,
  Layers,
  Compass,
  ChevronRight
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

interface ProblemItem {
  id: number;
  title: string;
  summary: string;
  status: string;
  priority: string;
  health_score: number;
  health_status: string;
  assigned_team: string;
  total_reports: number;
  trend: string;
  created_at: string;
}

function DashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get('search') || '';

  const [loading, setLoading] = useState(true);
  const [problems, setProblems] = useState<ProblemItem[]>([]);
  const [filteredProblems, setFilteredProblems] = useState<ProblemItem[]>([]);
  
  const [stats, setStats] = useState({
    processed: '152,948',
    totalProblems: 248,
    criticalProblems: 8,
    healthIndex: 82,
    csat: 84,
    resolvedCount: 42
  });

  const mockDefaultProblems: ProblemItem[] = [
    {
      id: 1,
      title: 'Payment crashes after UPI',
      summary: 'Customers report that the app crashes immediately after completing a UPI payment.',
      status: 'In Progress',
      priority: 'Critical',
      health_score: 98,
      health_status: 'BUSINESS CRITICAL',
      assigned_team: 'Payments Engineering',
      total_reports: 2431,
      trend: '↑ 42%',
      created_at: '2m ago'
    },
    {
      id: 2,
      title: 'Refund taking too long',
      summary: 'Delayed refund processing status taking 7+ business days to reflect in bank.',
      status: 'Open',
      priority: 'High',
      health_score: 87,
      health_status: 'CRITICAL',
      assigned_team: 'Support Operations',
      total_reports: 1102,
      trend: '↑ 18%',
      created_at: '12m ago'
    },
    {
      id: 3,
      title: 'Delivery tracking inaccurate',
      summary: 'Live map location coordinates fail to refresh during courier transit.',
      status: 'Resolved',
      priority: 'Medium',
      health_score: 64,
      health_status: 'NEEDS ATTENTION',
      assigned_team: 'Logistics Team',
      total_reports: 897,
      trend: '↓ 5%',
      created_at: '24m ago'
    },
    {
      id: 4,
      title: 'OTP verification code not received',
      summary: 'SMS Gateway timeouts lock users out of Google OAuth & SMS login.',
      status: 'Open',
      priority: 'High',
      health_score: 82,
      health_status: 'CRITICAL',
      assigned_team: 'Authentication Team',
      total_reports: 563,
      trend: '↑ 22%',
      created_at: '1h ago'
    }
  ];

  const signalChartData = [
    { day: '1 Aug', Positive: 240, Neutral: 120, Negative: 40, Critical: 10 },
    { day: '5 Aug', Positive: 310, Neutral: 140, Negative: 45, Critical: 12 },
    { day: '10 Aug', Positive: 280, Neutral: 160, Negative: 70, Critical: 28 },
    { day: '15 Aug', Positive: 420, Neutral: 180, Negative: 110, Critical: 45 },
    { day: '20 Aug', Positive: 510, Neutral: 190, Negative: 90, Critical: 32 },
    { day: '23 Aug', Positive: 680, Neutral: 210, Negative: 85, Critical: 18 }
  ];

  const recentActivity = [
    { text: 'AI detected new critical issue', sub: 'Payment Crash', time: '2 minutes ago', badge: 'bg-red-500/10 text-red-400' },
    { text: 'Jira ticket created', sub: 'PAY-4821', time: '5 minutes ago', badge: 'bg-indigo-500/10 text-indigo-400' },
    { text: 'Refund Delay assigned', sub: 'Support Team', time: '12 minutes ago', badge: 'bg-zinc-800 text-zinc-300' },
    { text: 'Issue verified as resolved', sub: 'Coupon Bug', time: '24 minutes ago', badge: 'bg-emerald-500/10 text-emerald-400' }
  ];

  const aiInsights = [
    { text: 'Payment complaints increased 42% after version 12.5 rollout.', time: 'Just now', icon: AlertTriangle, color: 'text-red-400' },
    { text: 'Refund complaints are stabilizing following Support manual workflow.', time: '10m ago', icon: CheckCircle, color: 'text-emerald-400' },
    { text: 'Android 15 is generating 31% more crash reports than Android 14.', time: '25m ago', icon: Zap, color: 'text-amber-400' },
    { text: 'Dark Mode is the fastest-growing feature request (1,284 upvotes).', time: '1h ago', icon: Sparkles, color: 'text-indigo-400' }
  ];

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:8000/api/issues');
      if (res.ok) {
        const data = await res.json();
        if (data && data.length > 0) {
          const mapped: ProblemItem[] = data.map((d: any) => ({
            id: d.id,
            title: d.title,
            summary: d.summary,
            status: d.status || 'Open',
            priority: d.priority || 'High',
            health_score: d.health_score || 85,
            health_status: d.health_score >= 95 ? 'BUSINESS CRITICAL' : d.health_score >= 80 ? 'CRITICAL' : d.health_score >= 60 ? 'NEEDS ATTENTION' : 'STABLE',
            assigned_team: d.assigned_team || 'Engineering',
            total_reports: d.total_reports || 100,
            trend: d.health_score > 80 ? '↑ 42%' : '↓ 5%',
            created_at: 'Just now'
          }));
          setProblems(mapped);
        } else {
          setProblems(mockDefaultProblems);
        }
      } else {
        setProblems(mockDefaultProblems);
      }
    } catch (err) {
      setProblems(mockDefaultProblems);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (!searchQuery) {
      setFilteredProblems(problems);
      return;
    }
    const q = searchQuery.toLowerCase();
    setFilteredProblems(problems.filter(p => p.title.toLowerCase().includes(q) || p.summary.toLowerCase().includes(q)));
  }, [searchQuery, problems]);

  const getProblemScoreStyle = (score: number) => {
    if (score >= 95) return { color: 'text-purple-400', bg: 'bg-purple-500/10 border-purple-500/30', label: 'BUSINESS CRITICAL', dot: 'bg-purple-500 shadow-purple-500/50' };
    if (score >= 80) return { color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/30 pulse-critical', label: 'CRITICAL', dot: 'bg-red-500 shadow-red-500/50' };
    if (score >= 60) return { color: 'text-orange-400', bg: 'bg-orange-500/10 border-orange-500/30', label: 'NEEDS ATTENTION', dot: 'bg-orange-500' };
    if (score >= 40) return { color: 'text-yellow-400', bg: 'bg-yellow-500/10 border-yellow-500/30', label: 'GROWING', dot: 'bg-yellow-500' };
    return { color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/30', label: 'STABLE', dot: 'bg-emerald-500' };
  };

  return (
    <SidebarLayout>
      <div className="space-y-6 max-w-7xl mx-auto">
        
        {/* Dashboard Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.06] pb-5">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-heading">
              Customer Intelligence
            </h1>
            <p className="text-xs sm:text-sm text-zinc-400 mt-1">
              Here's what changed in your customer voice.
            </p>
            <div className="flex items-center gap-2 text-xs font-mono text-zinc-500 mt-2">
              <span className="text-zinc-300 font-semibold">{stats.processed} signals analyzed</span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                Last synchronized 4 minutes ago
              </span>
            </div>
          </div>
          
          <div className="flex items-center gap-2.5 shrink-0">
            <button 
              onClick={() => window.dispatchEvent(new CustomEvent('open-ai-drawer'))}
              className="px-4 py-2 rounded-xl bg-ai-gradient text-white text-xs font-bold shadow-lg flex items-center gap-2 hover:opacity-95 transition"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Ask EchoOps</span>
            </button>
            <button 
              onClick={fetchData} 
              className="p-2 rounded-xl bg-white/[0.03] border border-white/[0.06] text-zinc-400 hover:text-white transition"
              title="Refresh Intelligence"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* HERO CENTERPIECE COMPONENT: AI HEALTH SECTION */}
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/[0.08] bg-[#08080A] glow-ai-card space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            
            {/* Center Gauge Radial Signal */}
            <div className="flex items-center gap-6">
              <div className="relative w-28 h-28 sm:w-32 sm:h-32 flex items-center justify-center shrink-0">
                {/* Outer Radial Ring */}
                <div className="absolute inset-0 rounded-full border-4 border-white/[0.06] border-t-indigo-500 border-r-purple-500 border-b-pink-500 ambient-signal-pulse" />
                <div className="text-center">
                  <span className="text-4xl sm:text-5xl font-black text-white tracking-tighter font-heading block">
                    82
                  </span>
                  <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-emerald-400 block mt-0.5">
                    HEALTHY
                  </span>
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-400">CUSTOMER HEALTH</span>
                  <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/25">
                    ↑ 6.4% this week
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white font-heading">
                  AI Customer Health Signal
                </h3>
                <p className="text-xs text-zinc-400 max-w-md leading-relaxed">
                  Customer sentiment is improving across mobile app reviews, but payment-related complaints require immediate engineering hotfix.
                </p>
              </div>
            </div>

            {/* Sentiment Signal Breakdown */}
            <div className="bg-white/[0.02] border border-white/[0.06] p-4 rounded-2xl space-y-3 min-w-[240px]">
              <span className="text-[10px] font-mono uppercase font-semibold text-zinc-400 tracking-wider block">Customer Signal Sentiment</span>
              
              {/* Sentiment Progress Bar */}
              <div className="h-2 w-full rounded-full bg-zinc-900 overflow-hidden flex">
                <div className="h-full bg-emerald-500" style={{ width: '71%' }} />
                <div className="h-full bg-indigo-500" style={{ width: '17%' }} />
                <div className="h-full bg-red-500" style={{ width: '12%' }} />
              </div>

              <div className="flex justify-between items-center text-xs font-mono">
                <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-500" /> <span className="text-zinc-300 font-bold">71%</span> <span className="text-zinc-500">Positive</span></div>
                <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-indigo-500" /> <span className="text-zinc-300 font-bold">17%</span> <span className="text-zinc-500">Neutral</span></div>
                <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-red-500" /> <span className="text-zinc-300 font-bold">12%</span> <span className="text-zinc-500">Negative</span></div>
              </div>
            </div>

          </div>

          {/* AI Health Observation Insight */}
          <div className="p-4 rounded-2xl bg-indigo-500/5 border border-indigo-500/20 text-xs flex items-center gap-3">
            <Sparkles className="w-4 h-4 text-indigo-400 shrink-0" />
            <span className="text-zinc-300">
              <strong className="text-white font-semibold">✦ AI Insight:</strong> Customer satisfaction improved 6.4% this week, but payment-related complaints are increasing rapidly in release v12.5.
            </span>
          </div>
        </div>

        {/* Customer Signal Graph */}
        <div className="glass-panel p-6 rounded-2xl border border-white/[0.06] bg-[#08080A] space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-sm font-bold text-white font-heading">Customer Signal Activity</h3>
              <p className="text-xs text-zinc-400 mt-0.5">Customer feedback signals analyzed over the last 30 days.</p>
            </div>
            <div className="flex gap-4 text-xs font-mono text-zinc-400">
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Positive</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-indigo-500" /> Neutral</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-red-500" /> Critical</span>
            </div>
          </div>

          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={signalChartData}>
                <defs>
                  <linearGradient id="colorPos" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorCrit" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#EF4444" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#EF4444" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="day" stroke="#71717a" fontSize={11} />
                <YAxis stroke="#71717a" fontSize={11} />
                <Tooltip contentStyle={{ backgroundColor: '#0C0C10', borderColor: 'rgba(255,255,255,0.08)' }} />
                <Area type="monotone" dataKey="Positive" stroke="#10B981" fillOpacity={1} fill="url(#colorPos)" />
                <Area type="monotone" dataKey="Critical" stroke="#EF4444" fillOpacity={1} fill="url(#colorCrit)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Compact Essential Metrics Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs font-mono">
          <div className="p-3.5 rounded-xl bg-[#08080A] border border-white/[0.06]">
            <span className="text-zinc-500 text-[10px] uppercase block font-semibold">Signals</span>
            <span className="text-lg font-bold text-white mt-0.5 block">152K</span>
          </div>
          <div className="p-3.5 rounded-xl bg-[#08080A] border border-white/[0.06]">
            <span className="text-zinc-500 text-[10px] uppercase block font-semibold">Problems</span>
            <span className="text-lg font-bold text-white mt-0.5 block">248</span>
          </div>
          <div className="p-3.5 rounded-xl bg-red-500/5 border border-red-500/20">
            <span className="text-red-400 text-[10px] uppercase block font-bold">Critical</span>
            <span className="text-lg font-extrabold text-red-500 mt-0.5 block">8</span>
          </div>
          <div className="p-3.5 rounded-xl bg-[#08080A] border border-white/[0.06]">
            <span className="text-zinc-500 text-[10px] uppercase block font-semibold">Resolved</span>
            <span className="text-lg font-bold text-emerald-400 mt-0.5 block">42</span>
          </div>
          <div className="p-3.5 rounded-xl bg-[#08080A] border border-white/[0.06] col-span-2 sm:col-span-1">
            <span className="text-zinc-500 text-[10px] uppercase block font-semibold">Satisfaction</span>
            <span className="text-lg font-bold text-emerald-400 mt-0.5 block">84%</span>
          </div>
        </div>

        {/* 2 Column Section: Intelligent Problem Feed (Left) & Side Intelligence Panel (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left: Intelligent Problem Feed */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-lg font-bold text-white font-heading">Problems requiring attention</h2>
                <p className="text-xs text-zinc-400 mt-0.5">AI-ranked by customer impact and urgency.</p>
              </div>
            </div>

            <div className="space-y-3">
              {filteredProblems.map((prob) => {
                const badge = getProblemScoreStyle(prob.health_score);
                return (
                  <div
                    key={prob.id}
                    onClick={() => router.push(`/issues/${prob.id}`)}
                    className="p-5 rounded-2xl bg-[#08080A] border border-white/[0.06] hover:border-white/[0.14] card-hover cursor-pointer transition space-y-3"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className={`w-2 h-2 rounded-full ${badge.dot}`} />
                          <h3 className="text-base font-bold text-white font-heading group-hover:text-indigo-400 transition">
                            {prob.title}
                          </h3>
                        </div>
                        <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                          {prob.summary}
                        </p>
                      </div>

                      {/* Score Gauge Badge */}
                      <div className="text-right shrink-0">
                        <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-extrabold border ${badge.bg}`}>
                          <span>{prob.health_score}</span>
                          <span className="text-[9px] uppercase tracking-wider opacity-90">{badge.label}</span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-white/[0.04] flex items-center justify-between text-xs font-mono">
                      <div className="flex items-center gap-4 text-zinc-400">
                        <span><strong>{prob.total_reports.toLocaleString()}</strong> reports</span>
                        <span className={`font-bold ${prob.trend.includes('↑') ? 'text-red-400' : 'text-emerald-400'}`}>{prob.trend}</span>
                        <span>Team: <strong className="text-zinc-200">{prob.assigned_team}</strong></span>
                      </div>
                      <div className="flex items-center gap-1 text-indigo-400 font-semibold hover:translate-x-1 transition">
                        <span>View Details</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right: AI Intelligence Panel & Activity Feed */}
          <div className="space-y-6">
            
            {/* EchoOps Intelligence Panel */}
            <div className="glass-panel p-5 rounded-2xl border border-white/[0.06] bg-[#08080A] space-y-4">
              <h3 className="text-xs font-bold text-indigo-400 uppercase tracking-wider font-mono flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-indigo-400" /> ✦ EchoOps Intelligence
              </h3>

              <div className="space-y-3">
                {aiInsights.map((insight, idx) => {
                  const Icon = insight.icon;
                  return (
                    <div key={idx} className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.04] space-y-1 text-xs">
                      <div className="flex items-center justify-between">
                        <span className={`flex items-center gap-1.5 font-bold ${insight.color}`}>
                          <Icon className="w-3.5 h-3.5" /> Alert
                        </span>
                        <span className="text-[9px] font-mono text-zinc-500">{insight.time}</span>
                      </div>
                      <p className="text-zinc-300 font-sans leading-relaxed">{insight.text}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Minimal Recent Activity Timeline */}
            <div className="glass-panel p-5 rounded-2xl border border-white/[0.06] bg-[#08080A] space-y-3">
              <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider font-mono">Recent Activity</h3>
              <div className="space-y-3 relative border-l border-white/[0.06] ml-2 pl-4 text-xs font-mono">
                {recentActivity.map((act, idx) => (
                  <div key={idx} className="relative space-y-0.5">
                    <span className="w-2 h-2 rounded-full bg-indigo-500 absolute -left-[21px] top-1" />
                    <div className="font-semibold text-zinc-200">{act.text}</div>
                    <div className="text-[10px] text-zinc-400 flex items-center justify-between">
                      <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${act.badge}`}>{act.sub}</span>
                      <span className="text-zinc-500">{act.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>

      </div>
    </SidebarLayout>
  );
}

export default function Dashboard() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#050505] flex items-center justify-center p-12 text-zinc-500">
        <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <DashboardContent />
    </Suspense>
  );
}
