'use client';

import React from 'react';
import SidebarLayout from '../components/SidebarLayout';
import { Layers, CheckCircle2, AlertCircle, TrendingDown, ArrowUpRight } from 'lucide-react';

export default function ReleasesPage() {
  const releases = [
    {
      version: 'v12.5.0',
      date: 'Aug 20, 2026',
      status: 'Verified',
      beforeCount: 1420,
      afterCount: 1210,
      impact: '-14.7% Crash Rate',
      notes: 'Contains Payment SDK upgrade and UI latency fixes.'
    },
    {
      version: 'v12.4.2',
      date: 'Aug 10, 2026',
      status: 'Verified',
      beforeCount: 1680,
      afterCount: 1420,
      impact: '-15.4% Feedback Volume',
      notes: 'Hotfix for Bluetooth sync disconnects.'
    },
    {
      version: 'v12.3.0',
      date: 'Jul 28, 2026',
      status: 'Verified',
      beforeCount: 1950,
      afterCount: 1680,
      impact: '-13.8% Support Tickets',
      notes: 'Initial launch of Voice Intelligence features.'
    }
  ];

  return (
    <SidebarLayout>
      <div className="p-6 max-w-7xl mx-auto space-y-6">
        <div className="border-b border-zinc-800/80 pb-5">
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Layers className="w-6 h-6 text-indigo-400" />
            Release Impact & Verification
          </h1>
          <p className="text-sm text-zinc-400 mt-1">
            Compare customer feedback volume and health metrics before and after production releases.
          </p>
        </div>

        <div className="space-y-4">
          {releases.map((rel, idx) => (
            <div key={idx} className="bg-[#0A0A0E] border border-zinc-800 p-5 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-3">
                  <span className="text-base font-bold text-white font-mono">{rel.version}</span>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1 font-mono">
                    <CheckCircle2 className="w-3 h-3" /> {rel.status}
                  </span>
                  <span className="text-xs text-zinc-500 font-mono">{rel.date}</span>
                </div>
                <p className="text-xs text-zinc-400">{rel.notes}</p>
              </div>

              <div className="flex items-center gap-6 font-mono text-xs">
                <div className="text-right">
                  <div className="text-zinc-500">Before Release</div>
                  <div className="text-sm font-semibold text-zinc-300">{rel.beforeCount} signals</div>
                </div>
                <div className="text-right">
                  <div className="text-zinc-500">After Release</div>
                  <div className="text-sm font-semibold text-emerald-400">{rel.afterCount} signals</div>
                </div>
                <div className="bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-lg text-emerald-400 font-bold">
                  {rel.impact}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </SidebarLayout>
  );
}
