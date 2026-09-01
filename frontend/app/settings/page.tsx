'use client';

import React, { useState } from 'react';
import SidebarLayout from '../components/SidebarLayout';
import { Settings, Building2, Key, Users, ShieldCheck, Check } from 'lucide-react';

export default function SettingsPage() {
  const [saved, setSaved] = useState(false);
  const [companyName, setCompanyName] = useState('Acme SaaS Inc.');
  const [timezone, setTimezone] = useState('UTC');
  const [workspaceSlug, setWorkspaceSlug] = useState('acme-desk');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <SidebarLayout>
      <div className="p-6 max-w-4xl mx-auto space-y-6">
        <div className="border-b border-zinc-800/80 pb-5">
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Settings className="w-6 h-6 text-indigo-400" />
            Workspace & Organization Settings
          </h1>
          <p className="text-sm text-zinc-400 mt-1">
            Manage multi-tenant organization details, API access keys, and workspace routing.
          </p>
        </div>

        <form onSubmit={handleSave} className="space-y-6">
          <div className="bg-[#0A0A0E] border border-zinc-800 p-6 rounded-xl space-y-4">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <Building2 className="w-4 h-4 text-indigo-400" />
              Organization Details
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-zinc-400 font-medium block mb-1">Company Name</label>
                <input
                  type="text"
                  value={companyName}
                  onChange={e => setCompanyName(e.target.value)}
                  className="w-full bg-[#121216] border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-200 focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="text-xs text-zinc-400 font-medium block mb-1">Timezone</label>
                <input
                  type="text"
                  value={timezone}
                  onChange={e => setTimezone(e.target.value)}
                  className="w-full bg-[#121216] border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-200 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>
          </div>

          <div className="bg-[#0A0A0E] border border-zinc-800 p-6 rounded-xl space-y-4">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <Key className="w-4 h-4 text-indigo-400" />
              Workspace Slug & Routing
            </h3>

            <div>
              <label className="text-xs text-zinc-400 font-medium block mb-1">Workspace Slug</label>
              <input
                type="text"
                value={workspaceSlug}
                onChange={e => setWorkspaceSlug(e.target.value)}
                className="w-full bg-[#121216] border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-200 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            {saved ? (
              <span className="text-xs text-emerald-400 flex items-center gap-1">
                <Check className="w-4 h-4" /> Settings updated successfully!
              </span>
            ) : <span />}

            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs px-5 py-2.5 rounded-lg transition"
            >
              Save Organization Settings
            </button>
          </div>
        </form>
      </div>
    </SidebarLayout>
  );
}
