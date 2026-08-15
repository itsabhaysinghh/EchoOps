import Link from "next/link";
import { ArrowLeft, ShieldCheck, Lock, Eye, FileText } from "lucide-react";

export const metadata = {
  title: "Privacy Policy | EchoOps Feedback OS",
  description: "Learn how EchoOps collects, uses, and protects your data and user information.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 flex flex-col justify-between p-6 sm:p-12 font-sans selection:bg-indigo-500/30">
      <div className="max-w-4xl mx-auto w-full">
        {/* Navigation / Header */}
        <div className="mb-10 flex items-center justify-between border-b border-zinc-800/80 pb-6">
          <Link
            href="/"
            className="inline-flex items-center text-sm font-medium text-zinc-400 hover:text-indigo-400 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
          <div className="flex items-center space-x-2 font-semibold tracking-tight text-lg">
            <img src="/logo.png" alt="EchoOps Logo" className="w-6 h-6 object-contain" />
            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">EchoOps</span>
          </div>
        </div>

        {/* Hero Section */}
        <div className="mb-12">
          <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 mb-4">
            <Lock className="w-3.5 h-3.5 mr-1.5" /> Privacy & Data Governance
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
            Privacy Policy
          </h1>
          <p className="mt-3 text-sm text-zinc-400">
            Last updated: July 25, 2026 • Effective immediately
          </p>
        </div>

        {/* Content */}
        <div className="space-y-8 glass-panel p-8 rounded-2xl border border-zinc-800/80 text-zinc-300 leading-relaxed text-sm">
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Eye className="w-5 h-5 text-indigo-400" /> 1. Information We Collect
            </h2>
            <p>
              When you use <strong>EchoOps Feedback OS</strong>, we collect information required to operate our AI feedback analysis platform:
            </p>
            <ul className="list-disc list-inside space-y-1.5 text-zinc-400 pl-2">
              <li><strong>Account Credentials:</strong> Basic OAuth profile information (name, email address, avatar URL) provided during sign-in.</li>
              <li><strong>Workspace & Integration Data:</strong> Telemetry, tickets, support logs, and reviews ingested from authorized integrations (such as Jira, GitHub, Slack, Microsoft Teams, or Google Workspace).</li>
              <li><strong>Usage Analytics:</strong> Anonymized interaction metrics to monitor application performance and stability.</li>
            </ul>
          </section>

          <section className="space-y-3 pt-4 border-t border-zinc-800/60">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-indigo-400" /> 2. Google OAuth & Third-Party Permissions
            </h2>
            <p>
              EchoOps processes Google OAuth account data strictly to provide user authentication and authorized workspace service functions. 
            </p>
            <p className="text-zinc-400">
              We strictly adhere to the <strong>Google API Services User Data Policy</strong>, including the Limited Use requirements. Your Google User Data is never sold, leased, or transferred to third-party data brokers or advertising networks.
            </p>
          </section>

          <section className="space-y-3 pt-4 border-t border-zinc-800/60">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-indigo-400" /> 3. Data Processing & AI Infrastructure
            </h2>
            <p>
              EchoOps uses advanced natural language processing and machine learning heuristics to categorize feedback, detect root causes, and trigger engineering workflows.
            </p>
            <ul className="list-disc list-inside space-y-1.5 text-zinc-400 pl-2">
              <li>Customer data is processed exclusively to perform real-time triage and issue generation.</li>
              <li>Data is stored using industry-standard encryption at rest (AES-256) and in transit (TLS 1.3).</li>
            </ul>
          </section>

          <section className="space-y-3 pt-4 border-t border-zinc-800/60">
            <h2 className="text-xl font-bold text-white">4. Data Retention & Deletion</h2>
            <p>
              We retain customer feedback data only for as long as your workspace account remains active. You may request account closure and complete data purging at any time by contacting our support team.
            </p>
          </section>

          <section className="space-y-3 pt-4 border-t border-zinc-800/60">
            <h2 className="text-xl font-bold text-white">5. Contact Us</h2>
            <p>
              If you have any questions or security concerns regarding this Privacy Policy, please reach out to us at:
            </p>
            <div className="p-4 rounded-xl bg-zinc-900/80 border border-zinc-800 text-indigo-300 font-mono text-xs">
              privacy@echoops.io
            </div>
          </section>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-12 text-center text-xs text-zinc-500">
        &copy; {new Date().getFullYear()} EchoOps Technologies. All rights reserved.
      </footer>
    </div>
  );
}
