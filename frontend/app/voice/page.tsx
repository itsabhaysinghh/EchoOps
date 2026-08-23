'use client';

import React, { useState } from 'react';
import SidebarLayout from '../components/SidebarLayout';
import { 
  Mic, 
  Play, 
  Pause, 
  Sparkles, 
  Music, 
  CheckCircle,
  Clock,
  ShieldAlert,
  ArrowRight
} from 'lucide-react';

export default function VoiceIntelligence() {
  const [file, setFile] = useState<File | null>(null);
  const [processing, setProcessing] = useState(false);
  const [progressStep, setProgressStep] = useState<number>(0);
  const [result, setResult] = useState<any>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const processAudio = () => {
    if (!file && !result) {
      setFile(new File(["mock"], "Customer_Call_4821.mp3", { type: "audio/mp3" }));
    }
    setProcessing(true);
    setProgressStep(1);

    setTimeout(() => setProgressStep(2), 600);
    setTimeout(() => setProgressStep(3), 1200);
    setTimeout(() => setProgressStep(4), 1800);
    setTimeout(() => {
      setProgressStep(5);
      setResult({
        call_id: "Customer Call #4821",
        duration: "08:42",
        sentiment: "Very Negative",
        emotion: "Frustrated",
        problem: "Payment Failed",
        priority: "Critical",
        suggested_team: "Payments Engineering",
        summary: "Customer attempted payment through UPI. Payment was deducted from bank account but order confirmation screen failed to load.",
        speakers: [
          { speaker: "Customer", time: "00:12", text: "I paid through UPI but the screen went completely black. Money was deducted!" },
          { speaker: "Agent", time: "00:25", text: "I understand your frustration. Let me look up your payment reference ID." },
          { speaker: "Customer", time: "01:04", text: "I tried twice more and now I am charged 3 times without any order status!" },
          { speaker: "Agent", time: "01:45", text: "I am escalating this directly to Payments Engineering for an immediate fix." }
        ]
      });
      setProcessing(false);
    }, 2400);
  };

  return (
    <SidebarLayout>
      <div className="space-y-6 max-w-5xl mx-auto">
        
        {/* Header */}
        <div className="border-b border-white/[0.06] pb-4">
          <h1 className="text-2xl font-bold text-white font-heading">
            Voice Intelligence
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Turn customer call recordings into actionable engineering problems.
          </p>
        </div>

        {/* Upload & Dropzone Area */}
        <div 
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          className="glass-panel p-8 rounded-3xl border-2 border-dashed border-white/[0.08] hover:border-indigo-500/50 bg-[#08080A] text-center space-y-4 transition"
        >
          <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mx-auto">
            <Mic className="w-7 h-7 animate-pulse" />
          </div>

          <div>
            <h3 className="text-base font-bold text-white font-heading">
              Drop customer calls here
            </h3>
            <p className="text-xs text-zinc-400 mt-1">
              Supports MP3 · WAV · M4A · MP4 (up to 100MB)
            </p>
          </div>

          <div className="flex items-center justify-center gap-3 pt-2">
            <label className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow cursor-pointer transition">
              Upload Recording
              <input type="file" accept="audio/*,video/*" onChange={handleFileSelect} className="hidden" />
            </label>
            <button 
              onClick={processAudio}
              className="px-5 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-zinc-200 text-xs font-bold transition hover:bg-white/[0.08]"
            >
              Load Demo Call #4821
            </button>
          </div>

          {file && (
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/[0.03] border border-white/[0.06] text-xs text-zinc-300 font-mono">
              <Music className="w-3.5 h-3.5 text-indigo-400" />
              <span>{file.name}</span>
            </div>
          )}
        </div>

        {/* Processing Stepper */}
        {processing && (
          <div className="glass-panel p-6 rounded-2xl border border-indigo-500/30 bg-[#08080A] space-y-4 glow-ai-card">
            <div className="flex items-center justify-between text-xs font-mono text-indigo-300 font-bold">
              <span className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-400 animate-spin" /> Neural Audio Pipeline Active
              </span>
              <span>Step {progressStep} of 4</span>
            </div>

            <div className="space-y-2 text-xs font-mono">
              <div className={`flex items-center gap-2 ${progressStep >= 1 ? 'text-emerald-400' : 'text-zinc-600'}`}>
                <CheckCircle className="w-4 h-4" /> Transcribing customer speech...
              </div>
              <div className={`flex items-center gap-2 ${progressStep >= 2 ? 'text-emerald-400' : 'text-zinc-600'}`}>
                <CheckCircle className="w-4 h-4" /> Understanding customer intent & sentiment...
              </div>
              <div className={`flex items-center gap-2 ${progressStep >= 3 ? 'text-emerald-400' : 'text-zinc-600'}`}>
                <CheckCircle className="w-4 h-4" /> Finding engineering problems...
              </div>
              <div className={`flex items-center gap-2 ${progressStep >= 4 ? 'text-emerald-400' : 'text-zinc-600'}`}>
                <CheckCircle className="w-4 h-4" /> Calculating customer business impact...
              </div>
            </div>
          </div>
        )}

        {/* Voice Analysis Result Card */}
        {result && !processing && (
          <div className="space-y-6 animate-fade-in">
            <div className="glass-panel p-6 rounded-2xl border border-indigo-500/30 bg-[#08080A] glow-ai-card space-y-4">
              <div className="flex justify-between items-center border-b border-white/[0.06] pb-3">
                <div className="flex items-center gap-3">
                  <span className="text-base font-bold text-white font-heading">{result.call_id}</span>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-red-500/10 text-red-400 border border-red-500/30">
                    Very Negative Sentiment
                  </span>
                </div>
                <span className="text-xs font-mono text-zinc-400">Duration: {result.duration}</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
                <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                  <span className="text-zinc-500 text-[10px] uppercase block">Emotion:</span>
                  <strong className="text-red-400">{result.emotion}</strong>
                </div>
                <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                  <span className="text-zinc-500 text-[10px] uppercase block">Problem:</span>
                  <strong className="text-white">{result.problem}</strong>
                </div>
                <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                  <span className="text-zinc-500 text-[10px] uppercase block">Priority:</span>
                  <strong className="text-red-500 font-extrabold">{result.priority}</strong>
                </div>
                <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                  <span className="text-zinc-500 text-[10px] uppercase block">Suggested Team:</span>
                  <strong className="text-indigo-400">{result.suggested_team}</strong>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-indigo-500/5 border border-indigo-500/20 space-y-1">
                <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider font-mono flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-400" /> AI Call Summary
                </span>
                <p className="text-xs text-zinc-200 leading-relaxed font-sans">{result.summary}</p>
              </div>
            </div>

            {/* Audio Transcript Player */}
            <div className="glass-panel p-6 rounded-2xl border border-white/[0.06] bg-[#08080A] space-y-4">
              <div className="flex justify-between items-center border-b border-white/[0.06] pb-3">
                <h3 className="text-xs font-bold text-white uppercase font-mono">
                  Audio Call Transcript (Speaker Separation)
                </h3>
                <button 
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 shadow"
                >
                  {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                  <span>{isPlaying ? 'Pause Audio' : 'Play Audio'}</span>
                </button>
              </div>

              <div className="space-y-3">
                {result.speakers.map((s: any, idx: number) => (
                  <div key={idx} className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06] flex gap-3 text-xs">
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-[10px] font-bold shrink-0 ${
                      s.speaker === 'Customer' ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
                    }`}>
                      {s.speaker[0]}
                    </div>
                    <div className="space-y-1 flex-1">
                      <div className="flex justify-between font-mono text-[10px]">
                        <span className="font-bold text-zinc-300">{s.speaker}</span>
                        <span className="text-zinc-500">{s.time}</span>
                      </div>
                      <p className="text-zinc-300 font-sans leading-relaxed">{s.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

      </div>
    </SidebarLayout>
  );
}
