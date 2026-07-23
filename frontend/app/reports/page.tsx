'use client';

import React, { useState, useEffect } from 'react';
import SidebarLayout from '../components/SidebarLayout';
import { 
  FileText, 
  Download, 
  Sparkles, 
  TrendingUp, 
  DollarSign, 
  AlertTriangle, 
  CheckCircle, 
  Mail, 
  Clock, 
  Award,
  ChevronRight,
  TrendingDown
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  Tooltip,
  Legend
} from 'recharts';

interface ReportDetails {
  generated_at: string;
  sections: {
    executive_summary: string;
    top_issues: any[];
    resolved_issues: any[];
    new_issues: any[];
    customer_sentiment: any;
    feature_requests: any[];
    revenue_impact: any;
    engineering_performance: any;
    recommendations: string[];
  };
}

export default function WeeklyReports() {
  const [loading, setLoading] = useState(true);
  const [report, setReport] = useState<ReportDetails | null>(null);

  const fetchReport = async () => {
    try {
      const res = await fetch('http://localhost:8000/api/reports/weekly');
      if (!res.ok) throw new Error('Failed to load report');
      const data = await res.json();
      setReport(data);
    } catch (err) {
      console.warn('API report failed, falling back to mock report.');
      // Mock Report Fallback
      setReport({
        generated_at: new Date().toISOString(),
        sections: {
          executive_summary: "Weekly operations summary: EchoOps analyzed new user feedback. Total issues remained steady. A critical payment crash in release v1.2.0 was flagged and routed to Payments Engineering, who is actively debugging. General customer satisfaction is slightly down to 78% due to the checkout bug.",
          top_issues: [
            { title: "Payment Checkout Failure & Crash", priority: "Critical", status: "In Progress", health_score: 98.0, reports: 58, revenue_risk: 24500.0 },
            { title: "User Authentication Lockouts", priority: "High", status: "AI Verified", health_score: 72.0, reports: 38, revenue_risk: 8900.0 },
            { title: "Performance Degradation on Mobile Devices", priority: "Medium", status: "New", health_score: 58.0, reports: 30, revenue_risk: 3200.0 }
          ],
          resolved_issues: [
            { title: "Incorrect currency symbol on invoices", resolved_date: "2026-07-19", team: "Payments Engineering" },
            { title: "Broken footer link on landing page", resolved_date: "2026-07-17", team: "UI/UX Product Team" }
          ],
          new_issues: [
            { title: "Password reset link times out", priority: "High", reports: 8 }
          ],
          customer_sentiment: { Positive: 25.0, Neutral: 35.0, Negative: 40.0 },
          feature_requests: [
            { title: "Dark Mode Support", requests: 1284, status: "Planned" },
            { title: "Offline Mode", requests: 813, status: "Proposed" },
            { title: "Apple Pay Support for Web Checkout", requests: 501, status: "In Development" }
          ],
          revenue_impact: {
            total_risk: 36600.0,
            churn_risk_average: "18.3%",
            description: "Currently, checkout failures place approximately $36,600.00 of billing ARR at immediate risk."
          },
          engineering_performance: {
            average_resolution_time: "14.2 hours",
            tickets_resolved_this_week: 2,
            verification_pass_rate: "88%"
          },
          recommendations: [
            "Deploy the Stripe API deprecation hotfix immediately to resolve checkout crashes.",
            "Increase SMTP rate thresholds on SendGrid to clear password reset delays.",
            "Review Android DB sync scripts to reduce mobile dashboard loads."
          ]
        }
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
  }, []);

  const handlePrint = () => {
    window.print();
  };

  if (loading || !report) {
    return (
      <SidebarLayout>
        <div className="p-12 text-center text-zinc-500">
          <div className="w-8 h-8 border-3 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          Compiling weekly executive insights...
        </div>
      </SidebarLayout>
    );
  }

  // Format sentiment data for chart
  const sentimentData = [
    { name: 'Positive', value: report.sections.customer_sentiment.Positive, color: '#10b981' },
    { name: 'Neutral', value: report.sections.customer_sentiment.Neutral, color: '#71717a' },
    { name: 'Negative', value: report.sections.customer_sentiment.Negative, color: '#ef4444' }
  ];

  return (
    <SidebarLayout>
      <div className="space-y-6 max-w-6xl mx-auto">
        
        {/* Title */}
        <div className="flex justify-between items-center print:hidden">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-zinc-100 flex items-center gap-2">
              Weekly Reports
            </h1>
            <p className="text-sm text-zinc-400 mt-1">
              Executive PDF report automatically generated and emailed to leadership every Monday at 9:00 AM.
            </p>
          </div>
          <button 
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-indigo-600/20 hover-glow transition"
          >
            <Download className="w-4 h-4" /> Export Executive PDF
          </button>
        </div>

        {/* PRINT LAYOUT OUTER CONTAINER */}
        <div className="glass-panel rounded-2xl p-8 border border-zinc-800/80 space-y-8 bg-zinc-900/10 print:bg-white print:text-zinc-900 print:border-none print:shadow-none print:p-0">
          
          {/* Document Header */}
          <div className="flex justify-between items-start border-b border-zinc-800 pb-6 print:border-zinc-300">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-indigo-400 font-mono font-bold block print:text-indigo-600">Executive Report</span>
              <h2 className="text-xl font-extrabold text-zinc-200 mt-1 print:text-zinc-850">EchoOps Feedback Summary</h2>
              <span className="text-xs text-zinc-500 mt-1 block">Week Ending: {new Date(report.generated_at).toLocaleDateString()}</span>
            </div>
            <div className="text-right">
              <span className="text-sm font-bold text-zinc-300 print:text-zinc-800">Acme SaaS Inc.</span>
              <span className="text-[10px] text-zinc-500 block">Workspace: Acme Feedback Desk</span>
            </div>
          </div>

          {/* Section 1: Executive Summary */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest font-mono flex items-center gap-1.5 print:text-zinc-600">
              <Sparkles className="w-4 h-4 text-indigo-400 shrink-0 print:text-indigo-600" /> I. Executive Summary
            </h3>
            <p className="text-xs text-zinc-300 leading-relaxed bg-zinc-950/35 p-4 rounded-xl border border-zinc-850 print:bg-zinc-50 print:border-zinc-200 print:text-zinc-800">
              {report.sections.executive_summary}
            </p>
          </div>

          {/* Stepper Grid: Top Issues, Sentiment, Revenue Risk */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left 2 Columns: Top Issues & Performance */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Top Issues list */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest font-mono flex items-center gap-1.5 print:text-zinc-600">
                  <AlertTriangle className="w-4 h-4 text-zinc-500 print:text-zinc-700" /> II. Top Feedback Problems
                </h3>
                <div className="overflow-hidden border border-zinc-850 rounded-xl divide-y divide-zinc-850 print:border-zinc-200 print:divide-zinc-200">
                  {report.sections.top_issues.map((issue, idx) => (
                    <div key={idx} className="p-3 bg-zinc-950/20 flex justify-between items-center text-xs">
                      <div>
                        <span className="font-bold text-zinc-300 print:text-zinc-850 block">{issue.title}</span>
                        <span className="text-[10px] text-zinc-500 mt-1 block">Reports: {issue.reports} • Risk: ${issue.revenue_risk.toLocaleString()}</span>
                      </div>
                      <span className={`px-2 py-0.5 rounded text-[9px] font-bold border ${
                        issue.priority === 'Critical' ? 'bg-red-500/10 border-red-500/20 text-red-400' : 'bg-zinc-900 border-zinc-800 text-zinc-400'
                      }`}>
                        {issue.priority}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Resolved & New Issues list */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <span className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider font-mono block">Resolved Issues</span>
                  <div className="space-y-2">
                    {report.sections.resolved_issues.map((iss, i) => (
                      <div key={i} className="p-2.5 rounded-lg bg-zinc-950/20 border border-zinc-850 flex justify-between items-center text-[10px] print:border-zinc-200">
                        <span className="font-semibold text-zinc-300 truncate max-w-[150px] print:text-zinc-800">{iss.title}</span>
                        <span className="text-[9px] text-emerald-400 font-bold uppercase">{iss.team}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <span className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider font-mono block">New Issues</span>
                  <div className="space-y-2">
                    {report.sections.new_issues.map((iss, i) => (
                      <div key={i} className="p-2.5 rounded-lg bg-zinc-950/20 border border-zinc-850 flex justify-between items-center text-[10px] print:border-zinc-200">
                        <span className="font-semibold text-zinc-300 truncate max-w-[150px] print:text-zinc-800">{iss.title}</span>
                        <span className="text-[9px] text-red-400 font-bold uppercase">{iss.priority}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

            </div>

            {/* Right 1 Column: Sentiment Chart & Financial risks */}
            <div className="space-y-6">
              
              {/* Sentiment chart */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest font-mono flex items-center gap-1.5 print:text-zinc-600">
                  Customer Sentiment Ratio
                </h3>
                <div className="h-44 flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={sentimentData}
                        cx="50%"
                        cy="50%"
                        innerRadius={45}
                        outerRadius={55}
                        paddingAngle={3}
                        dataKey="value"
                      >
                        {sentimentData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a' }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                {/* Sentiment Legend */}
                <div className="flex justify-center gap-4 text-[10px] text-zinc-500 font-semibold font-mono">
                  <span className="flex items-center gap-1.5 text-emerald-400"><span className="w-2 h-2 rounded-full bg-emerald-500" /> Positive ({report.sections.customer_sentiment.Positive}%)</span>
                  <span className="flex items-center gap-1.5 text-red-400"><span className="w-2 h-2 rounded-full bg-red-500" /> Negative ({report.sections.customer_sentiment.Negative}%)</span>
                </div>
              </div>

              {/* Financial Risk */}
              <div className="space-y-3">
                <span className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider font-mono block">III. Revenue Risk</span>
                <div className="p-4 rounded-xl bg-zinc-950/40 border border-zinc-850 text-xs space-y-2 print:border-zinc-200">
                  <div className="flex justify-between items-center">
                    <span className="text-zinc-500 font-medium">Estimated risk ARR</span>
                    <span className="text-sm font-bold text-red-400">${report.sections.revenue_impact.total_risk.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-zinc-500 font-medium">Average Churn likelihood</span>
                    <span className="text-sm font-bold text-orange-400">{report.sections.revenue_impact.churn_risk_average}</span>
                  </div>
                  <p className="text-[10px] text-zinc-500 italic leading-relaxed pt-2 border-t border-zinc-800/40 print:text-zinc-600">
                    "{report.sections.revenue_impact.description}"
                  </p>
                </div>
              </div>

            </div>

          </div>

          {/* Stepper Grid: Performance & Recommendations */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-zinc-800/40 print:border-zinc-200">
            
            {/* Performance Stats */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest font-mono flex items-center gap-1.5 print:text-zinc-600">
                <Clock className="w-4 h-4 text-zinc-500 print:text-zinc-700" /> IV. Operations Performance
              </h3>
              <div className="bg-zinc-950/30 border border-zinc-850 p-4 rounded-xl space-y-3 text-xs print:border-zinc-200">
                <div className="flex justify-between items-center">
                  <span className="text-zinc-500 font-medium">Resolution Time</span>
                  <span className="font-semibold text-zinc-300 print:text-zinc-800">{report.sections.engineering_performance.average_resolution_time}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-zinc-500 font-medium">Tickets Resolved</span>
                  <span className="font-semibold text-zinc-300 print:text-zinc-800">{report.sections.engineering_performance.tickets_resolved_this_week}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-zinc-500 font-medium">Fix Verification Pass</span>
                  <span className="font-semibold text-emerald-400">{report.sections.engineering_performance.verification_pass_rate}</span>
                </div>
              </div>
            </div>

            {/* Recommendations */}
            <div className="md:col-span-2 space-y-3">
              <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest font-mono flex items-center gap-1.5 print:text-zinc-600">
                <Award className="w-4 h-4 text-indigo-400 shrink-0 print:text-indigo-600" /> V. Strategic Action Recommendations
              </h3>
              <div className="bg-zinc-950/35 border border-zinc-850 p-4 rounded-xl text-xs space-y-2.5 print:border-zinc-200 print:bg-zinc-50">
                {report.sections.recommendations.map((rec, i) => (
                  <div key={i} className="flex gap-2 text-zinc-300 print:text-zinc-800">
                    <span className="text-indigo-400 font-bold font-mono print:text-indigo-600">{i+1}.</span>
                    <span>{rec}</span>
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
