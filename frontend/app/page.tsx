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
  Flame
} from 'lucide-react';

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
  average_rating: number;
  estimated_revenue_risk: number;
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
    avgRating: 4.4,
    resolvedCount: 42
  });

  // Ingestion form state
  const [showIngestForm, setShowIngestForm] = useState(false);
  const [ingestMode, setIngestMode] = useState<'manual' | 'instagram' | 'appstore'>('manual');
  const [ingestText, setIngestText] = useState('');
  const [ingestSource, setIngestSource] = useState('Google Play Store');
  const [ingestRating, setIngestRating] = useState(1);
  const [ingesting, setIngesting] = useState(false);
  const [ingestSuccess, setIngestSuccess] = useState(false);

  // Scanners state
  const [instaUrl, setInstaUrl] = useState('https://www.instagram.com/p/C8x9Ab2M3vP/');
  const [instaScanning, setInstaScanning] = useState(false);
  const [appStoreUrl, setAppStoreUrl] = useState('https://apps.apple.com/us/app/echoops-mobile/id987654321');
  const [appStoreScanning, setAppStoreScanning] = useState(false);

  const mockDefaultProblems: ProblemItem[] = [
    {
      id: 1,
      title: 'Payment crashes after UPI',
      summary: 'Application crashes immediately after completing payment via UPI gateway',
      status: 'In Progress',
      priority: 'Critical',
      health_score: 98,
      health_status: 'Business Critical',
      assigned_team: 'Payments',
      total_reports: 2431,
      average_rating: 1.2,
      estimated_revenue_risk: 42000,
      trend: '↑ 42%',
      created_at: '18 July'
    },
    {
      id: 2,
      title: 'Refund taking too long',
      summary: 'Customers report delayed refund processing status taking 7+ business days',
      status: 'Open',
      priority: 'High',
      health_score: 87,
      health_status: 'Critical',
      assigned_team: 'Support',
      total_reports: 1102,
      average_rating: 1.8,
      estimated_revenue_risk: 18500,
      trend: '↑ 18%',
      created_at: '19 July'
    },
    {
      id: 3,
      title: 'Delivery tracking inaccurate',
      summary: 'Live map location coordinates fail to refresh during delivery transit',
      status: 'Resolved',
      priority: 'Medium',
      health_score: 64,
      health_status: 'Needs Attention',
      assigned_team: 'Logistics',
      total_reports: 897,
      average_rating: 3.2,
      estimated_revenue_risk: 8400,
      trend: '↓ 5%',
      created_at: '20 July'
    },
    {
      id: 4,
      title: 'OTP verification code not received',
      summary: 'SMS Gateway timeouts lock users out of Google OAuth & SMS login',
      status: 'Open',
      priority: 'High',
      health_score: 82,
      health_status: 'Critical',
      assigned_team: 'Authentication',
      total_reports: 563,
      average_rating: 2.1,
      estimated_revenue_risk: 12100,
      trend: '↑ 22%',
      created_at: '21 July'
    }
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
            health_status: getHealthLabel(d.health_score || 85),
            assigned_team: d.assigned_team || 'Engineering',
            total_reports: d.total_reports || 100,
            average_rating: d.average_rating || 2.0,
            estimated_revenue_risk: d.estimated_revenue_risk || 5000,
            trend: d.health_score > 80 ? '↑ 34%' : '↓ 8%',
            created_at: 'Today'
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
    const filtered = problems.filter(p => 
      p.title.toLowerCase().includes(q) || 
      p.summary.toLowerCase().includes(q) || 
      p.assigned_team.toLowerCase().includes(q) || 
      p.priority.toLowerCase().includes(q)
    );
    setFilteredProblems(filtered);
  }, [searchQuery, problems]);

  const getHealthLabel = (score: number) => {
    if (score >= 95) return 'Business Critical';
    if (score >= 80) return 'Critical';
    if (score >= 60) return 'Needs Attention';
    if (score >= 40) return 'Growing';
    return 'Stable';
  };

  const getHealthBadgeStyle = (score: number) => {
    if (score >= 95) return { bg: 'bg-purple-500/10 border-purple-500/30 text-purple-400', label: 'Business Critical', dot: 'bg-purple-500 shadow-purple-500/50' };
    if (score >= 80) return { bg: 'bg-red-500/10 border-red-500/30 text-red-400 pulse-critical', label: 'Critical', dot: 'bg-red-500 shadow-red-500/50' };
    if (score >= 60) return { bg: 'bg-orange-500/10 border-orange-500/30 text-orange-400', label: 'Needs Attention', dot: 'bg-orange-500' };
    if (score >= 40) return { bg: 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400', label: 'Growing', dot: 'bg-yellow-500' };
    return { bg: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400', label: 'Stable', dot: 'bg-emerald-500' };
  };

  const handleIngestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ingestText.trim()) return;
    setIngesting(true);
    setIngestSuccess(false);

    try {
      const res = await fetch('http://localhost:8000/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          source: ingestSource,
          original_text: ingestText,
          meta_info: { rating: Number(ingestRating), platform: 'Mobile' }
        })
      });
      if (res.ok) {
        setIngestSuccess(true);
        setIngestText('');
        fetchData();
        setTimeout(() => setIngestSuccess(false), 3000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIngesting(false);
    }
  };

  return (
    <SidebarLayout>
      <div className="space-y-6 max-w-7xl mx-auto">
        
        {/* Main Dashboard Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-850 pb-5">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white font-heading">
              Good morning, Alex
            </h1>
            <p className="text-xs sm:text-sm text-zinc-400 mt-1">
              Here's what your customers are telling you across 152,948 reviews, emails, and voice calls.
            </p>
          </div>
          
          <div className="flex items-center gap-3 shrink-0">
            <div className="text-[11px] font-mono text-zinc-500 flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#0D0D12] border border-zinc-800">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
              Last synced 4 min ago
            </div>
            <button 
              onClick={() => setShowIngestForm(!showIngestForm)}
              className="px-3.5 py-1.5 rounded-xl bg-ai-gradient text-white text-xs font-semibold shadow-md flex items-center gap-1.5 hover:opacity-90 transition"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Ingest Feedback</span>
            </button>
            <button 
              onClick={fetchData} 
              className="p-2 rounded-xl bg-[#0D0D12] border border-zinc-800 text-zinc-400 hover:text-white transition"
              title="Refresh Data"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Ingestion Console Form */}
        {showIngestForm && (
          <div className="glass-panel p-5 rounded-2xl border border-indigo-500/30 bg-[#0D0D12] glow-ai-card space-y-4">
            <div className="flex justify-between items-center border-b border-zinc-800 pb-3">
              <h3 className="text-xs font-bold text-indigo-400 flex items-center gap-1.5 font-mono uppercase tracking-wider">
                <Sparkles className="w-4 h-4" /> AI Feedback Pipeline Ingestor
              </h3>
              <div className="flex bg-[#050505] p-1 rounded-xl border border-zinc-800 text-xs gap-1">
                <button
                  type="button"
                  onClick={() => setIngestMode('manual')}
                  className={`px-3 py-1 rounded-lg font-semibold transition ${ingestMode === 'manual' ? 'bg-indigo-600 text-white' : 'text-zinc-400 hover:text-zinc-200'}`}
                >
                  Manual Text
                </button>
                <button
                  type="button"
                  onClick={() => setIngestMode('appstore')}
                  className={`px-3 py-1 rounded-lg font-semibold transition ${ingestMode === 'appstore' ? 'bg-indigo-600 text-white' : 'text-zinc-400 hover:text-zinc-200'}`}
                >
                  App Store Review
                </button>
              </div>
            </div>

            <form onSubmit={handleIngestSubmit} className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="md:col-span-2">
                  <textarea
                    required
                    value={ingestText}
                    onChange={(e) => setIngestText(e.target.value)}
                    placeholder="Enter customer feedback text (e.g. 'UPI payment failed after order confirmation...')"
                    className="w-full bg-[#050505] border border-zinc-800 rounded-xl p-3 text-xs text-zinc-200 focus:outline-none focus:border-indigo-500 h-20 resize-none"
                  />
                </div>
                <div className="space-y-2">
                  <select
                    value={ingestSource}
                    onChange={(e) => setIngestSource(e.target.value)}
                    className="w-full bg-[#050505] border border-zinc-800 text-xs text-zinc-300 rounded-xl p-2.5"
                  >
                    <option value="Google Play Store">Google Play Store</option>
                    <option value="Apple App Store">Apple App Store</option>
                    <option value="Zendesk">Zendesk Ticket</option>
                    <option value="Support Email">Support Email</option>
                  </select>
                  <button
                    type="submit"
                    disabled={ingesting}
                    className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition shadow-md"
                  >
                    {ingesting ? 'Analyzing...' : 'Ingest to AI Pipeline'}
                  </button>
                </div>
              </div>
              {ingestSuccess && (
                <p className="text-xs text-emerald-400 font-medium">✓ Feedback processed and clustered into dashboard in real-time!</p>
              )}
            </form>
          </div>
        )}

        {/* Top 7 Metric Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Card 1: Reviews Processed */}
          <div className="glass-panel p-5 rounded-2xl card-hover border border-zinc-800/80 bg-[#0D0D12]">
            <div className="flex justify-between items-start text-xs font-semibold text-zinc-400 uppercase tracking-wider">
              <span>Reviews Processed</span>
              <span className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400"><Inbox className="w-4 h-4" /></span>
            </div>
            <div className="mt-4 flex items-baseline justify-between">
              <span className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">{stats.processed}</span>
              <span className="text-xs font-semibold text-emerald-400 flex items-center gap-0.5">
                <TrendingUp className="w-3.5 h-3.5" /> +12.4%
              </span>
            </div>
            <span className="text-[10px] text-zinc-500 mt-1 block">vs last week</span>
          </div>

          {/* Card 2: Total Problems */}
          <div className="glass-panel p-5 rounded-2xl card-hover border border-zinc-800/80 bg-[#0D0D12]">
            <div className="flex justify-between items-start text-xs font-semibold text-zinc-400 uppercase tracking-wider">
              <span>Total Problems</span>
              <span className="p-1.5 rounded-lg bg-zinc-800 text-zinc-300"><Activity className="w-4 h-4" /></span>
            </div>
            <div className="mt-4 flex items-baseline justify-between">
              <span className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">{stats.totalProblems}</span>
              <span className="text-xs font-semibold text-amber-400">18 new</span>
            </div>
            <span className="text-[10px] text-zinc-500 mt-1 block">active clusters</span>
          </div>

          {/* Card 3: Critical Problems */}
          <div className="glass-panel p-5 rounded-2xl card-hover border border-red-500/20 bg-[#0D0D12]">
            <div className="flex justify-between items-start text-xs font-semibold text-zinc-400 uppercase tracking-wider">
              <span>Critical Problems</span>
              <span className="p-1.5 rounded-lg bg-red-500/10 text-red-400"><AlertTriangle className="w-4 h-4" /></span>
            </div>
            <div className="mt-4 flex items-baseline justify-between">
              <span className="text-2xl sm:text-3xl font-extrabold text-red-500 tracking-tight">{stats.criticalProblems}</span>
              <span className="text-xs font-semibold text-red-400 flex items-center gap-0.5">
                ↑ 3 this week
              </span>
            </div>
            <span className="text-[10px] text-zinc-500 mt-1 block">requires urgent hotfix</span>
          </div>

          {/* Card 4: AI Health Gauge Card */}
          <div className="glass-panel p-5 rounded-2xl card-hover border border-indigo-500/30 bg-[#0D0D12] glow-ai-card flex flex-col justify-between">
            <div className="flex justify-between items-start text-xs font-semibold text-zinc-400 uppercase tracking-wider">
              <span className="text-indigo-300 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" /> AI Health Index
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/25">
                Healthy
              </span>
            </div>
            <div className="mt-3 flex items-center justify-between">
              <div>
                <span className="text-3xl sm:text-4xl font-black text-white font-heading">{stats.healthIndex}</span>
                <span className="text-xs text-zinc-500 font-mono"> / 100</span>
              </div>
              {/* Semi-circular gauge visual */}
              <div className="w-14 h-14 rounded-full border-4 border-zinc-800 border-t-indigo-500 border-r-purple-500 border-b-pink-500 flex items-center justify-center font-bold text-xs text-indigo-400">
                82%
              </div>
            </div>
            <span className="text-[10px] text-emerald-400 font-semibold mt-2 block">↑ 6.4% this week</span>
          </div>

        </div>

        {/* Secondary KPI Metrics Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          
          {/* CSAT */}
          <div className="glass-panel p-4 rounded-xl border border-zinc-800/80 bg-[#0D0D12] flex items-center justify-between">
            <div>
              <span className="text-[11px] text-zinc-500 font-mono uppercase tracking-wider block font-semibold">Customer Satisfaction</span>
              <span className="text-xl font-bold text-white mt-0.5 block">{stats.csat}%</span>
            </div>
            <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">+4.2%</span>
          </div>

          {/* Average Rating */}
          <div className="glass-panel p-4 rounded-xl border border-zinc-800/80 bg-[#0D0D12] flex items-center justify-between">
            <div>
              <span className="text-[11px] text-zinc-500 font-mono uppercase tracking-wider block font-semibold">Average Rating</span>
              <span className="text-xl font-bold text-white mt-0.5 flex items-center gap-1.5">
                {stats.avgRating} <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              </span>
            </div>
            <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">+0.2★</span>
          </div>

          {/* Resolved This Week */}
          <div className="glass-panel p-4 rounded-xl border border-zinc-800/80 bg-[#0D0D12] flex items-center justify-between">
            <div>
              <span className="text-[11px] text-zinc-500 font-mono uppercase tracking-wider block font-semibold">Resolved This Week</span>
              <span className="text-xl font-bold text-emerald-400 mt-0.5 flex items-center gap-1.5">
                {stats.resolvedCount} <CheckCircle className="w-4 h-4" />
              </span>
            </div>
            <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">+18%</span>
          </div>

        </div>

        {/* Top Customer Problems Section */}
        <div className="glass-panel rounded-2xl border border-zinc-800/80 bg-[#0D0D12] overflow-hidden">
          
          <div className="px-6 py-4 border-b border-zinc-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-lg font-extrabold text-white font-heading">Top Customer Problems</h2>
              <p className="text-xs text-zinc-400 mt-0.5">Problems requiring the most attention right now, clustered by AI.</p>
            </div>
            {searchQuery && (
              <span className="text-xs bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-3 py-1 rounded-full font-mono">
                Filtered: "{searchQuery}"
              </span>
            )}
          </div>

          {loading ? (
            <div className="p-12 text-center text-zinc-500">
              <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
              <span className="text-xs">Analyzing customer problems...</span>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-zinc-800/80 bg-[#080808] text-zinc-400 uppercase text-[10px] font-mono tracking-wider">
                    <th className="py-3.5 px-6">Problem</th>
                    <th className="py-3.5 px-6 text-center">Health Score</th>
                    <th className="py-3.5 px-6 text-center">Reports</th>
                    <th className="py-3.5 px-6 text-center">Trend</th>
                    <th className="py-3.5 px-6">Priority</th>
                    <th className="py-3.5 px-6">Team</th>
                    <th className="py-3.5 px-6">Status</th>
                    <th className="py-3.5 px-6 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-850">
                  {filteredProblems.map((prob) => {
                    const badge = getHealthBadgeStyle(prob.health_score);
                    return (
                      <tr
                        key={prob.id}
                        onClick={() => router.push(`/issues/${prob.id}`)}
                        className="hover:bg-zinc-900/50 cursor-pointer transition duration-150 group card-hover"
                      >
                        <td className="py-4 px-6">
                          <div className="font-bold text-sm text-zinc-100 group-hover:text-indigo-400 transition font-heading">
                            {prob.title}
                          </div>
                          <div className="text-xs text-zinc-400 mt-0.5 line-clamp-1 max-w-sm">
                            {prob.summary}
                          </div>
                        </td>

                        {/* Health Score Indicator */}
                        <td className="py-4 px-6 text-center">
                          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full border text-xs font-extrabold font-mono shadow-sm ${badge.bg}">
                            <span className={`w-2 h-2 rounded-full ${badge.dot}`} />
                            <span>● {prob.health_score}</span>
                            <span className="text-[10px] opacity-80 uppercase font-sans font-semibold">{badge.label}</span>
                          </div>
                        </td>

                        <td className="py-4 px-6 text-center font-mono font-bold text-zinc-200 text-sm">
                          {prob.total_reports.toLocaleString()}
                        </td>

                        <td className="py-4 px-6 text-center">
                          <span className={`text-xs font-bold ${prob.trend.includes('↑') ? 'text-red-400' : 'text-emerald-400'}`}>
                            {prob.trend}
                          </span>
                        </td>

                        <td className="py-4 px-6 font-bold text-xs uppercase tracking-wider">
                          <span className={prob.priority === 'Critical' ? 'text-red-400 font-extrabold' : 'text-amber-400'}>
                            {prob.priority}
                          </span>
                        </td>

                        <td className="py-4 px-6 text-zinc-300 font-medium">
                          <span className="px-2 py-1 rounded-lg bg-zinc-900 border border-zinc-800 text-[11px]">
                            {prob.assigned_team}
                          </span>
                        </td>

                        <td className="py-4 px-6">
                          <span className={`px-2.5 py-1 text-[10px] font-bold uppercase rounded-md border ${
                            prob.status === 'In Progress' ? 'bg-indigo-500/10 border-indigo-500/25 text-indigo-400' :
                            prob.status === 'Resolved' ? 'bg-emerald-500/10 border-emerald-500/25 text-emerald-400' :
                            'bg-zinc-800 border-zinc-700 text-zinc-300'
                          }`}>
                            {prob.status}
                          </span>
                        </td>

                        <td className="py-4 px-6 text-right">
                          <button className="text-zinc-500 group-hover:text-indigo-400 group-hover:translate-x-1 transition">
                            <ArrowRight className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

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
