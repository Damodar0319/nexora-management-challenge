import React from 'react';
import { Users, Target, Lightbulb, ShieldCheck, ArrowRight, Presentation, Sparkles, Layers, ShieldAlert, Award } from 'lucide-react';

interface LandingScreenProps {
  onStartGame: () => void;
  presentationMode: boolean;
  onTogglePresentationMode: () => void;
  onOpenPrinciplesModal: () => void;
}

export const LandingScreen: React.FC<LandingScreenProps> = ({
  onStartGame,
  presentationMode,
  onTogglePresentationMode,
  onOpenPrinciplesModal,
}) => {
  return (
    <div className="relative min-h-[85vh] flex flex-col justify-center items-center py-8 px-4 animate-fadeIn">
      {/* Background ambient glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[380px] bg-gradient-to-tr from-cyan-600/15 via-teal-500/10 to-transparent blur-3xl pointer-events-none rounded-full" />

      <div className="relative z-10 max-w-4xl w-full text-center space-y-8">
        {/* Wordmark / Logo Badge */}
        <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-nexora-800/80 border border-cyan-500/40 text-cyan-300 text-xs font-mono uppercase tracking-widest shadow-glow-cyan">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
          The NEXORA Management Challenge • Essentials of Management
        </div>

        {/* Main Title & Subtitle */}
        <div className="space-y-4">
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white uppercase font-display">
            BUILD YOUR <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400">IDEAL ORGANIZATION</span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto font-light leading-relaxed italic">
            &ldquo;Every organization is built on decisions. Can you build one that balances people, performance, innovation, and purpose?&rdquo;
          </p>
        </div>

        {/* Four Introductory Indicators */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl mx-auto">
          <div className="glass-panel p-4 rounded-2xl flex flex-col items-center text-center space-y-2 border-cyan-500/20 hover:border-cyan-400/50 transition-colors">
            <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <Users className="w-5 h-5" />
            </div>
            <div className="font-bold text-sm text-slate-100 tracking-wide">PEOPLE</div>
            <div className="text-[11px] text-slate-400">Motivation & Culture</div>
          </div>

          <div className="glass-panel p-4 rounded-2xl flex flex-col items-center text-center space-y-2 border-emerald-500/20 hover:border-emerald-400/50 transition-colors">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Target className="w-5 h-5" />
            </div>
            <div className="font-bold text-sm text-slate-100 tracking-wide">PERFORMANCE</div>
            <div className="text-[11px] text-slate-400">Goals & Execution</div>
          </div>

          <div className="glass-panel p-4 rounded-2xl flex flex-col items-center text-center space-y-2 border-amber-500/20 hover:border-amber-400/50 transition-colors">
            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Lightbulb className="w-5 h-5" />
            </div>
            <div className="font-bold text-sm text-slate-100 tracking-wide">INNOVATION</div>
            <div className="text-[11px] text-slate-400">Agility & Ideas</div>
          </div>

          <div className="glass-panel p-4 rounded-2xl flex flex-col items-center text-center space-y-2 border-violet-500/20 hover:border-violet-400/50 transition-colors">
            <div className="p-2.5 rounded-xl bg-violet-500/10 text-violet-400 border border-violet-500/20">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div className="font-bold text-sm text-slate-100 tracking-wide">PURPOSE</div>
            <div className="text-[11px] text-slate-400">Ethics & Impact</div>
          </div>
        </div>

        {/* Challenge Briefing Card */}
        <div className="max-w-2xl mx-auto glass-panel p-5 rounded-2xl border-cyan-500/30 text-left space-y-3">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-cyan-400 font-bold">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            Simulation Overview
          </div>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            You are tasked with engineering <strong>NEXORA</strong> — The Human-Centred Smart Enterprise. You will select from a pool of <strong>60+ management policies</strong> and assign them to the five pillars: <em>People</em>, <em>Performance</em>, <em>Innovation</em>, <em>Purpose & Ethics</em>, and <em>Structure & Teamwork</em>.
          </p>
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-xs text-amber-300/90 flex items-start gap-2">
            <ShieldAlert className="w-4 h-4 shrink-0 text-amber-400 mt-0.5" />
            <span>
              <strong>Executive Warning:</strong> Deceptive corporate traps and dysfunctional practices are mixed in among best practices. All policies look legitimate until final evaluation!
            </span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            type="button"
            onClick={onStartGame}
            className="w-full sm:w-auto px-10 py-4 rounded-2xl bg-gradient-to-r from-cyan-500 via-teal-500 to-emerald-500 text-slate-950 font-black text-lg uppercase tracking-wider hover:brightness-110 active:scale-95 transition-all shadow-glow-cyan flex items-center justify-center gap-3 cursor-pointer group"
          >
            <span>START BUILDING</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>

          <button
            type="button"
            onClick={onOpenPrinciplesModal}
            className="w-full sm:w-auto px-6 py-4 rounded-2xl glass-panel text-slate-300 hover:text-white hover:border-cyan-400 text-sm font-semibold transition-all flex items-center justify-center gap-2"
          >
            <Presentation className="w-4 h-4 text-cyan-400" />
            <span>What Makes An Organization Ideal?</span>
          </button>
        </div>

        {/* Projector / Presentation Mode indicator */}
        <div className="flex items-center justify-center gap-3 text-xs text-slate-400 pt-2">
          <button
            type="button"
            onClick={onTogglePresentationMode}
            className={`
              flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-colors
              ${presentationMode
                ? 'bg-cyan-950/80 border-cyan-400 text-cyan-300'
                : 'bg-slate-900 border-slate-700 text-slate-400 hover:text-slate-200'
              }
            `}
          >
            <Presentation className="w-3.5 h-3.5" />
            <span>Classroom Projector Mode: <strong>{presentationMode ? 'ON' : 'OFF'}</strong></span>
          </button>
        </div>
      </div>
    </div>
  );
};
