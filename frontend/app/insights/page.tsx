'use client';

import React from 'react';
import SidebarLayout from '../components/SidebarLayout';
import { Sparkles, TrendingUp, AlertTriangle, Lightbulb, ShieldAlert, ArrowUpRight } from 'lucide-react';

export default function InsightsPage() {
  const insights = [
    {
      title: 'UPI Payment Failure Spikes post v12.5',
      category: 'Emerging Problem',
      confidence: 96,
      action: 'Prioritize Payments Engineering patch for UPI confirmation screen.',
      impact: 'High Churn Risk ($42,000 revenue at risk)',
      time: '12m ago'
    },
    {
      title: 'iOS 17.4 OTP Delivery Latency',
      category: 'Customer Trend',
      confidence: 91,
      action: 'Upgrade SMS gateway timeout threshold and optimize auto-fill handlers.',
      impact: '18% decrease in onboarding completion rate',
      time: '1h ago'
    },
    {
      title: 'Surge in Dark Mode Feature Requests',
      category: 'Feature Demand',
      confidence: 88,
      action: 'Move Dark Mode implementation from Proposed to Sprint Backlog.',
      impact: '1,284 customer requests',
      time: '3h ago'
    },
    {
      title: 'Release v12.5 Reduced General App Crashes by 14%',
      category: 'Release Impact',
      confidence: 94,
      action: 'Mark release v12.5 verified for core UI stability.',
      impact: 'Positive sentiment increase in Play Store reviews',
      time: '5h ago'
    }
  ];

  return (
    <SidebarLayout>
      <div className="p-6 max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="border-b border-zinc-800/80 pb-5">
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-indigo-400" />
            AI Intelligence Insights
          </h1>
          <p className="text-sm text-zinc-400 mt-1">
            Real-time automated customer intelligence, churn signals, release impact, and operational recommendations.
          </p>
        </div>

        {/* Insight Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {insights.map((item, idx) => (
            <div key={idx} className="bg-[#0A0A0E] border border-zinc-800 p-5 rounded-xl space-y-4 hover:border-zinc-700 transition">
              <div className="flex items-center justify-between">
                <span className="text-xs px-2.5 py-1 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-mono">
                  {item.category}
                </span>
                <span className="text-xs text-zinc-500 font-mono">
                  Confidence: <strong className="text-emerald-400">{item.confidence}%</strong>
                </span>
              </div>

              <div>
                <h3 className="text-base font-semibold text-white">{item.title}</h3>
                <p className="text-xs text-rose-400 mt-1 font-mono">{item.impact}</p>
              </div>

              <div className="bg-[#121216] border border-zinc-800 p-3 rounded-lg text-xs space-y-1">
                <span className="text-zinc-400 font-medium block">Recommended Action:</span>
                <p className="text-zinc-200">{item.action}</p>
              </div>

              <div className="flex items-center justify-between text-xs text-zinc-500 pt-2 border-t border-zinc-800/60">
                <span>Detected {item.time}</span>
                <button className="text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1">
                  Execute Recommendation <ArrowUpRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </SidebarLayout>
  );
}
