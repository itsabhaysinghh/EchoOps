'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import SidebarLayout from '../components/SidebarLayout';
import { CircleAlert, ArrowUpRight, TrendingUp, AlertTriangle, ShieldCheck, CheckCircle2, Search, Filter } from 'lucide-react';

interface IssueItem {
  id: number;
  title: string;
  summary: string;
  health_score: number;
  health_status: string;
  total_reports: number;
  priority: string;
  assigned_team: string;
  status: string;
  estimated_revenue_risk: number;
}

export default function ProblemsListPage() {
  const [issues, setIssues] = useState<IssueItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterPriority, setFilterPriority] = useState('All');

  useEffect(() => {
    fetch('http://localhost:8000/api/issues')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setIssues(data);
        } else if (data.issues) {
          setIssues(data.issues);
        }
      })
      .catch(() => {
        // Fallback default issues
        setIssues([
          {
            id: 1,
            title: 'Payment crashes after UPI completion',
            summary: 'Customers report app crashes immediately after completing a UPI payment.',
            health_score: 98,
            health_status: 'Business Critical',
            total_reports: 2431,
            priority: 'Critical',
            assigned_team: 'Payments Engineering',
            status: 'In Progress',
            estimated_revenue_risk: 42000
          },
          {
            id: 2,
            title: 'OTP verification delay on iOS 17.4',
            summary: 'SMS OTP messages fail to auto-fill or arrive after 3+ minutes.',
            health_score: 74,
            health_status: 'Needs Attention',
            total_reports: 842,
            priority: 'High',
            assigned_team: 'Core Platform',
            status: 'Assigned',
            estimated_revenue_risk: 18500
          },
          {
            id: 3,
            title: 'Bluetooth sync failure on Android 14',
            summary: 'Meter pairing disconnects periodically when screen is locked.',
            health_score: 52,
            health_status: 'Growing Slowly',
            total_reports: 419,
            priority: 'Medium',
            assigned_team: 'Hardware Integration',
            status: 'AI Verified',
            estimated_revenue_risk: 9200
          }
        ]);
      })
      .finally(() => setLoading(false));
  }, []);

  const filteredIssues = issues.filter(issue => {
    const matchesSearch = issue.title.toLowerCase().includes(search.toLowerCase()) || 
                          issue.summary.toLowerCase().includes(search.toLowerCase());
    const matchesPriority = filterPriority === 'All' || issue.priority === filterPriority;
    return matchesSearch && matchesPriority;
  });

  return (
    <SidebarLayout>
      <div className="p-6 max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-800/80 pb-5">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              <CircleAlert className="w-6 h-6 text-indigo-400" />
              AI Customer Problems
            </h1>
            <p className="text-sm text-zinc-400 mt-1">
              AI-clustered problems automatically extracted from customer feedback signals.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs px-3 py-1.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-mono">
              {issues.length} Active Problems Clustered
            </span>
          </div>
        </div>

        {/* Filters & Search */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#0A0A0E] border border-zinc-800/80 p-4 rounded-xl">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
            <input
              type="text"
              placeholder="Search problems or keywords..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full bg-[#121216] border border-zinc-800 rounded-lg pl-9 pr-4 py-2 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-indigo-500"
            />
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Filter className="w-4 h-4 text-zinc-500" />
            <span className="text-xs text-zinc-400">Priority:</span>
            {['All', 'Critical', 'High', 'Medium', 'Low'].map(p => (
              <button
                key={p}
                onClick={() => setFilterPriority(p)}
                className={`text-xs px-3 py-1.5 rounded-lg border transition ${
                  filterPriority === p
                    ? 'bg-zinc-800 text-white border-zinc-700'
                    : 'bg-[#121216] text-zinc-400 border-zinc-800 hover:text-zinc-200'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* Problems List Grid */}
        {loading ? (
          <div className="p-12 text-center text-zinc-500 text-sm">
            Analyzing customer problem clusters...
          </div>
        ) : filteredIssues.length === 0 ? (
          <div className="p-12 text-center text-zinc-500 text-sm border border-dashed border-zinc-800 rounded-xl">
            No matching problems found.
          </div>
        ) : (
          <div className="space-y-4">
            {filteredIssues.map(issue => (
              <div
                key={issue.id}
                className="bg-[#0A0A0E] border border-zinc-800/80 hover:border-zinc-700 p-5 rounded-xl transition flex flex-col md:flex-row md:items-center justify-between gap-4 group"
              >
                <div className="space-y-2 max-w-3xl">
                  <div className="flex items-center gap-3">
                    <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-md border ${
                      issue.priority === 'Critical' 
                        ? 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                        : issue.priority === 'High'
                        ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                        : 'bg-zinc-800 text-zinc-300 border-zinc-700'
                    }`}>
                      {issue.priority} Priority
                    </span>
                    <span className="text-xs text-zinc-500 font-mono">
                      Health Score: <strong className="text-rose-400">{issue.health_score}</strong> ({issue.health_status})
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-400">
                      {issue.assigned_team}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-white group-hover:text-indigo-400 transition flex items-center gap-2">
                    {issue.title}
                  </h3>
                  <p className="text-xs text-zinc-400 line-clamp-2">
                    {issue.summary}
                  </p>
                </div>

                <div className="flex items-center gap-6 border-t md:border-t-0 border-zinc-800/60 pt-3 md:pt-0 shrink-0">
                  <div className="text-right hidden sm:block">
                    <div className="text-xs text-zinc-400">Total Reports</div>
                    <div className="text-base font-bold text-white font-mono">{issue.total_reports.toLocaleString()}</div>
                  </div>

                  <Link
                    href={`/issues/${issue.id}`}
                    className="flex items-center gap-1.5 bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-medium px-4 py-2 rounded-lg transition"
                  >
                    View Problem Detail
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </SidebarLayout>
  );
}
