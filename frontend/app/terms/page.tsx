import Link from "next/link";
import { ArrowLeft, ShieldCheck, FileCheck, Scale, AlertCircle } from "lucide-react";

export const metadata = {
  title: "Terms of Service | EchoOps Feedback OS",
  description: "Terms and conditions governing the use of the EchoOps platform and APIs.",
};

export default function TermsOfServicePage() {
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
            <Scale className="w-3.5 h-3.5 mr-1.5" /> Legal Agreement
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
            Terms of Service
          </h1>
          <p className="mt-3 text-sm text-zinc-400">
            Last updated: July 25, 2026 • Effective immediately
          </p>
        </div>

        {/* Content */}
        <div className="space-y-8 glass-panel p-8 rounded-2xl border border-zinc-800/80 text-zinc-300 leading-relaxed text-sm">
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <FileCheck className="w-5 h-5 text-indigo-400" /> 1. Acceptance of Terms
            </h2>
            <p>
              By accessing or using the <strong>EchoOps Feedback OS</strong> platform, application, or APIs, you agree to be bound by these Terms of Service. If you are entering into this agreement on behalf of a company or organization, you represent that you have the authority to bind such entity.
            </p>
          </section>

          <section className="space-y-3 pt-4 border-t border-zinc-800/60">
            <h2 className="text-xl font-bold text-white">2. Description of Service</h2>
            <p>
              EchoOps provides an AI-powered customer feedback intelligence platform that aggregates user reviews, support tickets, and workspace communications, auto-synthesizing root causes and integrating with engineering project management tools.
            </p>
          </section>

          <section className="space-y-3 pt-4 border-t border-zinc-800/60">
            <h2 className="text-xl font-bold text-white">3. User Accounts & Responsibilities</h2>
            <ul className="list-disc list-inside space-y-1.5 text-zinc-400 pl-2">
              <li>You are responsible for maintaining the confidentiality of your account credentials and OAuth tokens.</li>
              <li>You must comply with all applicable local, national, and international laws when collecting and analyzing customer feedback.</li>
              <li>You must not use EchoOps to transmit malicious code, attempt unauthorized access to platform servers, or violate third-party service terms.</li>
            </ul>
          </section>

          <section className="space-y-3 pt-4 border-t border-zinc-800/60">
            <h2 className="text-xl font-bold text-white">4. Third-Party Integrations</h2>
            <p>
              EchoOps enables integrations with external tools (e.g., Jira, GitHub, Slack, Google OAuth). Your use of third-party integration services is subject to the respective terms and privacy policies of those providers.
            </p>
          </section>

          <section className="space-y-3 pt-4 border-t border-zinc-800/60">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-indigo-400" /> 5. Limitation of Liability
            </h2>
            <p className="text-zinc-400">
              To the maximum extent permitted by law, EchoOps Technologies shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use or inability to use the platform.
            </p>
          </section>

          <section className="space-y-3 pt-4 border-t border-zinc-800/60">
            <h2 className="text-xl font-bold text-white">6. Contact Information</h2>
            <p>
              For legal inquiries or notices regarding these Terms of Service, please contact:
            </p>
            <div className="p-4 rounded-xl bg-zinc-900/80 border border-zinc-800 text-indigo-300 font-mono text-xs">
              legal@echoops.io
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
