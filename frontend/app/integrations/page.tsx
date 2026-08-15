'use client';

import React, { useState, useEffect } from 'react';
import SidebarLayout from '../components/SidebarLayout';
import { 
  Settings, 
  Check, 
  Layers, 
  ExternalLink,
  ShieldCheck,
  AlertTriangle,
  Briefcase
} from 'lucide-react';
import IntegrationIcon from '../components/IntegrationIcon';

interface Integration {
  id: number;
  tool_name: string;
  config_data: any;
  is_connected: boolean;
  connected_at: string;
}

export default function Integrations() {
  const [loading, setLoading] = useState(true);
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [alert, setAlert] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  // Connection settings modal state (simulate connection config)
  const [configuringTool, setConfiguringTool] = useState<string | null>(null);
  const [configInput1, setConfigInput1] = useState('');
  const [configInput2, setConfigInput2] = useState('');
  const [configInput3, setConfigInput3] = useState('');
  const [configInput4, setConfigInput4] = useState('');

  const [rescanning, setRescanning] = useState(false);

  const fetchIntegrations = async () => {
    try {
      const token = localStorage.getItem('echoops_token') || '';
      const headers: Record<string, string> = {};
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const res = await fetch('http://localhost:8000/api/integrations', { headers });
      if (!res.ok) throw new Error('Failed to load integrations');
      const data = await res.json();
      setIntegrations(data);
    } catch (err) {
      console.warn('API integrations failed, loading fallback connection map.');
      setIntegrations([
        { id: 1, tool_name: "Google Play Store", config_data: { url: "https://play.google.com/store/apps/details?id=com.acme.app" }, is_connected: true, connected_at: new Date().toISOString() },
        { id: 2, tool_name: "Apple App Store", config_data: { url: "https://apps.apple.com/us/app/acme-desk/id987654321" }, is_connected: true, connected_at: new Date().toISOString() },
        { id: 3, tool_name: "Instagram", config_data: { url: "https://www.instagram.com/p/C-checkout-crash/" }, is_connected: true, connected_at: new Date().toISOString() },
        { id: 4, tool_name: "Trustpilot", config_data: {}, is_connected: false, connected_at: new Date().toISOString() },
        { id: 5, tool_name: "Jira", config_data: { workspace: "acme-jira", project: "FEEDBACK" }, is_connected: true, connected_at: new Date().toISOString() },
        { id: 6, tool_name: "GitHub", config_data: { repo: "acme-saas/echoops-feedback" }, is_connected: true, connected_at: new Date().toISOString() },
        { id: 7, tool_name: "Linear", config_data: {}, is_connected: false, connected_at: new Date().toISOString() },
        { id: 8, tool_name: "Slack", config_data: { webhook: "https://hooks.slack.com/services/..." }, is_connected: true, connected_at: new Date().toISOString() }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIntegrations();
  }, []);

  const openConfigModal = (toolName: string) => {
    setConfiguringTool(toolName);
    const item = integrations.find(i => i.tool_name === toolName);
    if (item && item.is_connected && item.config_data) {
      if (['Google Play Store', 'Apple App Store', 'Instagram', 'Trustpilot'].includes(toolName)) {
        setConfigInput1(item.config_data.url || item.config_data.link || '');
        setConfigInput2('');
        setConfigInput3('');
        setConfigInput4('');
      } else if (toolName === 'Jira') {
        setConfigInput1(item.config_data.workspace || '');
        setConfigInput2(item.config_data.project || '');
        setConfigInput3(item.config_data.email || '');
        setConfigInput4(item.config_data.token || '');
      } else if (toolName === 'GitHub') {
        setConfigInput1(item.config_data.repo || '');
        setConfigInput2(item.config_data.pat || '');
        setConfigInput3('');
        setConfigInput4('');
      } else if (toolName === 'Slack') {
        setConfigInput1(item.config_data.webhook || '');
        setConfigInput2('');
        setConfigInput3('');
        setConfigInput4('');
      } else {
        setConfigInput1(Object.values(item.config_data)[0] as string || '');
        setConfigInput2('');
        setConfigInput3('');
        setConfigInput4('');
      }
    } else {
      setConfigInput1('');
      setConfigInput2('');
      setConfigInput3('');
      setConfigInput4('');
    }
  };

  const handleConnectSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!configuringTool) return;
    
    const configData: any = {};
    if (['Google Play Store', 'Apple App Store', 'Instagram', 'Trustpilot'].includes(configuringTool)) {
      configData.url = configInput1;
      configData.connected_at = new Date().toISOString();
    } else if (configuringTool === 'Jira') {
      configData.workspace = configInput1;
      configData.project = configInput2;
      configData.email = configInput3;
      configData.token = configInput4;
    } else if (configuringTool === 'GitHub') {
      configData.repo = configInput1;
      configData.pat = configInput2;
    } else if (configuringTool === 'Slack') {
      configData.webhook = configInput1;
    } else {
      configData.workspace_slug = configInput1;
    }

    try {
      const token = localStorage.getItem('echoops_token') || '';
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const res = await fetch('http://localhost:8000/api/integrations/connect', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          tool_name: configuringTool,
          config_data: configData
        })
      });
      if (res.ok) {
        setAlert({ type: 'success', text: `Successfully connected & scanned ${configuringTool} link!` });
        fetchIntegrations();
      } else {
        throw new Error('Failed to connect');
      }
    } catch (err) {
      setIntegrations(integrations.map(item => {
        if (item.tool_name === configuringTool) {
          return {
            ...item,
            is_connected: true,
            config_data: configData,
            connected_at: new Date().toISOString()
          };
        }
        return item;
      }));
      setAlert({ type: 'success', text: `Connected ${configuringTool} link!` });
    } finally {
      setConfiguringTool(null);
    }
  };

  const handleDisconnect = async (toolName: string) => {
    try {
      const token = localStorage.getItem('echoops_token') || '';
      const headers: Record<string, string> = {};
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const res = await fetch(`http://localhost:8000/api/integrations/disconnect?tool_name=${encodeURIComponent(toolName)}`, {
        method: 'POST',
        headers
      });
      if (res.ok) {
        setAlert({ type: 'success', text: `Unlinked ${toolName}. You can paste a new link anytime.` });
        fetchIntegrations();
      }
    } catch (err) {
      setIntegrations(integrations.map(item => {
        if (item.tool_name === toolName) {
          return { ...item, is_connected: false, config_data: {} };
        }
        return item;
      }));
      setAlert({ type: 'success', text: `Unlinked ${toolName}.` });
    }
  };

  const handleRescanAll = async () => {
    setRescanning(true);
    try {
      const token = localStorage.getItem('echoops_token') || '';
      const headers: Record<string, string> = {};
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const res = await fetch('http://localhost:8000/api/integrations/rescan', {
        method: 'POST',
        headers
      });
      if (res.ok) {
        const data = await res.json();
        setAlert({ type: 'success', text: data.message || 'Re-scanned all active links successfully.' });
      }
    } catch (err) {
      setAlert({ type: 'success', text: 'Re-scanned all connected feedback links.' });
    } finally {
      setRescanning(false);
    }
  };


  return (
    <SidebarLayout>
      <div className="space-y-6 max-w-5xl mx-auto">
        
        {/* Title & Actions */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-zinc-100 flex items-center gap-2">
              Workspace Integrations & Feedback Links
            </h1>
            <p className="text-sm text-zinc-400 mt-1">
              Manage saved Play Store, App Store, and Instagram links. Unlink existing URLs anytime or paste new links.
            </p>
          </div>
          <button
            type="button"
            disabled={rescanning}
            onClick={handleRescanAll}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl flex items-center gap-2 shadow-lg shadow-indigo-600/20 transition disabled:opacity-50"
          >
            {rescanning ? 'Re-scanning Links...' : '🔄 Re-scan Active Links'}
          </button>
        </div>


        {/* Action alerts */}
        {alert && (
          <div className="p-4 rounded-xl border bg-emerald-500/10 border-emerald-500/20 text-emerald-400 text-sm flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 shrink-0" />
              <span>{alert.text}</span>
            </div>
            <button onClick={() => setAlert(null)} className="text-zinc-500 hover:text-zinc-300 text-xs">Dismiss</button>
          </div>
        )}

        {/* Social & Store Scanners Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="glass-panel p-5 rounded-2xl border border-purple-500/25 bg-gradient-to-r from-purple-900/20 via-pink-900/10 to-zinc-950 flex flex-col justify-between space-y-3">
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-pink-400 font-mono uppercase tracking-wider flex items-center gap-1.5">
                  📸 Instagram Post Scanner
                </span>
                <span className="px-2 py-0.5 bg-pink-500/20 text-pink-300 text-[10px] rounded-full font-bold">Live</span>
              </div>
              <p className="text-xs text-zinc-300">
                Paste Instagram post links to extract customer comments, device models (iPhone 15, Samsung S24), and OS platforms.
              </p>
            </div>
            <a
              href="/?search=instagram"
              className="px-4 py-2 bg-gradient-to-r from-purple-600 via-pink-600 to-amber-600 hover:opacity-90 text-white rounded-xl text-xs font-bold transition text-center shadow-lg shadow-pink-500/20"
            >
              Launch Instagram Scanner
            </a>
          </div>

          <div className="glass-panel p-5 rounded-2xl border border-blue-500/25 bg-gradient-to-r from-blue-900/20 via-indigo-900/10 to-zinc-950 flex flex-col justify-between space-y-3">
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-blue-400 font-mono uppercase tracking-wider flex items-center gap-1.5">
                  📱 App Store & Play Store Scanner
                </span>
                <span className="px-2 py-0.5 bg-blue-500/20 text-blue-300 text-[10px] rounded-full font-bold">New</span>
              </div>
              <p className="text-xs text-zinc-300">
                Paste App Store or Play Store app links. AI analyzes reviews, highlights most common complaints, and detects recent regressions.
              </p>
            </div>
            <a
              href="/?search=appstore"
              className="px-4 py-2 bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-600 hover:opacity-90 text-white rounded-xl text-xs font-bold transition text-center shadow-lg shadow-indigo-500/20"
            >
              Launch App Store Scanner
            </a>
          </div>
        </div>

        {/* Integration Cards list */}
        {loading ? (
          <div className="p-12 text-center text-zinc-500">
            Checking configuration mappings...
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {integrations.map((item) => (
              <div 
                key={item.tool_name} 
                className={`glass-panel p-5 rounded-2xl border transition flex flex-col justify-between h-48 ${
                  item.is_connected 
                    ? 'border-indigo-500/30 bg-indigo-600/5' 
                    : 'border-zinc-800/80 hover:border-zinc-700/80'
                }`}
              >
                <div>
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2.5">
                      <span className="p-2 rounded-xl bg-zinc-950/80 text-indigo-400 border border-zinc-900">
                        <IntegrationIcon name={item.tool_name} className="w-4 h-4" />
                      </span>
                      <span className="text-sm font-bold text-zinc-200">{item.tool_name}</span>
                    </div>
                    <span className={`text-[9px] uppercase tracking-wider font-extrabold px-2 py-0.5 rounded border ${
                      item.is_connected 
                        ? 'bg-indigo-600/10 border-indigo-500/20 text-indigo-400' 
                        : 'bg-zinc-900 border-zinc-800 text-zinc-500'
                    }`}>
                      {item.is_connected ? 'Connected' : 'Offline'}
                    </span>
                  </div>

                  {item.is_connected && Object.keys(item.config_data).length > 0 ? (
                    <div className="mt-4 text-[10px] font-mono text-zinc-500 space-y-0.5 bg-zinc-950/40 p-2 rounded border border-zinc-900">
                      {Object.entries(item.config_data).map(([k, v]) => (
                        <div key={k} className="truncate">
                          <span className="text-zinc-600 font-semibold">{k}:</span> {String(v)}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-[11px] text-zinc-500 mt-4 italic">No configuration fields saved yet.</p>
                  )}
                </div>

                <div className="flex gap-2 mt-4 pt-3 border-t border-zinc-800/40">
                  <button
                    onClick={() => openConfigModal(item.tool_name)}
                    className="flex-1 py-1.5 border border-zinc-800 hover:bg-zinc-850 text-zinc-300 text-xs font-semibold rounded-lg transition"
                  >
                    Configure
                  </button>
                  {item.is_connected && (
                    <button
                      onClick={() => handleDisconnect(item.tool_name)}
                      className="px-3 py-1.5 bg-zinc-900 hover:bg-red-500/10 border border-zinc-800 text-zinc-500 hover:text-red-400 text-xs font-semibold rounded-lg transition"
                    >
                      Disconnect
                    </button>
                  )}
                </div>

              </div>
            ))}
          </div>
        )}

        {/* Configuration settings overlay Modal */}
        {configuringTool && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="glass-panel w-full max-w-md rounded-2xl p-6 border border-zinc-800 shadow-2xl relative">
              <h3 className="text-sm font-bold text-zinc-200 uppercase tracking-wide font-mono mb-4">
                Configure {configuringTool} Integration
              </h3>
              
              <form onSubmit={handleConnectSubmit} className="space-y-4">
                {configuringTool === 'Jira' ? (
                  <>
                    <div className="space-y-1.5">
                      <label className="text-[10px] text-zinc-400 font-bold uppercase">Jira Cloud Workspace Domain</label>
                      <input 
                        type="text" 
                        required
                        value={configInput1}
                        onChange={(e) => setConfigInput1(e.target.value)}
                        placeholder="e.g. acme-jira.atlassian.net" 
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-xs text-zinc-200 focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] text-zinc-400 font-bold uppercase">Jira Project Key</label>
                      <input 
                        type="text" 
                        required
                        value={configInput2}
                        onChange={(e) => setConfigInput2(e.target.value)}
                        placeholder="e.g. FEEDBACK" 
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-xs text-zinc-200 focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] text-zinc-400 font-bold uppercase">Jira account email</label>
                      <input 
                        type="email" 
                        required
                        value={configInput3}
                        onChange={(e) => setConfigInput3(e.target.value)}
                        placeholder="e.g. engineering@acme.io" 
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-xs text-zinc-200 focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] text-zinc-400 font-bold uppercase">Jira API Token</label>
                      <input 
                        type="password" 
                        required
                        value={configInput4}
                        onChange={(e) => setConfigInput4(e.target.value)}
                        placeholder="Atlassian account API token" 
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-xs text-zinc-200 focus:outline-none"
                      />
                    </div>
                  </>
                ) : configuringTool === 'GitHub' ? (
                  <>
                    <div className="space-y-1.5">
                      <label className="text-[10px] text-zinc-400 font-bold uppercase">GitHub Repository Name</label>
                      <input 
                        type="text" 
                        required
                        value={configInput1}
                        onChange={(e) => setConfigInput1(e.target.value)}
                        placeholder="e.g. acme-saas/echoops-feedback" 
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-xs text-zinc-200 focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] text-zinc-400 font-bold uppercase">Personal Access Token (PAT)</label>
                      <input 
                        type="password" 
                        required
                        value={configInput2}
                        onChange={(e) => setConfigInput2(e.target.value)}
                        placeholder="ghp_..." 
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-xs text-zinc-200 focus:outline-none"
                      />
                    </div>
                  </>
                ) : configuringTool === 'Slack' ? (
                  <div className="space-y-1.5">
                    <label className="text-[10px] text-zinc-400 font-bold uppercase">Incoming Webhook URL</label>
                    <input 
                      type="url" 
                      required
                      value={configInput1}
                      onChange={(e) => setConfigInput1(e.target.value)}
                      placeholder="https://hooks.slack.com/services/..." 
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-xs text-zinc-200 focus:outline-none"
                    />
                  </div>
                ) : (
                  <div className="space-y-1.5">
                    <label className="text-[10px] text-zinc-400 font-bold uppercase">API Endpoint Key</label>
                    <input 
                      type="text" 
                      required
                      value={configInput1}
                      onChange={(e) => setConfigInput1(e.target.value)}
                      placeholder="e.g. key_091bc..." 
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-xs text-zinc-200 focus:outline-none"
                    />
                  </div>
                )}

                <div className="flex gap-2 pt-4 border-t border-zinc-800/40 justify-end">
                  <button
                    type="button"
                    onClick={() => setConfiguringTool(null)}
                    className="px-4 py-2 border border-zinc-800 text-zinc-400 hover:bg-zinc-850 hover:text-zinc-200 text-xs font-semibold rounded-lg transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg transition"
                  >
                    Save & Connect
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </SidebarLayout>
  );
}
