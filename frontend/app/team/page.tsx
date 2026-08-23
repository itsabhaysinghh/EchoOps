'use client';

import React from 'react';
import SidebarLayout from '../components/SidebarLayout';
import { Users, AlertTriangle, CheckCircle, Clock, ShieldAlert, ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function TeamWorkPage() {
  const router = useRouter();

  const teams = [
    { name: 'Payments Engineering', open: 8, critical: 2, in_progress: 4, resolved: 12 },
    { name: 'Support Operations', open: 5, critical: 1, in_progress: 2, resolved: 24 },
    { name: 'Logistics Team', open: 3, critical: 0, in_progress: 1, resolved: 18 },
    { name: 'Authentication Team', open: 4, critical: 1, in_progress: 2, resolved: 9 }
  ];

  const teamProblems = [
    { id: 1, title: 'Payment crashes after UPI', priority: 'Critical', assignee: 'Rahul Sharma', due: 'Tomorrow', status: 'In Progress' },
    { id: 2, title: 'Refund taking too long', priority: 'High', assignee: 'Dani Ramos', due: 'In 2 days', status: 'Open' },
    { id: 4, title: 'OTP verification code not received', priority: 'High', assignee: 'Kyle Reese', due: 'Tomorrow', status: 'Open' }
  ];

  return (
    <SidebarLayout>
      <div className="space-y-6 max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="border-b border-zinc-850 pb-4">
          <h1 className="text-2xl font-extrabold text-white font-heading">
            Team Workload & Assignments
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Track engineering team workloads, open problems, and resolution statuses.
          </p>
        </div>

        {/* Team KPI Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {teams.map((t) => (
            <div key={t.name} className="glass-panel p-5 rounded-2xl border border-zinc-800/80 bg-[#0D0D12] space-y-3">
              <div className="flex justify-between items-start">
                <span className="text-xs font-bold text-white font-heading">{t.name}</span>
                <span className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400"><Users className="w-3.5 h-3.5" /></span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs font-mono pt-1 border-t border-zinc-850">
                <div><span className="text-zinc-500 block">Open:</span> <strong className="text-white">{t.open}</strong></div>
                <div><span className="text-zinc-500 block">Critical:</span> <strong className="text-red-400">{t.critical}</strong></div>
                <div><span className="text-zinc-500 block">In Progress:</span> <strong className="text-indigo-400">{t.in_progress}</strong></div>
                <div><span className="text-zinc-500 block">Resolved:</span> <strong className="text-emerald-400">{t.resolved}</strong></div>
              </div>
            </div>
          ))}
        </div>

        {/* Team Assignment Table */}
        <div className="glass-panel rounded-2xl border border-zinc-800/80 bg-[#0D0D12] overflow-hidden space-y-4">
          <div className="px-6 py-4 border-b border-zinc-800 flex justify-between items-center">
            <h2 className="text-sm font-extrabold text-white font-heading">Payments Engineering Workpack</h2>
            <span className="text-xs font-mono text-indigo-400">8 Total Active Items</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-zinc-800 bg-[#080808] text-zinc-400 uppercase text-[10px] font-mono tracking-wider">
                  <th className="py-3 px-6">Problem</th>
                  <th className="py-3 px-6">Priority</th>
                  <th className="py-3 px-6">Assignee</th>
                  <th className="py-3 px-6">Due Date</th>
                  <th className="py-3 px-6">Status</th>
                  <th className="py-3 px-6 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-850">
                {teamProblems.map((p) => (
                  <tr key={p.id} onClick={() => router.push(`/issues/${p.id}`)} className="hover:bg-zinc-900/50 cursor-pointer">
                    <td className="py-3.5 px-6 font-bold text-zinc-200">{p.title}</td>
                    <td className="py-3.5 px-6 font-bold text-red-400 uppercase text-[10px]">{p.priority}</td>
                    <td className="py-3.5 px-6 text-zinc-300 font-medium">{p.assignee}</td>
                    <td className="py-3.5 px-6 font-mono text-zinc-400">{p.due}</td>
                    <td className="py-3.5 px-6">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 uppercase">
                        {p.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-6 text-right text-indigo-400 font-semibold">View →</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </SidebarLayout>
  );
}
