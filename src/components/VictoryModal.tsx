import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { StructureEvaluation, BlueprintDefinition } from '../types/game';
import { DynamicIcon } from './DynamicIcon';
import { 
  Trophy, 
  Sparkles, 
  Activity, 
  RotateCcw, 
  ShieldCheck, 
  CheckCircle2, 
  Zap, 
  AlertTriangle,
  XCircle,
  HelpCircle,
  Check,
  TrendingDown,
  TrendingUp
} from 'lucide-react';
import { playFanfareSound, playEarthquakeSound, playBuzzerSound } from '../utils/sound';

interface VictoryModalProps {
  isOpen: boolean;
  evaluation: StructureEvaluation | null;
  blueprint: BlueprintDefinition;
  onClose: () => void;
  onReset: () => void;
  onTriggerEarthquake: () => void;
  isEarthquakeActive: boolean;
}

export const VictoryModal: React.FC<VictoryModalProps> = ({
  isOpen,
  evaluation,
  blueprint,
  onClose,
  onReset,
  onTriggerEarthquake,
  isEarthquakeActive,
}) => {
  const hasWrongAnswers = (evaluation?.wrongCount || 0) > 0;

  useEffect(() => {
    if (isOpen && evaluation) {
      if (hasWrongAnswers) {
        // Play buzzer / warning sound if wrong answers were picked
        playBuzzerSound();
      } else {
        // Play victory fanfare and launch confetti!
        playFanfareSound();

        const count = 200;
        const defaults = {
          origin: { y: 0.7 },
          colors: ['#EF4444', '#FACC15', '#3B82F6', '#10B981', '#FFFFFF'],
        };

        const fire = (particleRatio: number, opts: confetti.Options) => {
          confetti({
            ...defaults,
            ...opts,
            particleCount: Math.floor(count * particleRatio),
          });
        };

        fire(0.25, { spread: 26, startVelocity: 55 });
        fire(0.2, { spread: 60 });
        fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
        fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
        fire(0.1, { spread: 120, startVelocity: 45 });
      }
    }
  }, [isOpen, evaluation, hasWrongAnswers]);

  if (!isOpen || !evaluation) return null;

  const handleTestEarthquake = () => {
    playEarthquakeSound();
    onTriggerEarthquake();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/80 backdrop-blur-md overflow-y-auto animate-fadeIn">
      <div className={`relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden my-6 border-4 ${
        hasWrongAnswers ? 'border-amber-500' : 'border-emerald-500'
      }`}>
        {/* Top Rainbow Header Bar */}
        <div className="h-3.5 bg-gradient-to-r from-red-500 via-amber-400 via-blue-500 to-emerald-500" />

        {/* Modal Hero Banner */}
        <div className={`p-6 sm:p-8 text-center space-y-3 ${
          hasWrongAnswers
            ? 'bg-gradient-to-b from-amber-50/80 via-white to-white'
            : 'bg-gradient-to-b from-emerald-50/80 via-white to-white'
        }`}>
          {/* Badge */}
          {hasWrongAnswers ? (
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-100 text-amber-950 border-2 border-amber-400 text-xs font-mono font-black uppercase tracking-wider shadow-sm animate-bounce">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              RESULTS EVALUATED • POINTS DEDUCTED FOR WRONG ANSWERS
            </div>
          ) : (
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-100 text-emerald-950 border-2 border-emerald-400 text-xs font-mono font-black uppercase tracking-wider shadow-sm animate-bounce">
              <Trophy className="w-4 h-4 text-emerald-600" />
              FLAWLESS VICTORY • 10/10 CORRECT CHOICES!
            </div>
          )}

          <h1 className="text-3xl sm:text-4xl font-black text-slate-950 font-display tracking-tight">
            {evaluation.structureName}
          </h1>

          <p className="text-xs sm:text-sm text-slate-600 max-w-2xl mx-auto font-medium leading-relaxed">
            {evaluation.recommendation}
          </p>

          {/* Big Score Cards */}
          <div className="flex items-center justify-center gap-3 sm:gap-4 pt-3 flex-wrap">
            {/* Total Final Score */}
            <div className="p-4 rounded-2xl min-w-[130px] text-center shadow-lg bg-slate-900 text-white">
              <div className="text-[10px] font-mono uppercase text-slate-400 font-bold">
                Final Score
              </div>
              <div className="text-3xl sm:text-4xl font-black font-mono text-yellow-400">
                {evaluation.score}<span className="text-xs text-slate-400">/100</span>
              </div>
            </div>

            {/* Rank */}
            <div className={`p-4 rounded-2xl min-w-[130px] text-center shadow-lg ${
              hasWrongAnswers
                ? 'bg-gradient-to-br from-amber-500 to-orange-600 text-white'
                : 'bg-gradient-to-br from-emerald-500 to-teal-600 text-white'
            }`}>
              <div className="text-[10px] font-mono uppercase font-bold opacity-90">
                Architect Rank
              </div>
              <div className="text-3xl sm:text-4xl font-black font-display">
                {evaluation.grade}
              </div>
            </div>

            {/* Points Added */}
            <div className="p-4 rounded-2xl min-w-[110px] text-center shadow-sm bg-emerald-50 border-2 border-emerald-200 text-emerald-950">
              <div className="text-[10px] font-mono uppercase font-bold text-emerald-700 flex items-center justify-center gap-1">
                <TrendingUp className="w-3 h-3" />
                Added
              </div>
              <div className="text-2xl sm:text-3xl font-black font-mono text-emerald-700">
                +{evaluation.pointsAdded}
              </div>
            </div>

            {/* Points Deducted */}
            <div className="p-4 rounded-2xl min-w-[110px] text-center shadow-sm bg-red-50 border-2 border-red-200 text-red-950">
              <div className="text-[10px] font-mono uppercase font-bold text-red-700 flex items-center justify-center gap-1">
                <TrendingDown className="w-3 h-3" />
                Deducted
              </div>
              <div className="text-2xl sm:text-3xl font-black font-mono text-red-600">
                -{evaluation.pointsDeducted}
              </div>
            </div>

            {/* Stability */}
            <div className="p-4 rounded-2xl border-2 min-w-[110px] text-center shadow-sm bg-blue-50 border-blue-200 text-blue-950">
              <div className="text-[10px] font-mono uppercase font-bold text-blue-700">
                Stability
              </div>
              <div className="text-2xl sm:text-3xl font-black font-mono text-blue-700">
                {evaluation.earthquakeResistance}%
              </div>
            </div>
          </div>
        </div>

        {/* DETAILED RESULTS BREAKDOWN (Reveals Correct vs Wrong Choices with Points) */}
        <div className="px-5 sm:px-8 py-5 bg-slate-50 border-y-2 border-slate-200 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs sm:text-sm font-black text-slate-900 uppercase font-mono flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-blue-600" />
              Placed Blocks Detailed Breakdown ({evaluation.filledSlots} Blocks)
            </h3>
            <span className="text-xs font-mono font-bold text-slate-500">
              {evaluation.correctCount} Correct • {evaluation.wrongCount} Wrong
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[320px] overflow-y-auto pr-1 custom-visible-scrollbar">
            {evaluation.resultsBreakdown.map((item, idx) => (
              <div
                key={idx}
                className={`p-3.5 rounded-2xl border-2 transition-all flex flex-col justify-between gap-2 shadow-sm ${
                  item.isWrong
                    ? 'bg-red-50/90 border-red-300 text-red-950'
                    : 'bg-emerald-50/90 border-emerald-300 text-emerald-950'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className={`p-2 rounded-xl shrink-0 ${
                      item.isWrong ? 'bg-red-200 text-red-800' : 'bg-emerald-200 text-emerald-800'
                    }`}>
                      <DynamicIcon name={item.block.icon} className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <span className="text-[10px] font-mono uppercase font-bold opacity-75 block truncate">
                        Slot: {item.slotLabel}
                      </span>
                      <h4 className="font-black text-sm tracking-tight truncate leading-tight">
                        {item.block.title}
                      </h4>
                    </div>
                  </div>

                  {/* Score badge */}
                  <div className={`px-2.5 py-1 rounded-full font-mono text-xs font-black shrink-0 flex items-center gap-1 ${
                    item.isWrong
                      ? 'bg-red-600 text-white shadow-sm'
                      : 'bg-emerald-600 text-white shadow-sm'
                  }`}>
                    {item.isWrong ? (
                      <>
                        <XCircle className="w-3.5 h-3.5" />
                        <span>{item.scoreChange} Pts</span>
                      </>
                    ) : (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>+{item.scoreChange} Pts</span>
                      </>
                    )}
                  </div>
                </div>

                {/* Explanation text */}
                <div className={`p-2 rounded-xl text-xs leading-relaxed font-medium ${
                  item.isWrong ? 'bg-red-100/80 text-red-900 border border-red-200' : 'bg-emerald-100/80 text-emerald-900 border border-emerald-200'
                }`}>
                  <span className="font-bold mr-1">{item.isWrong ? '⚠️ Why it fails:' : '✓ Principle:'}</span>
                  {item.explanation}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 4-Color Distribution */}
        <div className="px-5 sm:px-8 py-4 bg-white border-b border-slate-200 space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-600 uppercase font-mono">
            <span>Color Spectrum Distribution</span>
            <span>{evaluation.filledSlots} of {evaluation.totalSlots} Slots Filled</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <div className="p-2.5 rounded-xl bg-red-50 border border-red-200 text-center">
              <span className="text-[10px] font-black text-red-900 block">🔴 LEADERSHIP</span>
              <span className="text-base font-black font-mono text-red-600">{evaluation.colorPercentages.red}%</span>
              <span className="text-[10px] text-red-700 block font-semibold">{evaluation.colorCounts.red} blocks</span>
            </div>

            <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-center">
              <span className="text-[10px] font-black text-amber-900 block">🟡 INNOVATION</span>
              <span className="text-base font-black font-mono text-amber-600">{evaluation.colorPercentages.yellow}%</span>
              <span className="text-[10px] text-amber-700 block font-semibold">{evaluation.colorCounts.yellow} blocks</span>
            </div>

            <div className="p-2.5 rounded-xl bg-blue-50 border border-blue-200 text-center">
              <span className="text-[10px] font-black text-blue-900 block">🔵 SYSTEMS</span>
              <span className="text-base font-black font-mono text-blue-600">{evaluation.colorPercentages.blue}%</span>
              <span className="text-[10px] text-blue-700 block font-semibold">{evaluation.colorCounts.blue} blocks</span>
            </div>

            <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-center">
              <span className="text-[10px] font-black text-emerald-900 block">🟢 CULTURE</span>
              <span className="text-base font-black font-mono text-emerald-600">{evaluation.colorPercentages.green}%</span>
              <span className="text-[10px] text-emerald-700 block font-semibold">{evaluation.colorCounts.green} blocks</span>
            </div>
          </div>
        </div>

        {/* Earthquake Simulation Test Button */}
        <div className="p-5 sm:p-6 bg-slate-900 text-white flex flex-col sm:flex-row items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-400 animate-pulse" />
              <span className="font-extrabold text-sm">
                Stress & Earthquake Simulation
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Simulate external shocks to see how stable your chosen blocks are under organizational stress!
            </p>
          </div>

          <button
            onClick={handleTestEarthquake}
            disabled={isEarthquakeActive}
            className={`
              px-5 py-2.5 rounded-2xl font-black text-xs sm:text-sm transition-all flex items-center gap-1.5 whitespace-nowrap shadow-lg
              ${isEarthquakeActive
                ? 'bg-red-600 text-white animate-pulse'
                : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 hover:scale-105 active:scale-95'
              }
            `}
          >
            <Zap className="w-4 h-4" />
            <span>{isEarthquakeActive ? 'Shaking Structure...' : 'Run Earthquake Test! ⚡'}</span>
          </button>
        </div>

        {/* Modal Footer Controls */}
        <div className="p-4 sm:p-6 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-slate-500 font-semibold text-center sm:text-left">
            Essentials of Management • 10-Block Pyramid Level
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={onReset}
              className="flex-1 sm:flex-none px-4 py-2.5 rounded-2xl border-2 border-slate-300 bg-white hover:bg-slate-100 text-slate-700 text-xs font-black transition-colors flex items-center justify-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Rebuild / Try Again
            </button>

            <button
              onClick={onClose}
              className="flex-1 sm:flex-none px-5 py-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-black transition-colors shadow-lg flex items-center justify-center gap-1.5"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              Inspect Pyramid
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
