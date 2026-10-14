import React from 'react';
import { PillarPlacements, PillarId, OverallEvaluation } from '../types/game';
import { PILLARS } from '../data/pillars';
import { DynamicIcon } from './DynamicIcon';
import { ShieldAlert, ShieldCheck, Zap, Activity, Cpu, AlertTriangle } from 'lucide-react';

interface OrganizationBlueprintProps {
  placements: PillarPlacements;
  evaluation?: OverallEvaluation | null;
  presentationMode?: boolean;
}

export const OrganizationBlueprint: React.FC<OrganizationBlueprintProps> = ({
  placements,
  evaluation,
  presentationMode = false,
}) => {
  // Compute live visual states
  const pillarStatusMap: Record<PillarId, {
    count: number;
    hasNegative: boolean;
    hasPositive: boolean;
    isOptimal: boolean;
    score: number;
    title: string;
  }> = {} as any;

  let totalConnectedPillars = 0;
  let totalNegativeBlocks = 0;

  PILLARS.forEach(p => {
    const blocks = placements[p.id] || [];
    const hasNegative = blocks.some(b => b.type === 'negative');
    const hasPositive = blocks.some(b => b.type === 'positive');
    const isOptimal = blocks.some(b => b.primaryPillar === p.id && b.type === 'positive');
    const score = evaluation?.pillarEvaluations[p.id]?.score ?? (hasNegative ? 2 : hasPositive ? (isOptimal ? 20 : 14) : 0);

    if (blocks.length > 0) totalConnectedPillars++;
    if (hasNegative) totalNegativeBlocks += blocks.filter(b => b.type === 'negative').length;

    pillarStatusMap[p.id] = {
      count: blocks.length,
      hasNegative,
      hasPositive,
      isOptimal,
      score,
      title: p.title
    };
  });

  const isEvaluated = Boolean(evaluation);
  const overallScore = evaluation?.overallScore ?? Math.round((totalConnectedPillars / 5) * 75 - (totalNegativeBlocks * 18));
  const isPerfect = isEvaluated && evaluation?.overallScore === 100;
  const isHighPerformance = isEvaluated && (evaluation?.overallScore ?? 0) >= 80;
  const isUnstable = isEvaluated ? (evaluation?.overallScore ?? 0) < 40 : totalNegativeBlocks > 0;

  return (
    <div
      className={`
        relative rounded-3xl overflow-hidden transition-all duration-500
        ${presentationMode ? 'p-6 my-4' : 'p-5 my-4'}
        bg-gradient-to-b from-nexora-900 via-nexora-950 to-slate-950
        border border-cyan-500/20 shadow-2xl
      `}
    >
      {/* Background architectural grid */}
      <div className="absolute inset-0 bg-enterprise-grid opacity-30 pointer-events-none" />

      {/* Ambient background glow */}
      <div
        className={`
          absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-48 rounded-full blur-3xl pointer-events-none transition-all duration-700
          ${isPerfect
            ? 'bg-cyan-400/25'
            : isUnstable
              ? 'bg-red-500/20'
              : totalConnectedPillars > 0
                ? 'bg-teal-500/15'
                : 'bg-slate-800/10'
          }
        `}
      />

      {/* Blueprint Header */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            <span className="text-[11px] font-mono tracking-widest text-cyan-400 uppercase font-semibold">
              Live Structural Blueprint
            </span>
          </div>
          <h2 className={`font-black tracking-tight text-white ${presentationMode ? 'text-2xl' : 'text-xl'}`}>
            NEXORA <span className="text-cyan-400 font-light">SYSTEM SCHEMATIC</span>
          </h2>
          <p className="text-xs text-slate-400">
            Real-time organizational cohesion & interconnectivity network
          </p>
        </div>

        {/* Live Diagnostics Pills */}
        <div className="flex items-center gap-2">
          <div className="px-3 py-1.5 rounded-xl bg-slate-900/90 border border-slate-700 text-right">
            <div className="text-[10px] text-slate-400 uppercase font-mono">Pillars Connected</div>
            <div className="text-sm font-bold text-cyan-300 font-mono">
              {totalConnectedPillars}/5
            </div>
          </div>

          <div
            className={`
              px-3 py-1.5 rounded-xl border text-right transition-colors
              ${isUnstable
                ? 'bg-red-950/80 border-red-500/40 text-red-300'
                : totalConnectedPillars === 5
                  ? 'bg-emerald-950/80 border-emerald-500/40 text-emerald-300'
                  : 'bg-slate-900/90 border-slate-700 text-slate-300'
              }
            `}
          >
            <div className="text-[10px] uppercase font-mono text-slate-400">System Stability</div>
            <div className="text-sm font-bold font-mono flex items-center justify-end gap-1">
              {isUnstable ? (
                <>
                  <AlertTriangle className="w-3.5 h-3.5 text-red-400" /> Degraded
                </>
              ) : totalConnectedPillars === 5 ? (
                <>
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Optimal
                </>
              ) : (
                'Incomplete'
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Blueprint Visualization Canvas */}
      <div className="relative z-10 py-6 min-h-[260px] flex flex-col justify-center">
        {/* SVG Interconnecting Beam Lines */}
        <div className="relative w-full max-w-4xl mx-auto">
          {/* Central Enterprise Core */}
          <div className="flex justify-center mb-6">
            <div
              className={`
                relative px-6 py-3 rounded-2xl flex items-center gap-3 transition-all duration-500
                ${isPerfect
                  ? 'bg-cyan-500/20 border-2 border-cyan-400 shadow-glow-cyan'
                  : isUnstable
                    ? 'bg-red-950/60 border-2 border-red-500 shadow-glow-rose'
                    : totalConnectedPillars > 0
                      ? 'bg-nexora-800/90 border border-cyan-500/40'
                      : 'bg-slate-900/60 border border-slate-800'
                }
              `}
            >
              <div
                className={`
                  p-2 rounded-xl
                  ${isPerfect
                    ? 'bg-cyan-400 text-slate-950'
                    : isUnstable
                      ? 'bg-red-500 text-white'
                      : 'bg-cyan-500/20 text-cyan-400'
                  }
                `}
              >
                <Cpu className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <div className="text-[10px] font-mono tracking-wider text-cyan-400 uppercase font-semibold">
                  Organizational Nucleus
                </div>
                <div className="text-sm font-bold text-white tracking-wide">
                  NEXORA HUMAN-CENTRED SMART CORE
                </div>
              </div>
            </div>
          </div>

          {/* 5 Structural Pillars Nodes */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {PILLARS.map((pillar) => {
              const status = pillarStatusMap[pillar.id];
              const isOccupied = status.count > 0;
              const hasNegative = status.hasNegative;
              const isOptimal = status.isOptimal;

              return (
                <div
                  key={pillar.id}
                  className={`
                    relative p-3.5 rounded-2xl flex flex-col items-center text-center transition-all duration-300
                    ${hasNegative
                      ? 'bg-red-950/40 border-2 border-red-500/60 shadow-glow-rose'
                      : isOptimal
                        ? 'bg-nexora-800/90 border-2 border-emerald-400/60 shadow-glow-emerald'
                        : isOccupied
                          ? 'bg-nexora-800/80 border border-cyan-400/40'
                          : 'bg-slate-900/40 border border-dashed border-slate-800 opacity-60'
                    }
                  `}
                >
                  {/* Status Indicator Icon */}
                  <div
                    className={`
                      w-10 h-10 rounded-xl flex items-center justify-center mb-2 transition-transform
                      ${hasNegative
                        ? 'bg-red-500/20 text-red-400'
                        : isOptimal
                          ? 'bg-emerald-500/20 text-emerald-300'
                          : isOccupied
                            ? 'bg-cyan-500/20 text-cyan-300'
                            : 'bg-slate-800 text-slate-500'
                      }
                    `}
                  >
                    <DynamicIcon name={pillar.iconName} className="w-5 h-5" />
                  </div>

                  {/* Title */}
                  <div className="font-bold text-xs uppercase tracking-wider text-slate-100 truncate w-full">
                    {pillar.title}
                  </div>

                  {/* Node State Pill */}
                  <div className="mt-2 w-full">
                    {hasNegative ? (
                      <span className="inline-flex items-center gap-1 text-[9px] font-bold px-2 py-0.5 rounded bg-red-950 text-red-400 border border-red-600/50">
                        <AlertTriangle className="w-2.5 h-2.5" /> Fault Line
                      </span>
                    ) : isOptimal ? (
                      <span className="inline-flex items-center gap-1 text-[9px] font-bold px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-600/50">
                        <Zap className="w-2.5 h-2.5" /> Max Synergy
                      </span>
                    ) : isOccupied ? (
                      <span className="inline-flex items-center gap-1 text-[9px] font-medium px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-700/50">
                        Connected
                      </span>
                    ) : (
                      <span className="text-[9px] font-medium text-slate-500">
                        Awaiting Blocks
                      </span>
                    )}
                  </div>

                  {/* Structural Bridge Bar */}
                  <div className="w-full bg-slate-800/80 h-1.5 rounded-full mt-2.5 overflow-hidden">
                    <div
                      className={`
                        h-full transition-all duration-500 rounded-full
                        ${hasNegative
                          ? 'bg-red-500 w-full'
                          : isOptimal
                            ? 'bg-emerald-400 w-full'
                            : isOccupied
                              ? 'bg-cyan-400 w-3/4'
                              : 'bg-slate-700 w-0'
                        }
                      `}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Blueprint Dynamic State Summary Banner */}
      <div
        className={`
          relative z-10 p-3 rounded-xl flex items-center justify-between text-xs transition-colors
          ${isPerfect
            ? 'bg-cyan-950/70 border border-cyan-400 text-cyan-200'
            : isUnstable
              ? 'bg-red-950/60 border border-red-500/50 text-red-200'
              : totalConnectedPillars === 5
                ? 'bg-emerald-950/50 border border-emerald-500/40 text-emerald-200'
                : 'bg-slate-900/80 border border-slate-800 text-slate-400'
          }
        `}
      >
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 shrink-0 text-cyan-400" />
          <span>
            {isPerfect
              ? '★ SYSTEM HARMONY: NEXORA has achieved the Ideal 100/100 Benchmark with fully synchronized pillars!'
              : isUnstable
                ? '⚠ ALERT: Destructive management traps are compromising structural integrity. Immediate remediation advised.'
                : totalConnectedPillars === 5
                  ? '✔ Structural framework complete. Click "Evaluate My Organization" to review management effectiveness.'
                  : `Construction in progress: ${5 - totalConnectedPillars} pillars require management assignments.`
            }
          </span>
        </div>

        <div className="hidden sm:block font-mono text-[11px] text-slate-400">
          NODE MATRIX V2.4
        </div>
      </div>
    </div>
  );
};
