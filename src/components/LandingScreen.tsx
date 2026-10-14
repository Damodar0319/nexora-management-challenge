import React from 'react';
import { GameMode } from '../types/game';
import { GAME_MODES } from '../data/scenarios';
import { Users, Target, Lightbulb, ShieldCheck, ArrowRight, Play, Presentation, Wrench, ShieldAlert } from 'lucide-react';

interface LandingScreenProps {
  onStartGame: (mode: GameMode) => void;
  selectedMode: GameMode;
  onSelectMode: (mode: GameMode) => void;
  presentationMode: boolean;
  onTogglePresentationMode: () => void;
  onOpenPrinciplesModal: () => void;
}

export const LandingScreen: React.FC<LandingScreenProps> = ({
  onStartGame,
  selectedMode,
  onSelectMode,
  presentationMode,
  onTogglePresentationMode,
  onOpenPrinciplesModal,
}) => {
  return (
    <div className="relative min-h-[90vh] flex flex-col justify-center items-center py-10 px-4">
      {/* Background glow effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-cyan-600/15 via-teal-500/10 to-transparent blur-3xl pointer-events-none rounded-full" />

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

        {/* Game Mode Selection */}
        <div className="max-w-3xl mx-auto space-y-3 text-left">
          <div className="text-xs uppercase tracking-wider text-slate-400 font-mono font-semibold text-center">
            Select Simulation Mode:
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {Object.values(GAME_MODES).map((mode) => {
              const isSelected = selectedMode === mode.id;
              return (
                <button
                  key={mode.id}
                  type="button"
                  onClick={() => onSelectMode(mode.id)}
                  className={`
                    p-4 rounded-2xl border text-left transition-all duration-200 relative
                    ${isSelected
                      ? 'bg-nexora-800 border-cyan-400 ring-2 ring-cyan-400/50 shadow-glow-cyan'
                      : 'bg-nexora-900/60 border-slate-700 hover:border-slate-500 hover:bg-nexora-850'
                    }
                  `}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-sm text-white">{mode.title}</span>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${isSelected ? 'bg-cyan-400/20 text-cyan-300' : 'bg-slate-800 text-slate-400'}`}>
                      {mode.badge.split('(')[0]}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {mode.description}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Action Controls */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            type="button"
            onClick={() => onStartGame(selectedMode)}
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
