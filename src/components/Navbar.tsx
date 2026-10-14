import React from 'react';
import { Presentation, HelpCircle, RotateCcw } from 'lucide-react';

interface NavbarProps {
  presentationMode: boolean;
  onTogglePresentationMode: () => void;
  onOpenPrinciplesModal: () => void;
  onResetGame: () => void;
  isInGame: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  presentationMode,
  onTogglePresentationMode,
  onOpenPrinciplesModal,
  onResetGame,
  isInGame,
}) => {
  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-nexora-950/85 border-b border-slate-800/80 px-4 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Brand Logo & Wordmark */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={onResetGame}>
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-teal-400 p-0.5 shadow-glow-cyan flex items-center justify-center">
            <div className="w-full h-full bg-nexora-950 rounded-[10px] flex items-center justify-center">
              <span className="font-black text-cyan-400 text-sm font-display tracking-tighter">NX</span>
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-black text-base sm:text-lg tracking-wider text-white font-display">
                NEXORA
              </span>
              <span className="hidden sm:inline-block text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-500/30">
                Management Challenge
              </span>
            </div>
            <div className="text-[10px] text-slate-400 hidden sm:block font-medium">
              The Human-Centred Smart Enterprise
            </div>
          </div>
        </div>

        {/* Right utility actions */}
        <div className="flex items-center gap-2.5">
          {/* Principles Explainer Modal trigger */}
          <button
            type="button"
            onClick={onOpenPrinciplesModal}
            title="What makes an organization ideal?"
            className="p-2 sm:px-3 sm:py-1.5 rounded-xl glass-panel text-slate-300 hover:text-white hover:border-cyan-400 text-xs font-medium flex items-center gap-1.5 transition-colors"
          >
            <HelpCircle className="w-4 h-4 text-cyan-400" />
            <span className="hidden sm:inline">Concept Guide</span>
          </button>

          {/* Presentation Mode Toggle */}
          <button
            type="button"
            onClick={onTogglePresentationMode}
            title="Toggle Classroom Projector Mode"
            className={`
              p-2 sm:px-3 sm:py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all
              ${presentationMode
                ? 'bg-cyan-500 text-slate-950 border-cyan-400 shadow-glow-cyan'
                : 'glass-panel text-slate-300 hover:text-white hover:border-slate-600'
              }
            `}
          >
            <Presentation className="w-4 h-4" />
            <span className="hidden md:inline">Projector Mode: {presentationMode ? 'ON' : 'OFF'}</span>
          </button>

          {/* Reset / Home */}
          {isInGame && (
            <button
              type="button"
              onClick={onResetGame}
              title="Return to Introduction / Reset"
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
