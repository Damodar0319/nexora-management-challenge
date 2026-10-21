import React from 'react';
import { BlueprintDefinition } from '../types/game';
import { 
  Volume2, 
  VolumeX, 
  HelpCircle, 
  RotateCcw,
  Sparkles,
  Trophy,
  CheckCircle2
} from 'lucide-react';
import { playClickSound } from '../utils/sound';

interface NavbarProps {
  currentBlueprint: BlueprintDefinition;
  onSelectBlueprint?: (blueprint: BlueprintDefinition) => void;
  isSoundEnabled: boolean;
  onToggleSound: () => void;
  onOpenHelp: () => void;
  onReset: () => void;
  filledCount: number;
  totalSlots: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentBlueprint,
  isSoundEnabled,
  onToggleSound,
  onOpenHelp,
  onReset,
  filledCount,
  totalSlots,
}) => {
  const isFull = filledCount === totalSlots;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b-2 border-slate-200 shadow-md">
      {/* Top rainbow strip */}
      <div className="h-2 bg-gradient-to-r from-red-500 via-amber-400 via-blue-500 to-emerald-500" />

      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
        {/* Brand Logo & Name */}
        <div className="flex items-center gap-3">
          {/* 4-Color Toy Block Logo Icon */}
          <div className="w-10 h-10 rounded-2xl grid grid-cols-2 gap-1 p-1.5 bg-slate-900 shadow-lg shrink-0">
            <div className="rounded-md bg-red-500 shadow-sm" />
            <div className="rounded-md bg-amber-400 shadow-sm" />
            <div className="rounded-md bg-blue-500 shadow-sm" />
            <div className="rounded-md bg-emerald-500 shadow-sm" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="font-black text-xl tracking-tight font-display text-slate-900 leading-none">
                BLOCK<span className="text-blue-600">BUILDER</span>
              </span>
              <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase font-mono bg-gradient-to-r from-red-500 via-amber-400 to-emerald-500 text-white shadow-sm">
                SINGLE 10-BLOCK LEVEL
              </span>
            </div>
            <p className="text-xs text-slate-500 font-semibold hidden sm:block">
              Red • Yellow • Blue • Green • Essentials of Management
            </p>
          </div>
        </div>

        {/* Single Level Header Badge */}
        <div className="flex items-center gap-2 bg-slate-100 px-3.5 py-1.5 rounded-2xl border-2 border-slate-200 shadow-inner">
          <span className="text-base">🏛️</span>
          <div className="text-left">
            <div className="text-[10px] font-mono font-black uppercase text-slate-500 leading-tight">
              Level 1 (Only Level):
            </div>
            <div className="text-xs sm:text-sm font-black text-slate-900 leading-tight flex items-center gap-1.5">
              <span>{currentBlueprint.name}</span>
              <span className={`px-2 py-0.2 rounded-full font-mono text-[10px] font-black ${
                isFull ? 'bg-emerald-500 text-white animate-pulse' : 'bg-blue-600 text-white'
              }`}>
                {filledCount}/{totalSlots}
              </span>
            </div>
          </div>
        </div>

        {/* Right utility buttons */}
        <div className="flex items-center gap-2">
          {/* Reset button in navbar */}
          <button
            onClick={() => {
              playClickSound();
              onReset();
            }}
            disabled={filledCount === 0}
            className="p-2 sm:px-3 sm:py-2 rounded-2xl border-2 border-slate-200 text-slate-600 hover:text-red-600 hover:bg-red-50 hover:border-red-200 text-xs font-black transition-all disabled:opacity-40 disabled:pointer-events-none flex items-center gap-1 shadow-sm"
            title="Reset structure"
          >
            <RotateCcw className="w-4 h-4" />
            <span className="hidden sm:inline">Reset</span>
          </button>

          {/* Sound Toggle */}
          <button
            onClick={() => {
              playClickSound();
              onToggleSound();
            }}
            className={`
              p-2.5 rounded-2xl border-2 transition-all flex items-center justify-center shadow-sm hover:scale-105 active:scale-95
              ${isSoundEnabled
                ? 'bg-emerald-50 border-emerald-300 text-emerald-700'
                : 'bg-red-50 border-red-300 text-red-600'
              }
            `}
            title={isSoundEnabled ? 'Mute Sounds' : 'Unmute Sounds'}
          >
            {isSoundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Help / Rules Guide */}
          <button
            onClick={() => {
              playClickSound();
              onOpenHelp();
            }}
            className="p-2.5 rounded-2xl bg-amber-50 hover:bg-amber-100 border-2 border-amber-300 text-amber-900 transition-all flex items-center justify-center shadow-sm hover:scale-105 active:scale-95 font-black text-xs gap-1"
            title="How to play & management principles"
          >
            <HelpCircle className="w-4 h-4 text-amber-600" />
            <span className="hidden md:inline">Rules</span>
          </button>
        </div>
      </div>
    </header>
  );
};
