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
  TrendingDown as ArrowDownRight,
  Sparkles,
  RefreshCw
} from 'lucide-react';

interface Issue {
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
  created_at: string;
}

function DashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get('search') || '';

  const [loading, setLoading] = useState(true);
  const [issues, setIssues] = useState<Issue[]>([]);
  const [filteredIssues, setFilteredIssues] = useState<Issue[]>([]);
  const [stats, setStats] = useState({
    processed: 142,
    totalIssues: 3,
    criticalIssues: 1,
    healthIndex: 82,
    csat: 78,
    avgRating: 4.1,
    resolvedCount: 8
  });

  // Ingestion form state
  const [showIngestForm, setShowIngestForm] = useState(false);
  const [ingestText, setIngestText] = useState('');
  const [ingestSource, setIngestSource] = useState('Google Play Store');
  const [ingestRating, setIngestRating] = useState(1);
  const [ingestRevenue, setIngestRevenue] = useState(0);
  const [ingestDevice, setIngestDevice] = useState('iPhone 15');
  const [ingesting, setIngesting] = useState(false);
  const [ingestSuccess, setIngestSuccess] = useState(false);

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
          meta_info: {
            rating: Number(ingestRating),
            revenue_impact: Number(ingestRevenue),
            device: ingestDevice,
            country: 'United States',
            version: 'v1.2.0',
            platform: ingestSource.includes('iOS') || ingestSource.includes('Apple') ? 'iOS' : 'Android'
          }
        })
      });
      if (res.ok) {
        setIngestSuccess(true);
        setIngestText('');
        fetchData(); // Reload issues list and KPIs!
        setTimeout(() => setIngestSuccess(false), 3000);
      }
    } catch (err) {
      console.error('Ingestion failed:', err);
    } finally {
      setIngesting(false);
    }
  };

  // Verify onboarding status on mount
  useEffect(() => {
    const onboarded = localStorage.getItem('echoops_onboarding_completed');
    if (!onboarded) {
      router.push('/onboarding');
    }
  }, [router]);

  // Fetch from FastAPI or load mock data
  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:8000/api/issues');
      if (!res.ok) throw new Error('API server returned error');
      const data = await res.json();
      setIssues(data);
      
      // Calculate dynamic stats
      const criticalCount = data.filter((i: any) => i.priority === 'Critical').length;
      const totalReports = data.reduce((sum: number, i: any) => sum + (i.total_reports || 0), 0);
      const avgH = data.length > 0 ? Math.round(data.reduce((sum: number, i: any) => sum + i.health_score, 0) / data.length) : 100;
      
      setStats({
        processed: totalReports * 3 + 12,
        totalIssues: data.length,
        criticalIssues: criticalCount,
        healthIndex: avgH,
        csat: 78,
        avgRating: 4.1,
        resolvedCount: 8
      });
    } catch (err) {
      console.warn('API error, falling back to mock data:', err);
      // Mock data fallback
      const mockIssues: Issue[] = [
        {
          id: 1,
          title: "Payment Checkout Failure & Crash",
          summary: "Stripe error 500 when checking out on iOS mobile versions.",
          status: "In Progress",
          priority: "Critical",
          health_score: 98.0,
          health_status: "Critical",
          assigned_team: "Payments Engineering",
          total_reports: 58,
          average_rating: 1.2,
          estimated_revenue_risk: 24500,
          created_at: new Date().toISOString()
        },
        {
          id: 2,
          title: "User Authentication & Password Reset Failures",
          summary: "Google OAuth tokens expiring too early.",
          status: "AI Verified",
          priority: "High",
          health_score: 72.0,
          health_status: "Needs Attention",
          assigned_team: "Auth Team",
          total_reports: 38,
          average_rating: 2.1,
          estimated_revenue_risk: 8900,
          created_at: new Date().toISOString()
        },
        {
          id: 3,
          title: "Performance Degradation on Mobile Devices",
          summary: "Sluggish dashboard render times on Android models.",
          status: "New",
          priority: "Medium",
          health_score: 58.0,
          health_status: "Growing Slowly",
          assigned_team: "Platform Engineering",
          total_reports: 30,
          average_rating: 2.8,
          estimated_revenue_risk: 3200,
          created_at: new Date().toISOString()
        }
      ];
      setIssues(mockIssues);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Filter issues based on search query
  useEffect(() => {
    if (!searchQuery) {
      setFilteredIssues(issues);
      return;
    }
    const q = searchQuery.toLowerCase();
    const filtered = issues.filter(issue => 
      issue.title.toLowerCase().includes(q) || 
      issue.summary.toLowerCase().includes(q) || 
      issue.assigned_team.toLowerCase().includes(q) || 
      issue.status.toLowerCase().includes(q)
    );
    setFilteredIssues(filtered);
  }, [searchQuery, issues]);

  // Color mapping based on health status label
  const getHealthBadgeStyle = (status: string) => {
    switch (status) {
      case 'Stable':
        return 'bg-emerald-500/10 border-emerald-500/25 text-emerald-400';
      case 'Growing Slowly':
        return 'bg-yellow-500/10 border-yellow-500/25 text-yellow-400';
      case 'Needs Attention':
        return 'bg-orange-500/10 border-orange-500/25 text-orange-400';
      case 'Critical':
        return 'bg-red-500/10 border-red-500/25 text-red-400 pulse-critical';
      case 'Business Critical':
        return 'bg-purple-500/10 border-purple-500/25 text-purple-400';
      default:
        return 'bg-zinc-500/10 border-zinc-500/25 text-zinc-400';
    }
  };

  const getPriorityStyle = (priority: string) => {
    switch (priority) {
      case 'Critical': return 'text-red-400 font-bold';
      case 'High': return 'text-orange-400 font-semibold';
      case 'Medium': return 'text-yellow-400';
      default: return 'text-zinc-400';
    }
  };

  return (
    <SidebarLayout>
      <div className="space-y-6">
        
        {/* Title Section */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-zinc-100 flex items-center gap-2">
              Feedback Command Center
            </h1>
            <p className="text-sm text-zinc-400 mt-1">
              Live intelligence aggregated across all feedback sources, reviews, and call recordings.
            </p>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => setShowIngestForm(!showIngestForm)}
              className="flex items-center gap-1.5 px-3 py-1.5 border border-indigo-500/20 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 text-xs font-semibold rounded-xl transition duration-200"
            >
              <Sparkles className="w-3.5 h-3.5" /> Ingest Real Feedback
            </button>
            <button 
              onClick={fetchData} 
              className="flex items-center gap-1.5 px-3 py-1.5 border border-zinc-800 bg-zinc-900/60 hover:bg-zinc-855 text-zinc-300 text-xs font-semibold rounded-xl transition duration-200"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Refresh
            </button>
          </div>
        </div>

        {/* Ingestion Console Form */}
        {showIngestForm && (
          <div className="glass-panel p-6 rounded-2xl border border-indigo-500/15 bg-indigo-500/5 animate-fadeIn">
            <h3 className="text-sm font-bold text-indigo-400 flex items-center gap-1.5 font-mono uppercase tracking-wider mb-4">
              <Sparkles className="w-4 h-4" /> Live AI Pipeline Ingestor
            </h3>
            <form onSubmit={handleIngestSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-[10px] text-zinc-400 font-bold uppercase">Customer Complaint Text</label>
                  <textarea
                    required
                    value={ingestText}
                    onChange={(e) => setIngestText(e.target.value)}
                    placeholder="e.g. 'Stripe is throwing error 500 when I try to checkout on my phone, help!' (AI will clean, translate, extract tags, and cluster this)"
                    className="w-full bg-zinc-950/80 border border-zinc-800 rounded-lg p-2 text-xs text-zinc-200 focus:outline-none h-[72px] resize-none"
                  />
                </div>
                <div className="space-y-3">
                  <div className="space-y-1.5">
                    <label className="text-[10px] text-zinc-400 font-bold uppercase">Feedback Source</label>
                    <select
                      value={ingestSource}
                      onChange={(e) => setIngestSource(e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-800 text-xs text-zinc-300 rounded-lg p-2 focus:outline-none"
                    >
                      <option value="Google Play Store">Google Play Store</option>
                      <option value="Apple App Store">Apple App Store</option>
                      <option value="Gmail">Gmail (Email Support)</option>
                      <option value="Trustpilot">Trustpilot Reviews</option>
                    </select>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="space-y-1.5">
                    <label className="text-[10px] text-zinc-400 font-bold uppercase">Customer Rating (1-5)</label>
                    <input
                      type="number"
                      min="1"
                      max="5"
                      required
                      value={ingestRating}
                      onChange={(e) => setIngestRating(Number(e.target.value))}
                      className="w-full bg-zinc-950 border border-zinc-800 text-xs text-zinc-300 rounded-lg p-2 focus:outline-none"
                    />
                  </div>
                </div>
              </div>
              
              <div className="flex justify-between items-center pt-2 border-t border-zinc-850">
                {ingestSuccess ? (
                  <span className="text-xs text-emerald-400 font-medium">✓ Feedback ingested & clustered into dashboard in real-time!</span>
                ) : (
                  <span className="text-[10px] text-zinc-500">Hits the backend FastAPI pipeline, runs Jaccard clustering, and re-computes AI Health Score.</span>
                )}
                <button
                  type="submit"
                  disabled={ingesting}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white rounded-lg text-xs font-semibold transition"
                >
                  {ingesting ? 'Analyzing...' : 'Submit to AI Pipeline'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* KPI Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          
          <div className="glass-panel p-5 rounded-2xl">
            <div className="flex justify-between items-start">
              <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wide">Reviews Processed</span>
              <span className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400"><Inbox className="w-4 h-4" /></span>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-2xl font-bold text-zinc-100">{stats.processed}</span>
              <span className="text-[10px] font-semibold text-emerald-400 flex items-center gap-0.5"><TrendingUp className="w-3 h-3" /> +14%</span>
            </div>
          </div>

          <div className="glass-panel p-5 rounded-2xl">
            <div className="flex justify-between items-start">
              <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wide">Total Issues</span>
              <span className="p-1.5 rounded-lg bg-zinc-800 text-zinc-300 font-bold text-xs">{stats.totalIssues}</span>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-2xl font-bold text-zinc-100">{stats.totalIssues}</span>
              <span className="text-xs text-zinc-500">Clusters</span>
            </div>
          </div>

          <div className="glass-panel p-5 rounded-2xl border-red-500/10">
            <div className="flex justify-between items-start">
              <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wide">Critical Issues</span>
              <span className="p-1.5 rounded-lg bg-red-500/10 text-red-400"><AlertTriangle className="w-4 h-4" /></span>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-2xl font-bold text-red-500">{stats.criticalIssues}</span>
              <span className="text-[10px] font-semibold text-red-400">Needs Hotfix</span>
            </div>
          </div>

          <div className="glass-panel p-5 rounded-2xl">
            <div className="flex justify-between items-start">
              <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wide">AI Health Index</span>
              <span className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400"><Percent className="w-4 h-4" /></span>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-2xl font-bold text-zinc-100">{stats.healthIndex}/100</span>
              <span className="text-[10px] font-semibold text-zinc-500">System Rating</span>
            </div>
          </div>

        </div>

        {/* Second Row of KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="glass-panel p-4 rounded-xl flex items-center justify-between">
            <div>
              <span className="text-xs text-zinc-500 font-semibold uppercase tracking-wider block">Customer Satisfaction</span>
              <span className="text-xl font-bold text-zinc-200 mt-1 block">{stats.csat}%</span>
            </div>
            <div className="w-10 h-10 rounded-full bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center text-emerald-400 font-bold text-sm">CSAT</div>
          </div>
          <div className="glass-panel p-4 rounded-xl flex items-center justify-between">
            <div>
              <span className="text-xs text-zinc-500 font-semibold uppercase tracking-wider block">Average App Rating</span>
              <span className="text-xl font-bold text-zinc-200 mt-1 block flex items-center gap-1.5">
                {stats.avgRating} <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
              </span>
            </div>
            <div className="text-xs text-zinc-400">across stores</div>
          </div>
          <div className="glass-panel p-4 rounded-xl flex items-center justify-between">
            <div>
              <span className="text-xs text-zinc-500 font-semibold uppercase tracking-wider block">Resolved This Week</span>
              <span className="text-xl font-bold text-zinc-200 mt-1 block flex items-center gap-1.5 text-emerald-400">
                {stats.resolvedCount} <CheckCircle className="w-4.5 h-4.5" />
              </span>
            </div>
            <div className="text-xs text-zinc-500 font-medium">engineering output</div>
          </div>
        </div>

        {/* Main Dashboard Section - Top Problems List */}
        <div className="glass-panel rounded-2xl overflow-hidden border border-zinc-800/80">
          <div className="px-6 py-4 border-b border-zinc-800/60 bg-zinc-900/20 flex justify-between items-center">
            <div>
              <h2 className="text-lg font-bold text-zinc-200">Top Problems</h2>
              <p className="text-xs text-zinc-500 mt-0.5">Prioritized by revenue impact, growth speed, and feedback sentiment.</p>
            </div>
            {searchQuery && (
              <span className="text-xs bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-2.5 py-1 rounded-full font-mono">
                Filtering by: "{searchQuery}"
              </span>
            )}
          </div>
          
          {loading ? (
            <div className="p-12 text-center text-zinc-500">
              <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              Loading top complaints...
            </div>
          ) : filteredIssues.length === 0 ? (
            <div className="p-12 text-center text-zinc-500 italic">
              No matching issues found in feedback clusters.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="border-b border-zinc-800 bg-zinc-900/10 text-zinc-400 text-xs font-semibold uppercase tracking-wider">
                    <th className="px-6 py-3.5">Issue Title</th>
                    <th className="px-6 py-3.5 text-center">AI Health Score</th>
                    <th className="px-6 py-3.5 text-center">Reports</th>
                    <th className="px-6 py-3.5 text-center">Trend</th>
                    <th className="px-6 py-3.5">Priority</th>
                    <th className="px-6 py-3.5">Assigned Team</th>
                    <th className="px-6 py-3.5">Status</th>
                    <th className="px-6 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/50">
                  {filteredIssues.map((issue) => (
                    <tr 
                      key={issue.id} 
                      onClick={() => router.push(`/issues/${issue.id}`)}
                      className="hover:bg-zinc-900/30 cursor-pointer group transition duration-200"
                    >
                      <td className="px-6 py-4">
                        <div className="font-semibold text-zinc-200 group-hover:text-indigo-400 transition truncate max-w-[280px]">
                          {issue.title}
                        </div>
                        <div className="text-xs text-zinc-500 truncate max-w-[280px] mt-0.5">
                          {issue.summary}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="inline-flex flex-col items-center">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${getHealthBadgeStyle(issue.health_status)}`}>
                            {issue.health_score}/100
                          </span>
                          <span className="text-[9px] text-zinc-500 font-semibold tracking-wide uppercase mt-1 font-mono">
                            {issue.health_status}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center font-mono font-semibold text-zinc-300">
                        {issue.total_reports}
                      </td>
                      <td className="px-6 py-4 text-center">
                        {issue.health_score > 70 ? (
                          <span className="text-emerald-400 text-xs font-semibold flex items-center justify-center gap-0.5">
                            <TrendingUp className="w-3.5 h-3.5" /> Stable
                          </span>
                        ) : (
                          <span className="text-red-400 text-xs font-semibold flex items-center justify-center gap-0.5">
                            <TrendingDown className="w-3.5 h-3.5" /> Growing
                          </span>
                        )}
                      </td>
                      <td className={`px-6 py-4 text-xs font-bold uppercase tracking-wider ${getPriorityStyle(issue.priority)}`}>
                        {issue.priority}
                      </td>
                      <td className="px-6 py-4 text-zinc-400 font-medium">
                        {issue.assigned_team}
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-0.5 text-[10px] font-bold uppercase rounded-md bg-zinc-800 border border-zinc-700 text-zinc-300">
                          {issue.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button className="text-zinc-500 group-hover:text-indigo-400 hover:scale-105 transition p-1">
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
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
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-12 text-zinc-500">
        <div className="w-8 h-8 border-3 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        Loading EchoOps Dashboard...
      </div>
    }>
      <DashboardContent />
    </Suspense>
  );
}
