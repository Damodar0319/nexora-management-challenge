import React, { useEffect } from 'react';
import { OverallEvaluation, PillarPlacements } from '../types/game';
import { OrganizationBlueprint } from './OrganizationBlueprint';
import { EvaluationPanel } from './EvaluationPanel';
import { Award, RotateCcw, Edit3, ArrowUpRight, AlertTriangle, ShieldCheck, CheckCircle2, TrendingUp, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

interface ResultsScreenProps {
  evaluation: OverallEvaluation;
  placements: PillarPlacements;
  onImproveOrganization: () => void;
  onPlayAgain: () => void;
  presentationMode?: boolean;
}

export const ResultsScreen: React.FC<ResultsScreenProps> = ({
  evaluation,
  placements,
  onImproveOrganization,
  onPlayAgain,
  presentationMode = false,
}) => {
  const isPerfect = evaluation.overallScore === 100;
  const isHighPerforming = evaluation.overallScore >= 80;

  useEffect(() => {
    if (isPerfect) {
      // Big celebratory fireworks
      const end = Date.now() + 2.5 * 1000;
      const colors = ['#00F0FF', '#10B981', '#FBBF24', '#38BDF8'];

      (function frame() {
        confetti({
          particleCount: 4,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors
        });
        confetti({
          particleCount: 4,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      })();
    } else if (isHighPerforming) {
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  }, [isPerfect, isHighPerforming]);

  return (
    <div className="max-w-5xl mx-auto py-6 px-4 space-y-8 animate-fadeIn">
      {/* Top Banner */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-950/80 border border-cyan-400 text-cyan-300 text-xs font-mono uppercase tracking-widest">
          {isPerfect ? (
            <>
              <Sparkles className="w-3.5 h-3.5 text-amber-300" /> Ideal Organization Benchmark Achieved
            </>
          ) : (
            'Enterprise Diagnostic Audit Complete'
          )}
        </div>

        <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white uppercase font-display">
          YOUR NEXORA <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400">ORGANIZATION</span>
        </h1>

        <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto">
          {evaluation.tierDescription}
        </p>
      </div>

      {/* Main Score & Status Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Large Score Card */}
        <div className="glass-panel p-6 rounded-3xl flex flex-col items-center justify-center text-center space-y-2 border-cyan-500/30 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />
          <div className="text-xs uppercase font-mono tracking-widest text-slate-400 font-semibold">
            Organization Effectiveness
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-6xl sm:text-7xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400">
              {evaluation.overallScore}
            </span>
            <span className="text-xl font-bold text-slate-500 font-mono">/ 100</span>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 border border-slate-700 text-xs font-bold text-slate-200 mt-2">
            Status: {evaluation.statusTier}
          </div>
        </div>

        {/* Pillars Extremes Card */}
        <div className="glass-panel p-6 rounded-3xl flex flex-col justify-between space-y-4 border-slate-800">
          <div>
            <div className="text-xs uppercase font-mono tracking-wider text-slate-400 mb-1">
              Strongest Pillar
            </div>
            <div className="flex items-center justify-between">
              <span className="font-bold text-lg text-emerald-400 uppercase">
                {evaluation.strongestPillar.name}
              </span>
              <span className="text-xs font-mono font-bold px-2 py-1 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/40">
                {evaluation.strongestPillar.score} / 20
              </span>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800">
            <div className="text-xs uppercase font-mono tracking-wider text-slate-400 mb-1">
              Weakest Pillar
            </div>
            <div className="flex items-center justify-between">
              <span className="font-bold text-lg text-amber-400 uppercase">
                {evaluation.weakestPillar.name}
              </span>
              <span className="text-xs font-mono font-bold px-2 py-1 rounded bg-amber-950 text-amber-300 border border-amber-500/40">
                {evaluation.weakestPillar.score} / 20
              </span>
            </div>
          </div>
        </div>

        {/* Best Decision / Biggest Risk Card */}
        <div className="glass-panel p-6 rounded-3xl flex flex-col justify-between space-y-4 border-slate-800">
          <div>
            <div className="text-xs uppercase font-mono tracking-wider text-cyan-400 mb-1 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" /> Best Management Decision
            </div>
            {evaluation.bestDecision ? (
              <div>
                <strong className="text-white text-sm block">
                  {evaluation.bestDecision.blockTitle} → {evaluation.bestDecision.pillarName}
                </strong>
                <p className="text-xs text-slate-400 mt-0.5 line-clamp-2">
                  {evaluation.bestDecision.reason}
                </p>
              </div>
            ) : (
              <p className="text-xs text-slate-500 italic">No positive synergies identified.</p>
            )}
          </div>

          <div className="pt-3 border-t border-slate-800">
            <div className="text-xs uppercase font-mono tracking-wider text-red-400 mb-1 flex items-center gap-1">
              <AlertTriangle className="w-3.5 h-3.5 text-red-400" /> Biggest Management Risk
            </div>
            {evaluation.biggestRisk ? (
              <div>
                <strong className="text-red-300 text-sm block">
                  {evaluation.biggestRisk.blockTitle} ({evaluation.biggestRisk.pillarName})
                </strong>
                <p className="text-xs text-red-400/90 mt-0.5 line-clamp-2">
                  {evaluation.biggestRisk.risk}
                </p>
              </div>
            ) : (
              <p className="text-xs text-emerald-400 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> No harmful management traps detected!
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Visual Organization Blueprint in Final State */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-white uppercase tracking-wide">
            Final Architectural State
          </h3>
          <span className="text-xs text-slate-400 font-mono">
            {isPerfect ? '100% Cohesive Mesh' : `${evaluation.overallScore}% Structural Efficiency`}
          </span>
        </div>

        <OrganizationBlueprint
          placements={placements}
          evaluation={evaluation}
          presentationMode={presentationMode}
        />
      </div>

      {/* Recommended Improvements Box */}
      <div className="glass-panel p-5 rounded-2xl border-cyan-500/20 space-y-3">
        <h3 className="font-bold text-white text-sm uppercase tracking-wider flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-cyan-400" /> Strategic Recommendations
        </h3>
        <ul className="space-y-2 text-xs text-slate-300">
          {evaluation.recommendedImprovements.map((rec, index) => (
            <li key={index} className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 shrink-0" />
              <span>{rec}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Detailed Pillar Evaluation Accordion */}
      <EvaluationPanel
        evaluation={evaluation}
        presentationMode={presentationMode}
      />

      {/* Presentation Closing Takeaway */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-cyan-950/40 via-teal-950/40 to-slate-950/40 border border-cyan-500/30 text-center space-y-2">
        <p className="text-sm sm:text-base text-cyan-200 font-medium italic">
          &ldquo;An ideal organization is not one without problems, but one that manages its people, resources, and changes effectively.&rdquo;
        </p>
        <p className="text-xs text-slate-400 uppercase tracking-widest font-mono">
          NEXORA Management Challenge • Essentials of Management
        </p>
      </div>

      {/* Action Buttons as requested */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
        <button
          type="button"
          onClick={onImproveOrganization}
          className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-teal-500 text-slate-950 font-bold text-base uppercase tracking-wider hover:brightness-110 active:scale-95 transition-all shadow-glow-cyan flex items-center justify-center gap-2"
        >
          <Edit3 className="w-5 h-5" />
          <span>IMPROVE MY ORGANIZATION</span>
        </button>

        <button
          type="button"
          onClick={onPlayAgain}
          className="w-full sm:w-auto px-8 py-4 rounded-2xl glass-panel text-slate-300 hover:text-white hover:border-slate-500 font-bold text-base uppercase tracking-wider active:scale-95 transition-all flex items-center justify-center gap-2"
        >
          <RotateCcw className="w-5 h-5" />
          <span>PLAY AGAIN</span>
        </button>
      </div>
    </div>
  );
};
