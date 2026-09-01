'use client';

import React from 'react';
import SidebarLayout from '../components/SidebarLayout';
import { BarChart3, TrendingUp, Users, Zap, ShieldCheck } from 'lucide-react';

export default function AnalyticsPage() {
  return (
    <SidebarLayout>
      <div className="p-6 max-w-7xl mx-auto space-y-6">
        <div className="border-b border-zinc-800/80 pb-5">
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-indigo-400" />
            Product & Customer Telemetry Analytics
          </h1>
          <p className="text-sm text-zinc-400 mt-1">
            Deep-dive analytics across feedback channels, sentiment shifts, and revenue impact telemetry.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-[#0A0A0E] border border-zinc-800 p-5 rounded-xl space-y-2">
            <div className="text-xs text-zinc-400">Total Signal Telemetry</div>
            <div className="text-2xl font-bold text-white font-mono">152,948</div>
            <div className="text-xs text-emerald-400 font-mono">↑ 12.4% vs last month</div>
          </div>
          <div className="bg-[#0A0A0E] border border-zinc-800 p-5 rounded-xl space-y-2">
            <div className="text-xs text-zinc-400">Positive Sentiment Ratio</div>
            <div className="text-2xl font-bold text-emerald-400 font-mono">68.2%</div>
            <div className="text-xs text-emerald-400 font-mono">↑ 3.1% improved</div>
          </div>
          <div className="bg-[#0A0A0E] border border-zinc-800 p-5 rounded-xl space-y-2">
            <div className="text-xs text-zinc-400">Average Resolution Time</div>
            <div className="text-2xl font-bold text-indigo-400 font-mono">4.2 hours</div>
            <div className="text-xs text-indigo-400 font-mono">⚡ 48% faster with AI</div>
          </div>
          <div className="bg-[#0A0A0E] border border-zinc-800 p-5 rounded-xl space-y-2">
            <div className="text-xs text-zinc-400">Jira Ticket Auto-Sync</div>
            <div className="text-2xl font-bold text-white font-mono">99.4%</div>
            <div className="text-xs text-zinc-400 font-mono">Synced in real-time</div>
          </div>
        </div>

        <div className="bg-[#0A0A0E] border border-zinc-800 p-6 rounded-xl space-y-4">
          <h3 className="text-sm font-semibold text-white font-mono uppercase tracking-wider">Channel Volume Breakdown</h3>
          <div className="space-y-3 font-mono text-xs">
            <div>
              <div className="flex justify-between text-zinc-400 mb-1">
                <span>Google Play & App Store Reviews</span>
                <span>54,200 signals (35.4%)</span>
              </div>
              <div className="w-full bg-zinc-900 h-2 rounded-full overflow-hidden">
                <div className="bg-indigo-500 h-full w-[35.4%]" />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-zinc-400 mb-1">
                <span>Support Calls & Voice Transcripts</span>
                <span>42,100 signals (27.5%)</span>
              </div>
              <div className="w-full bg-zinc-900 h-2 rounded-full overflow-hidden">
                <div className="bg-purple-500 h-full w-[27.5%]" />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-zinc-400 mb-1">
                <span>Support Tickets & Live Chats</span>
                <span>38,400 signals (25.1%)</span>
              </div>
              <div className="w-full bg-zinc-900 h-2 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full w-[25.1%]" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </SidebarLayout>
  );
}
