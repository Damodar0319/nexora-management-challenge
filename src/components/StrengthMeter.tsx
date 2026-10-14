import React, { useEffect, useState } from 'react';
import { OverallEvaluation } from '../types/game';
import { Award, Zap, AlertTriangle, ShieldCheck, CheckCircle2, TrendingUp } from 'lucide-react';

interface StrengthMeterProps {
  evaluation?: OverallEvaluation | null;
  blocksPlacedCount: number;
  pillarsCompletedCount: number;
  minBlocksRequired?: number;
  presentationMode?: boolean;
}

export const StrengthMeter: React.FC<StrengthMeterProps> = ({
  evaluation,
  blocksPlacedCount,
  pillarsCompletedCount,
  minBlocksRequired = 5,
  presentationMode = false,
}) => {
  const [animatedScore, setAnimatedScore] = useState(0);

  useEffect(() => {
    if (evaluation) {
      const target = evaluation.overallScore;
      let start = 0;
      const stepTime = 16;
      const totalSteps = 40;
      const increment = target / totalSteps;
      let currentStep = 0;

      const timer = setInterval(() => {
        currentStep++;
        start += increment;
        if (currentStep >= totalSteps) {
          setAnimatedScore(target);
          clearInterval(timer);
        } else {
          setAnimatedScore(Math.round(start));
        }
      }, stepTime);

      return () => clearInterval(timer);
    } else {
      setAnimatedScore(0);
    }
  }, [evaluation]);

  const isEvaluated = Boolean(evaluation);

  const getTierColor = (score: number) => {
    if (score < 40) return 'text-red-400 bg-red-950/80 border-red-500/50';
    if (score < 60) return 'text-amber-400 bg-amber-950/80 border-amber-500/50';
    if (score < 80) return 'text-cyan-300 bg-cyan-950/80 border-cyan-500/50';
    if (score < 100) return 'text-emerald-300 bg-emerald-950/80 border-emerald-500/50';
    return 'text-white bg-gradient-to-r from-cyan-600 to-emerald-600 border-cyan-400 shadow-glow-cyan';
  };

  const getBarFill = (score: number) => {
    if (score < 40) return 'bg-gradient-to-r from-red-600 to-red-500';
    if (score < 60) return 'bg-gradient-to-r from-amber-600 to-amber-500';
    if (score < 80) return 'bg-gradient-to-r from-cyan-600 to-cyan-400';
    if (score < 100) return 'bg-gradient-to-r from-emerald-600 to-emerald-400';
    return 'bg-gradient-to-r from-cyan-400 via-emerald-400 to-teal-300';
  };

  return (
    <div
      className={`
        glass-panel rounded-2xl transition-all duration-300
        ${presentationMode ? 'p-5' : 'p-4'}
        border border-cyan-500/20 shadow-xl
      `}
    >
      <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
        <div>
          <div className="text-[10px] font-mono tracking-wider text-cyan-400 uppercase font-semibold">
            Metric Assessment Engine
          </div>
          <h3 className={`font-black tracking-tight text-white ${presentationMode ? 'text-xl' : 'text-lg'}`}>
            ORGANIZATION EFFECTIVENESS
          </h3>
        </div>

        {/* Current status pill */}
        <div>
          {isEvaluated ? (
            <div
              className={`
                px-3 py-1.5 rounded-xl border text-xs font-bold uppercase tracking-wider flex items-center gap-1.5
                ${getTierColor(evaluation!.overallScore)}
              `}
            >
              {evaluation!.overallScore === 100 ? (
                <Award className="w-4 h-4 text-amber-300" />
              ) : evaluation!.overallScore >= 80 ? (
                <ShieldCheck className="w-4 h-4" />
              ) : evaluation!.overallScore < 40 ? (
                <AlertTriangle className="w-4 h-4" />
              ) : (
                <TrendingUp className="w-4 h-4" />
              )}
              {evaluation!.statusTier}
            </div>
          ) : (
            <div className="px-3 py-1.5 rounded-xl border border-slate-700 bg-slate-900 text-xs font-mono text-slate-300">
              BUILD PHASE • STRATEGIC ASSEMBLY
            </div>
          )}
        </div>
      </div>

      {/* Progress or Score Bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-medium">
          {isEvaluated ? (
            <>
              <span className="text-slate-400 font-mono">
                SCORE: <strong className="text-white text-base">{animatedScore}</strong> / 100
              </span>
              <span className="text-xs text-slate-400">
                {evaluation!.statusTier}
              </span>
            </>
          ) : (
            <>
              <span className="text-slate-300">
                Pillars Configured: <strong className="text-cyan-400">{pillarsCompletedCount} / 5</strong>
              </span>
              <span className="text-slate-400 font-mono">
                {blocksPlacedCount >= minBlocksRequired
                  ? `${blocksPlacedCount} policies assigned (Ready to Evaluate)`
                  : `${minBlocksRequired - blocksPlacedCount} more required to evaluate (${blocksPlacedCount}/5)`
                }
              </span>
            </>
          )}
        </div>

        {/* The Progress / Meter Bar */}
        <div className="w-full bg-slate-900 rounded-full h-3.5 p-0.5 border border-slate-700/80 overflow-hidden relative">
          <div
            className={`
              h-full rounded-full transition-all duration-700
              ${isEvaluated
                ? getBarFill(evaluation!.overallScore)
                : 'bg-gradient-to-r from-teal-500 to-cyan-400'
              }
            `}
            style={{
              width: isEvaluated
                ? `${animatedScore}%`
                : `${Math.min(100, (blocksPlacedCount / minBlocksRequired) * 100)}%`
            }}
          />

          {/* Benchmark Target at 100 */}
          <div className="absolute right-0 top-0 bottom-0 w-1 bg-cyan-300 opacity-60" />
        </div>
      </div>

      {/* Benchmarks Scale (0-100 Stages Reference) */}
      <div className="mt-3 pt-3 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-5 gap-2 text-center text-[10px]">
        <div className={`p-1 rounded ${isEvaluated && evaluation!.overallScore < 40 ? 'bg-red-950/80 text-red-300 font-bold border border-red-500/50' : 'text-slate-500'}`}>
          0–39: UNSTABLE
        </div>
        <div className={`p-1 rounded ${isEvaluated && evaluation!.overallScore >= 40 && evaluation!.overallScore < 60 ? 'bg-amber-950/80 text-amber-300 font-bold border border-amber-500/50' : 'text-slate-500'}`}>
          40–59: DEVELOPING
        </div>
        <div className={`p-1 rounded ${isEvaluated && evaluation!.overallScore >= 60 && evaluation!.overallScore < 80 ? 'bg-cyan-950/80 text-cyan-300 font-bold border border-cyan-500/50' : 'text-slate-500'}`}>
          60–79: EFFECTIVE
        </div>
        <div className={`p-1 rounded ${isEvaluated && evaluation!.overallScore >= 80 && evaluation!.overallScore < 100 ? 'bg-emerald-950/80 text-emerald-300 font-bold border border-emerald-500/50' : 'text-slate-500'}`}>
          80–99: HIGH-PERF
        </div>
        <div className={`p-1 rounded ${isEvaluated && evaluation!.overallScore === 100 ? 'bg-cyan-500/30 text-cyan-200 font-black border border-cyan-400 shadow-glow-cyan' : 'text-slate-500'}`}>
          100: IDEAL
        </div>
      </div>
    </div>
  );
};
