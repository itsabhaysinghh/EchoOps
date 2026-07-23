'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import SidebarLayout from '../../components/SidebarLayout';
import { 
  ArrowLeft, 
  Settings, 
  MessageSquare, 
  Play, 
  User, 
  Calendar, 
  Tag, 
  Layers, 
  AlertCircle, 
  CheckCircle,
  HelpCircle,
  ExternalLink,
  Send,
  Sparkles,
  Zap,
  TrendingDown,
  Globe,
  Smartphone,
  GitBranch,
  ShieldCheck,
  DollarSign
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
  const [activeTab, setActiveTab] = useState<'evidence' | 'root_cause' | 'impact' | 'timeline'>('evidence');
  
  // AI Chat & Comments state
  const [commentText, setCommentText] = useState('');
  const [chatText, setChatText] = useState('');
  const [chatHistory, setChatHistory] = useState([
    { role: 'assistant', text: "I'm the EchoOps AI assistant. Ask me anything about this bug, such as affected devices or related releases." }
  ]);
  const [alert, setAlert] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  // AI Recommendation State
  const [recommendation, setRecommendation] = useState({
    team: 'Payments Engineering',
    priority: 'Critical',
    effort: '2 Sprints',
    sprint: 'Sprint 14',
    fix_time: '24 hours',
    reason: 'Checkout crashes directly block purchases.'
  });

  // Assign form state
  const [assignTeam, setAssignTeam] = useState('');
  const [assignEmployee, setAssignEmployee] = useState('');

  // Fetch issue details
  const fetchIssueDetails = async () => {
    try {
      const res = await fetch(`http://localhost:8000/api/issues/${issueId}`);
      if (!res.ok) throw new Error('Failed to load issue');
      const data = await res.json();
      setIssue(data);
      setAssignTeam(data.assigned_team || '');
      setAssignEmployee(data.assigned_to_name || '');
      
      // Fetch AI recommendation
      const recRes = await fetch(`http://localhost:8000/api/issues/${issueId}/recommendation`);
      if (recRes.ok) {
        const recData = await recRes.json();
        setRecommendation(recData);
      }
    } catch (err) {
      console.warn('API details failed, falling back to mock details.');
      // Mock Details fallback
      setIssue({
        id: Number(issueId),
        title: "Payment Checkout Failure & Crash",
        summary: "Customers are encountering 'Error 500' when checking out with Apple Pay and Stripe on mobile devices. This is causing significant revenue loss.",
        status: "In Progress",
        priority: "Critical",
        health_score: 98.0,
        health_status: "Critical",
        assigned_team: "Payments Engineering",
        assigned_to_name: "Rahul Sharma",
        assigned_to_email: "pm@acme.io",
        root_cause: "Stripe integration timeout due to incorrect API headers.",
        confidence: 92.0,
        release_correlation: "v1.2.0",
        affected_devices: {"iPhone 15": 28, "Samsung S24": 12, "Pixel 8": 6},
        affected_countries: {"United States": 35, "Canada": 7, "United Kingdom": 4},
        affected_versions: {"v1.2.0": 40, "v1.1.9": 6},
        platform_distribution: {"iOS": 28, "Android": 18},
        estimated_revenue_risk: 24500.0,
        estimated_churn_risk: 0.35,
        affected_users: 46,
        average_rating: 1.2,
        created_at: new Date().toISOString(),
        feedbacks: [
          {
            id: 1,
            source: "Apple App Store",
            original_text: "The checkout process keeps crashing when I choose Apple Pay. This is unacceptable, I was trying to purchase a subscription!",
            sentiment: "Negative",
            emotion: "Anger",
            created_at: new Date().toISOString(),
            meta_info: { device: "iPhone 15", rating: 1, email: "customer1@gmail.com" }
          },
          {
            id: 2,
            source: "Google Play Store",
            original_text: "Every time I try to complete the payment for my order, the app throws an Error 500. Please fix immediately, I am losing sales!",
            sentiment: "Negative",
            emotion: "Frustration",
            created_at: new Date().toISOString(),
            meta_info: { device: "Samsung S24", rating: 1, email: "sales@user.com" }
          }
        ],
        comments: [
          {
            id: 1,
            author_name: "Sarah Connor",
            author_role: "Super Admin",
            content: "This is causing our daily revenue capture to drop. Payments team, please look at the Stripe error log immediately.",
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

  // Handle Jira, Github etc Ticket creation
  const createIntegrationTicket = async (tool: string) => {
    setAlert(null);
    try {
      const res = await fetch(`http://localhost:8000/api/integrations/${tool.toLowerCase()}/${issueId}`, {
        method: 'POST'
      });
      const data = await res.json();
      if (res.ok) {
        setAlert({ type: 'success', text: `Created ticket successfully! Link: ${data.url || '#'}` });
        fetchIssueDetails(); // Refresh status to "In Progress"
      } else {
        throw new Error(data.detail || 'Integration failed');
      }
    } catch (err) {
      console.warn('API Integration failed, simulating success locally.');
      setAlert({ 
        type: 'success', 
        text: `Simulated ticket created for ${tool}! (Key: ${tool.toUpperCase()}-${issueId}) Link: https://${tool.toLowerCase()}.com/acme/ops/${issueId}` 
      });
      // Simulate status change
      if (issue) {
        setIssue({ ...issue, status: 'In Progress' });
      }
    }
  };

  const handlePostComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim() || !issue) return;
    
    try {
      const res = await fetch(`http://localhost:8000/api/issues/${issueId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: commentText,
          author_name: 'Rahul Sharma',
          author_role: 'Product Manager'
        })
      });
      if (res.ok) {
        const newComment = await res.json();
        setIssue({ ...issue, comments: [...issue.comments, newComment] });
        setCommentText('');
      } else {
        throw new Error('Failed to post comment');
      }
    } catch (err) {
      // Offline fallback
      const fallbackComment: CommentItem = {
        id: Date.now(),
        author_name: 'Rahul Sharma',
        author_role: 'Product Manager',
        content: commentText,
        created_at: new Date().toISOString()
      };
      setIssue({ ...issue, comments: [...issue.comments, fallbackComment] });
      setCommentText('');
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatText.trim() || !issue) return;
    
    const userMsg = chatText;
    setChatHistory(prev => [...prev, { role: 'user', text: userMsg }]);
    setChatText('');
    
    // Simulate AI response customized to the issue
    setTimeout(() => {
      let aiText = "I parsed the feedback database. ";
      const textL = userMsg.toLowerCase();
      
      if (textL.includes('device') || textL.includes('phone') || textL.includes('mobile')) {
        const devices = Object.entries(issue.affected_devices || {}).map(([k, v]) => `${k} (${v} reports)`).join(', ');
        aiText += `The most affected device is iPhone 15. The full device distribution is: ${devices}.`;
      } else if (textL.includes('country') || textL.includes('location') || textL.includes('world')) {
        const countries = Object.entries(issue.affected_countries || {}).map(([k, v]) => `${k} (${v} reports)`).join(', ');
        aiText += `Most reports originate from the United States. Country breakdown: ${countries}.`;
      } else if (textL.includes('release') || textL.includes('version')) {
        aiText += `The complaints started peaking after version ${issue.release_correlation || 'v1.2.0'} was released. Pre-existing versions like v1.1.9 have minimal reports.`;
      } else if (textL.includes('revenue') || textL.includes('money') || textL.includes('impact')) {
        aiText += `We estimate $${issue.estimated_revenue_risk.toLocaleString()} at risk due to billing checkout lockups. Customers cannot pay for renewal invoices.`;
      } else {
        aiText += `This checkout crash is occurring inside the Apple Pay SDK container. Stripe fails with a bad request payload header. I recommend checking Stripe SDK logs.`;
      }
      
      setChatHistory(prev => [...prev, { role: 'assistant', text: aiText }]);
    }, 500);
  };

  const handleAssignSubmit = async () => {
    if (!issue) return;
    try {
      const res = await fetch(`http://localhost:8000/api/issues/${issueId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          assigned_team: assignTeam,
          assigned_to_name: assignEmployee,
          status: 'Assigned'
        })
      });
      if (res.ok) {
        const updated = await res.json();
        setIssue(prev => prev ? { ...prev, ...updated } : null);
        setAlert({ type: 'success', text: `Successfully updated assignment: ${assignEmployee} (${assignTeam})` });
      }
    } catch (err) {
      setIssue({
        ...issue,
        assigned_team: assignTeam,
        assigned_to_name: assignEmployee,
        status: 'Assigned'
      });
      setAlert({ type: 'success', text: `Locally simulated assignment to ${assignEmployee} (${assignTeam}).` });
    }
  };

  if (loading) {
    return (
      <SidebarLayout>
        <div className="p-12 text-center text-zinc-500">
          <div className="w-8 h-8 border-3 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          Analyzing issue evidence...
        </div>
      </SidebarLayout>
    );
  }

  if (!issue) {
    return (
      <SidebarLayout>
        <div className="p-12 text-center text-zinc-400">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <span>Issue not found.</span>
        </div>
      </SidebarLayout>
    );
  }

  // Format Recharts data
  const deviceData = Object.entries(issue.affected_devices || {}).map(([name, value]) => ({ name, value }));
  const countryData = Object.entries(issue.affected_countries || {}).map(([name, value]) => ({ name, value }));
  const versionData = Object.entries(issue.affected_versions || {}).map(([name, value]) => ({ name, value }));

  const COLORS = ['#6366f1', '#a855f7', '#ec4899', '#f43f5e', '#3b82f6'];

  return (
    <SidebarLayout>
      <div className="space-y-6 max-w-7xl mx-auto">
        
        {/* Breadcrumb Header */}
        <div className="flex items-center gap-3">
          <button 
            onClick={() => router.push('/')}
            className="w-9 h-9 rounded-xl border border-zinc-800 bg-zinc-900/60 hover:bg-zinc-850 flex items-center justify-center transition"
          >
            <ArrowLeft className="w-4 h-4 text-zinc-300" />
          </button>
          <div>
            <span className="text-xs text-zinc-500 font-mono tracking-wider font-bold uppercase">Back to Command Center</span>
            <h1 className="text-xl font-bold text-zinc-200 mt-0.5 truncate max-w-[500px]">
              {issue.title}
            </h1>
          </div>
        </div>

        {/* Success / Error Alerts */}
        {alert && (
          <div className={`p-4 rounded-xl border flex items-center justify-between text-sm ${
            alert.type === 'success' 
              ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
              : 'bg-red-500/10 border-red-500/20 text-red-400'
          }`}>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 shrink-0" />
              <span>{alert.text}</span>
            </div>
            <button onClick={() => setAlert(null)} className="text-zinc-500 hover:text-zinc-300 text-xs">Dismiss</button>
          </div>
        )}

        {/* Metadata Top Bar Grid */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
          <div className="glass-panel p-4 rounded-xl">
            <span className="text-[10px] uppercase font-bold text-zinc-500 font-mono">Status</span>
            <span className="text-sm font-semibold text-zinc-200 block mt-1 uppercase">{issue.status}</span>
          </div>
          <div className="glass-panel p-4 rounded-xl">
            <span className="text-[10px] uppercase font-bold text-zinc-500 font-mono">Priority</span>
            <span className="text-sm font-bold text-red-400 block mt-1 uppercase">{issue.priority}</span>
          </div>
          <div className="glass-panel p-4 rounded-xl">
            <span className="text-[10px] uppercase font-bold text-zinc-500 font-mono">AI Health</span>
            <span className="text-sm font-extrabold text-indigo-400 block mt-1">{issue.health_score}/100</span>
          </div>
          <div className="glass-panel p-4 rounded-xl">
            <span className="text-[10px] uppercase font-bold text-zinc-500 font-mono">Assigned Team</span>
            <span className="text-sm font-semibold text-zinc-300 block mt-1 truncate">{issue.assigned_team}</span>
          </div>
          <div className="glass-panel p-4 rounded-xl">
            <span className="text-[10px] uppercase font-bold text-zinc-500 font-mono">Assignee</span>
            <span className="text-sm font-semibold text-zinc-300 block mt-1 truncate">{issue.assigned_to_name || 'Unassigned'}</span>
          </div>
          <div className="glass-panel p-4 rounded-xl">
            <span className="text-[10px] uppercase font-bold text-zinc-500 font-mono">Affected Users</span>
            <span className="text-sm font-semibold text-zinc-300 block mt-1">{issue.affected_users}</span>
          </div>
        </div>

        {/* 2 Column Layout - Main Sections & Sidebar Widgets */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Column: Details & Tabs */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* AI Summary Block */}
            <div className="p-6 rounded-2xl bg-indigo-600/5 border border-indigo-500/15 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 rounded-full blur-xl pointer-events-none" />
              <h2 className="text-sm font-bold text-indigo-400 flex items-center gap-1.5 font-mono uppercase tracking-wide">
                <Sparkles className="w-4 h-4" /> AI Summary & Diagnosis
              </h2>
              <p className="text-sm text-zinc-300 mt-3 leading-relaxed">
                {issue.summary}
              </p>
              <div className="flex gap-4 mt-4 pt-3 border-t border-zinc-800/40 text-xs text-zinc-500">
                <span>Release Correlation: <strong>{issue.release_correlation}</strong></span>
                <span>•</span>
                <span>Diagnosis Confidence: <strong>{issue.confidence}%</strong></span>
              </div>
            </div>

            {/* Content Tabs */}
            <div className="glass-panel rounded-2xl overflow-hidden border border-zinc-800/80">
              <div className="flex border-b border-zinc-800 bg-zinc-900/10">
                {(['evidence', 'root_cause', 'impact', 'timeline'] as const).map((tab) => (
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

              {/* Tab Content Display */}
              <div className="p-6">
                
                {/* 1. Evidence List */}
                {activeTab === 'evidence' && (
                  <div className="space-y-4">
                    <h3 className="text-sm font-bold text-zinc-300 uppercase tracking-wide font-mono">Grouped Customer Evidence ({issue.feedbacks.length})</h3>
                    {issue.feedbacks.map((fb) => (
                      <div key={fb.id} className="p-4 rounded-xl bg-zinc-950/40 border border-zinc-850 space-y-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="text-xs bg-zinc-900 px-2 py-0.5 rounded text-zinc-400 border border-zinc-800 font-medium">
                              {fb.source}
                            </span>
                            <span className="text-[10px] text-zinc-500 ml-2 font-mono">
                              {fb.meta_info?.device || 'Web'} • Rating: {fb.meta_info?.rating || 5}★
                            </span>
                          </div>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                            fb.sentiment === 'Negative' ? 'bg-red-500/10 text-red-400' : 'bg-zinc-800 text-zinc-400'
                          }`}>
                            {fb.emotion || fb.sentiment}
                          </span>
                        </div>
                        <p className="text-xs text-zinc-300 italic">
                          "{fb.original_text}"
                        </p>
                      </div>
                    ))}
                  </div>
                )}

                {/* 2. Root Cause & Analytics */}
                {activeTab === 'root_cause' && (
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wide font-mono">Identified Root Cause</h4>
                      <p className="text-sm text-zinc-300 mt-2 p-3 bg-zinc-950/30 border border-zinc-850 rounded-xl leading-relaxed">
                        {issue.root_cause || 'AI is currently collecting reports to finalize root cause details.'}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      
                      {/* Device Distribution chart */}
                      <div className="space-y-2">
                        <span className="text-xs text-zinc-500 font-semibold uppercase flex items-center gap-1.5">
                          <Smartphone className="w-3.5 h-3.5 text-indigo-400" /> Device Distribution
                        </span>
                        <div className="h-48">
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={deviceData}>
                              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                              <XAxis dataKey="name" stroke="#71717a" fontSize={10} />
                              <YAxis stroke="#71717a" fontSize={10} />
                              <Tooltip contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a' }} />
                              <Bar dataKey="value" fill="#6366f1" radius={[4, 4, 0, 0]} />
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      </div>

                      {/* Country Distribution chart */}
                      <div className="space-y-2">
                        <span className="text-xs text-zinc-500 font-semibold uppercase flex items-center gap-1.5">
                          <Globe className="w-3.5 h-3.5 text-indigo-400" /> Country Distribution
                        </span>
                        <div className="h-48">
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie
                                data={countryData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                outerRadius={60}
                                fill="#8884d8"
                                dataKey="value"
                                label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                              >
                                {countryData.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                              </Pie>
                              <Tooltip contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a' }} />
                            </PieChart>
                          </ResponsiveContainer>
                        </div>
                      </div>

                    </div>
                  </div>
                )}

                {/* 3. Business Impact */}
                {activeTab === 'impact' && (
                  <div className="space-y-6">
                    <h3 className="text-sm font-bold text-zinc-300 uppercase tracking-wide font-mono">Financial Risk Assessment</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      
                      <div className="p-4 rounded-xl bg-zinc-950/40 border border-zinc-850 flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-red-500/10 text-red-400 flex items-center justify-center font-bold text-lg">
                          <DollarSign className="w-5 h-5" />
                        </div>
                        <div>
                          <span className="text-[10px] text-zinc-500 uppercase font-bold tracking-wide">ARR at Risk</span>
                          <span className="text-lg font-bold text-zinc-200 block mt-0.5">
                            ${issue.estimated_revenue_risk.toLocaleString()}
                          </span>
                        </div>
                      </div>

                      <div className="p-4 rounded-xl bg-zinc-950/40 border border-zinc-850 flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-orange-500/10 text-orange-400 flex items-center justify-center font-bold text-lg">
                          <TrendingDown className="w-5 h-5" />
                        </div>
                        <div>
                          <span className="text-[10px] text-zinc-500 uppercase font-bold tracking-wide">Churn Risk</span>
                          <span className="text-lg font-bold text-zinc-200 block mt-0.5">
                            {(issue.estimated_churn_risk * 100).toFixed(0)}%
                          </span>
                        </div>
                      </div>

                      <div className="p-4 rounded-xl bg-zinc-950/40 border border-zinc-850 flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-zinc-800 text-zinc-400 flex items-center justify-center font-bold text-sm">
                          CSAT
                        </div>
                        <div>
                          <span className="text-[10px] text-zinc-500 uppercase font-bold tracking-wide">Rating Delta</span>
                          <span className="text-lg font-bold text-red-400 block mt-0.5">
                            -2.8★ average
                          </span>
                        </div>
                      </div>

                    </div>
                    
                    <p className="text-xs text-zinc-500 leading-relaxed bg-zinc-950/20 p-3 rounded-lg border border-zinc-850/60">
                      <strong>AI Forecast:</strong> If left unresolved, this issue is predicted to trigger a 3% churn increase inside the 'Mobile App' subscription tier over the next 14 days, primarily affecting United States customers.
                    </p>
                  </div>
                )}

                {/* 4. Timeline & Discussion Comments */}
                {activeTab === 'timeline' && (
                  <div className="space-y-6">
                    
                    {/* Visual Stepper Timeline */}
                    <div className="space-y-4">
                      <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wide font-mono">Resolution Pipeline Progress</h4>
                      <div className="flex justify-between items-center bg-zinc-950/30 p-4 rounded-xl border border-zinc-850">
                        {['Detection', 'Assignment', 'Fix', 'Verification', 'Closed'].map((stepName, idx) => {
                          const steps = ['New', 'Assigned', 'In Progress', 'QA', 'Closed'];
                          const currentIdx = steps.indexOf(issue.status);
                          const isDone = currentIdx >= idx;
                          return (
                            <div key={stepName} className="flex flex-col items-center gap-1">
                              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${
                                isDone ? 'bg-indigo-600 text-white' : 'border border-zinc-850 text-zinc-500'
                              }`}>
                                {isDone ? '✓' : idx + 1}
                              </div>
                              <span className="text-[10px] font-semibold text-zinc-400">{stepName}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Discussion Comments Thread */}
                    <div className="space-y-4 pt-4 border-t border-zinc-850">
                      <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wide font-mono">Discussion Logs</h4>
                      <div className="space-y-3 max-h-48 overflow-y-auto pr-2">
                        {issue.comments.length === 0 ? (
                          <p className="text-xs text-zinc-500 italic">No internal comments logged yet.</p>
                        ) : (
                          issue.comments.map((comm) => (
                            <div key={comm.id} className="p-3 bg-zinc-950/40 rounded-xl border border-zinc-850 flex gap-3">
                              <div className="w-8 h-8 rounded-full bg-zinc-900 flex items-center justify-center border border-zinc-850">
                                <User className="w-3.5 h-3.5 text-zinc-400" />
                              </div>
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="text-xs font-bold text-zinc-200">{comm.author_name}</span>
                                  <span className="text-[9px] uppercase font-bold text-zinc-500 font-mono tracking-wider">{comm.author_role}</span>
                                  <span className="text-[9px] text-zinc-600">{new Date(comm.created_at).toLocaleTimeString()}</span>
                                </div>
                                <p className="text-xs text-zinc-400 mt-1 leading-relaxed">{comm.content}</p>
                              </div>
                            </div>
                          ))
                        )}
                      </div>

                      {/* Add comment form */}
                      <form onSubmit={handlePostComment} className="flex gap-2">
                        <input
                          type="text"
                          value={commentText}
                          onChange={(e) => setCommentText(e.target.value)}
                          className="flex-1 bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2 text-xs focus:outline-none focus:border-indigo-500 text-zinc-200"
                          placeholder="Log an internal comment... (e.g. 'Deploying hotfix')"
                        />
                        <button type="submit" className="px-4 py-2 bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 text-zinc-300 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition">
                          Post <Send className="w-3.5 h-3.5" />
                        </button>
                      </form>
                    </div>

                  </div>
                )}

              </div>
            </div>

          </div>

          {/* Right Column: Widgets */}
          <div className="space-y-6">
            
            {/* AI Recommendation & Assignment */}
            <div className="glass-panel p-5 rounded-2xl border-indigo-500/10">
              <h3 className="text-sm font-bold text-indigo-400 flex items-center gap-1.5 font-mono uppercase tracking-wider mb-4">
                <Sparkles className="w-4 h-4" /> AI Recommendation
              </h3>
              
              <div className="space-y-3.5 bg-zinc-950/40 p-4 rounded-xl border border-zinc-850">
                <div className="flex justify-between items-center border-b border-zinc-800/40 pb-2">
                  <span className="text-[10px] text-zinc-500 uppercase font-bold font-mono">Suggested Team</span>
                  <span className="text-xs font-semibold text-indigo-400">{recommendation.team}</span>
                </div>
                <div className="flex justify-between items-center border-b border-zinc-800/40 pb-2">
                  <span className="text-[10px] text-zinc-500 uppercase font-bold font-mono">Priority</span>
                  <span className="text-xs font-bold text-red-400">{recommendation.priority}</span>
                </div>
                <div className="flex justify-between items-center border-b border-zinc-800/40 pb-2">
                  <span className="text-[10px] text-zinc-500 uppercase font-bold font-mono">Effort Rating</span>
                  <span className="text-xs font-semibold text-zinc-300">{recommendation.effort}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[10px] text-zinc-500 uppercase font-bold font-mono">Fix Estimate</span>
                  <span className="text-xs font-semibold text-zinc-300">{recommendation.fix_time}</span>
                </div>
              </div>

              <div className="text-xs text-zinc-400 leading-relaxed italic bg-indigo-500/5 p-3 rounded-lg border border-indigo-500/10 mt-3">
                "<strong>Reason:</strong> {recommendation.reason}"
              </div>

              {/* Action: Quick Assign */}
              <div className="mt-4 pt-4 border-t border-zinc-800/50 space-y-3">
                <div className="space-y-1.5">
                  <label className="text-[10px] text-zinc-500 uppercase font-bold font-mono">Assign Team</label>
                  <select
                    value={assignTeam}
                    onChange={(e) => setAssignTeam(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 text-xs text-zinc-300 rounded-lg p-2 focus:outline-none focus:border-indigo-500"
                  >
                    <option value="Engineering">Engineering</option>
                    <option value="Support">Support</option>
                    <option value="Payments Engineering">Payments Engineering</option>
                    <option value="Auth Team">Auth Team</option>
                    <option value="Platform Engineering">Platform Engineering</option>
                    <option value="Product">Product</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] text-zinc-500 uppercase font-bold font-mono">Assign Employee</label>
                  <select
                    value={assignEmployee}
                    onChange={(e) => setAssignEmployee(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 text-xs text-zinc-300 rounded-lg p-2 focus:outline-none focus:border-indigo-500"
                  >
                    <option value="Rahul Sharma">Rahul Sharma (Product Manager)</option>
                    <option value="Kyle Reese">Kyle Reese (Developer)</option>
                    <option value="Marcus Wright">Marcus Wright (Engineering Manager)</option>
                    <option value="Dani Ramos">Dani Ramos (Support Lead)</option>
                  </select>
                </div>

                <button 
                  onClick={handleAssignSubmit}
                  className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg shadow transition"
                >
                  Assign Ticket
                </button>
              </div>

            </div>

            {/* Engineering Integration Panel */}
            <div className="glass-panel p-5 rounded-2xl">
              <h3 className="text-sm font-bold text-zinc-300 uppercase tracking-wide font-mono mb-4">Engineering Integrations</h3>
              <div className="grid grid-cols-2 gap-2">
                <button 
                  onClick={() => createIntegrationTicket('Jira')}
                  className="p-3 bg-zinc-950/40 border border-zinc-800 hover:border-zinc-700/85 rounded-xl text-left flex flex-col justify-between h-20 transition"
                >
                  <span className="text-xs font-bold text-zinc-300">Jira Ticket</span>
                  <span className="text-[9px] text-indigo-400 font-bold uppercase tracking-wider font-mono">Push Card</span>
                </button>
                <button 
                  onClick={() => createIntegrationTicket('GitHub')}
                  className="p-3 bg-zinc-950/40 border border-zinc-800 hover:border-zinc-700/85 rounded-xl text-left flex flex-col justify-between h-20 transition"
                >
                  <span className="text-xs font-bold text-zinc-300">GitHub Issue</span>
                  <span className="text-[9px] text-indigo-400 font-bold uppercase tracking-wider font-mono">Open Bug</span>
                </button>
                <button 
                  onClick={() => createIntegrationTicket('Linear')}
                  className="p-3 bg-zinc-950/40 border border-zinc-800 hover:border-zinc-700/85 rounded-xl text-left flex flex-col justify-between h-20 transition"
                >
                  <span className="text-xs font-bold text-zinc-300">Linear Issue</span>
                  <span className="text-[9px] text-indigo-400 font-bold uppercase tracking-wider font-mono">File Card</span>
                </button>
                <button 
                  onClick={() => createIntegrationTicket('Trello')}
                  className="p-3 bg-zinc-950/40 border border-zinc-800 hover:border-zinc-700/85 rounded-xl text-left flex flex-col justify-between h-20 transition"
                >
                  <span className="text-xs font-bold text-zinc-300">Trello Card</span>
                  <span className="text-[9px] text-indigo-400 font-bold uppercase tracking-wider font-mono">Create Card</span>
                </button>
              </div>
            </div>

            {/* Sidebar AI Chat */}
            <div className="glass-panel rounded-2xl flex flex-col h-[320px] overflow-hidden border border-zinc-800">
              <div className="px-4 py-3 bg-zinc-900/40 border-b border-zinc-800 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                <span className="text-xs font-bold text-zinc-300 font-mono uppercase tracking-wider">AI Issue Assistant</span>
              </div>
              
              {/* Message log */}
              <div className="flex-1 p-4 overflow-y-auto space-y-3">
                {chatHistory.map((ch, idx) => (
                  <div key={idx} className={`p-2.5 rounded-xl text-xs max-w-[85%] ${
                    ch.role === 'user' 
                      ? 'bg-indigo-600/10 border border-indigo-500/20 text-indigo-200 ml-auto' 
                      : 'bg-zinc-950/50 border border-zinc-900 text-zinc-400 mr-auto'
                  }`}>
                    {ch.text}
                  </div>
                ))}
              </div>

              {/* Chat Input */}
              <form onSubmit={handleSendMessage} className="p-3 border-t border-zinc-800 flex gap-1.5 bg-zinc-950/30">
                <input
                  type="text"
                  value={chatText}
                  onChange={(e) => setChatText(e.target.value)}
                  className="flex-1 bg-zinc-950 border border-zinc-800 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:border-indigo-500 text-zinc-200"
                  placeholder="Ask a question about this bug..."
                />
                <button type="submit" className="p-1.5 bg-indigo-600 text-white rounded-lg flex items-center justify-center transition">
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>

          </div>

        </div>

      </div>
    </SidebarLayout>
  );
}
