'use client';

import React, { useState } from 'react';
import SidebarLayout from '../components/SidebarLayout';
import { 
  Plug, 
  Check, 
  ExternalLink,
  ShieldCheck,
  Zap,
  ArrowRight,
  RefreshCw,
  Layers,
  GitBranch,
  X
} from 'lucide-react';
import IntegrationIcon from '../components/IntegrationIcon';

interface IntegrationCard {
  id: string;
  tool_name: string;
  description: string;
  connected: boolean;
  statusText?: string;
  category: 'Engineering' | 'Communication' | 'Feedback';
}

export default function Integrations() {
  const [integrations, setIntegrations] = useState<IntegrationCard[]>([
    { id: 'jira', tool_name: 'Jira', description: 'Create and sync engineering issues directly from EchoOps.', connected: true, statusText: 'Workspace: Acme Engineering (PAY, MOBILE, WEB)', category: 'Engineering' },
    { id: 'github', tool_name: 'GitHub', description: 'Automatically open GitHub repository issues from feedback clusters.', connected: true, statusText: 'Connected to acme-saas/echoops', category: 'Engineering' },
    { id: 'gitlab', tool_name: 'GitLab', description: 'Sync issues, MRs, and release trackers with EchoOps.', connected: false, category: 'Engineering' },
    { id: 'linear', tool_name: 'Linear', description: 'Streamlined issue tracking and cycle sync for engineering.', connected: false, category: 'Engineering' },
    { id: 'trello', tool_name: 'Trello', description: 'Push customer cards to Trello product boards.', connected: false, category: 'Engineering' },
    { id: 'clickup', tool_name: 'ClickUp', description: 'Manage tasks and feature requests in ClickUp.', connected: false, category: 'Engineering' },
    { id: 'azure', tool_name: 'Azure DevOps', description: 'Sync work items and release pipelines.', connected: false, category: 'Engineering' },
    { id: 'slack', tool_name: 'Slack', description: 'Get real-time alerts for critical customer problems in #feedback.', connected: true, statusText: 'Webhook Active (#customer-alerts)', category: 'Communication' },
    { id: 'teams', tool_name: 'Microsoft Teams', description: 'Broadcast executive summaries to Teams channels.', connected: false, category: 'Communication' }
  ]);

  const [jiraModalOpen, setJiraModalOpen] = useState(false);
  const [jiraStep, setJiraStep] = useState<1 | 2>(1);
  const [jiraUrl, setJiraUrl] = useState('https://acme.atlassian.net');
  const [toast, setToast] = useState<string | null>(null);

  const handleConnectClick = (toolName: string) => {
    if (toolName === 'Jira') {
      setJiraStep(1);
      setJiraModalOpen(true);
    } else {
      setIntegrations(prev => prev.map(i => i.tool_name === toolName ? { ...i, connected: !i.connected, statusText: !i.connected ? '● Connected' : undefined } : i));
      setToast(`✓ Updated ${toolName} connection status`);
      setTimeout(() => setToast(null), 3000);
    }
  };

  const handleJiraConnectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setJiraStep(2);
    setTimeout(() => {
      setIntegrations(prev => prev.map(i => i.id === 'jira' ? { ...i, connected: true, statusText: 'Workspace: Acme Engineering (PAY, MOBILE, WEB)' } : i));
      setToast('✓ Jira Connected successfully to Acme Engineering!');
      setTimeout(() => setToast(null), 4000);
    }, 1200);
  };

  return (
    <SidebarLayout>
      <div className="space-y-6 max-w-6xl mx-auto">
        
        {/* Toast Alert */}
        {toast && (
          <div className="fixed top-5 right-5 z-50 p-4 rounded-xl bg-zinc-900 border border-emerald-500/40 text-emerald-400 text-xs font-semibold shadow-2xl flex items-center gap-2 animate-fade-in">
            <Check className="w-4 h-4" />
            <span>{toast}</span>
          </div>
        )}

        {/* Header */}
        <div className="border-b border-zinc-850 pb-4">
          <h1 className="text-2xl font-extrabold text-white font-heading">
            Integrations
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Connect EchoOps with the tools your engineering & support teams already use.
          </p>
        </div>

        {/* Integration Architecture Flow Box */}
        <div className="glass-panel p-5 rounded-2xl border border-indigo-500/30 bg-[#0D0D12] glow-ai-card space-y-3">
          <div className="flex justify-between items-center text-xs font-mono font-bold text-indigo-400">
            <span className="flex items-center gap-1.5 uppercase">
              <Zap className="w-4 h-4 text-indigo-400" /> Integration Sync Pipeline Status
            </span>
            <span className="text-zinc-500">Last synced 2 minutes ago</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 text-center text-xs font-mono pt-1">
            <div className="p-2.5 rounded-xl bg-[#050505] border border-zinc-800 font-bold text-zinc-200">
              EchoOps
            </div>
            <div className="flex items-center justify-center text-zinc-600 font-bold">↓</div>
            <div className="p-2.5 rounded-xl bg-[#050505] border border-zinc-800 font-bold text-indigo-400">
              Jira (PAY-4821)
            </div>
            <div className="flex items-center justify-center text-zinc-600 font-bold">↓</div>
            <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 font-bold text-emerald-400">
              In Progress → Done → Resolved
            </div>
          </div>
        </div>

        {/* Integration Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {integrations.map((tool) => (
            <div 
              key={tool.id}
              className="glass-panel p-5 rounded-2xl border border-zinc-800/80 bg-[#0D0D12] card-hover flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center p-2">
                    <IntegrationIcon name={tool.tool_name} />
                  </div>
                  {tool.connected ? (
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                      Connected
                    </span>
                  ) : (
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold font-mono bg-zinc-800 text-zinc-400">
                      Disconnected
                    </span>
                  )}
                </div>

                <div>
                  <h3 className="text-base font-bold text-white font-heading">{tool.tool_name}</h3>
                  <p className="text-xs text-zinc-400 mt-1 leading-relaxed">{tool.description}</p>
                </div>
              </div>

              <div className="pt-3 border-t border-zinc-850 flex items-center justify-between">
                {tool.statusText ? (
                  <span className="text-[10px] font-mono text-zinc-500 truncate max-w-[170px]">{tool.statusText}</span>
                ) : (
                  <span className="text-[10px] font-mono text-zinc-600">Common Integration API</span>
                )}

                <button
                  onClick={() => handleConnectClick(tool.tool_name)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                    tool.connected
                      ? 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300'
                      : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-md'
                  }`}
                >
                  {tool.connected ? 'Manage' : 'Connect'}
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Jira OAuth Connection Modal Flow */}
      {jiraModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-md bg-[#0B0B0F] border border-zinc-800 rounded-2xl p-6 space-y-4 shadow-2xl relative">
            <button 
              onClick={() => setJiraModalOpen(false)} 
              className="absolute top-4 right-4 text-zinc-500 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>

            {jiraStep === 1 ? (
              <form onSubmit={handleJiraConnectSubmit} className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center p-2">
                    <IntegrationIcon name="Jira" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white font-heading">Connect Jira</h3>
                    <p className="text-xs text-zinc-400">Connect your Jira workspace to auto-sync issues.</p>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono uppercase text-zinc-400 font-bold">Jira Workspace URL</label>
                  <input
                    type="url"
                    required
                    value={jiraUrl}
                    onChange={(e) => setJiraUrl(e.target.value)}
                    placeholder="https://yourcompany.atlassian.net"
                    className="w-full bg-[#050505] border border-zinc-800 rounded-xl p-3 text-xs text-zinc-200 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold shadow-md transition"
                >
                  Connect with Jira (OAuth 2.0)
                </button>
              </form>
            ) : (
              <div className="text-center py-6 space-y-3">
                <div className="w-10 h-10 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto" />
                <h4 className="text-sm font-bold text-white">Authenticating OAuth with Jira...</h4>
                <p className="text-xs text-zinc-400">Verifying projects PAY, MOBILE, WEB</p>
                <button onClick={() => setJiraModalOpen(false)} className="px-4 py-2 bg-zinc-800 text-zinc-300 text-xs rounded-xl">Close</button>
              </div>
            )}
          </div>
        </div>
      )}

    </SidebarLayout>
  );
}
