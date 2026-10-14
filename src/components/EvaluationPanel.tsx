import React, { useState } from 'react';
import { OverallEvaluation, PillarId } from '../types/game';
import { PILLARS } from '../data/pillars';
import { DynamicIcon } from './DynamicIcon';
import { CheckCircle2, AlertTriangle, ChevronDown, ChevronUp, BookOpen, Lightbulb } from 'lucide-react';

interface EvaluationPanelProps {
  evaluation: OverallEvaluation;
  presentationMode?: boolean;
}

export const EvaluationPanel: React.FC<EvaluationPanelProps> = ({
  evaluation,
  presentationMode = false,
}) => {
  const [expandedPillar, setExpandedPillar] = useState<PillarId | null>(null);

  const toggleExpand = (pillarId: PillarId) => {
    setExpandedPillar(prev => (prev === pillarId ? null : pillarId));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between pb-2 border-b border-slate-800">
        <div>
          <h3 className={`font-black text-white tracking-tight uppercase ${presentationMode ? 'text-xl' : 'text-lg'}`}>
            Detailed Pillar Evaluation & Feedback
          </h3>
          <p className="text-xs text-slate-400">
            Click any pillar to inspect the management principles and feedback rationale
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {PILLARS.map((pillar) => {
          const evalItem = evaluation.pillarEvaluations[pillar.id];
          if (!evalItem) return null;

          const isExpanded = expandedPillar === pillar.id;
          const hasRisk = evalItem.hasRisk;
          const isHigh = evalItem.score >= 16;

          return (
            <div
              key={pillar.id}
              className={`
                rounded-2xl border transition-all duration-200 overflow-hidden
                ${hasRisk
                  ? 'bg-red-950/20 border-red-500/40'
                  : isHigh
                    ? 'bg-slate-900/90 border-emerald-500/40'
                    : 'bg-slate-900/70 border-slate-700/60'
                }
              `}
            >
              {/* Pillar Header Card Row */}
              <button
                type="button"
                onClick={() => toggleExpand(pillar.id)}
                className="w-full p-4 flex items-center justify-between text-left hover:bg-slate-800/40 transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`
                      p-2.5 rounded-xl shrink-0
                      ${hasRisk ? 'bg-red-500/20 text-red-400' : 'bg-slate-800 text-cyan-400'}
                    `}
                    style={{ color: hasRisk ? '#EF4444' : pillar.accentColor }}
                  >
                    <DynamicIcon name={pillar.iconName} className="w-5 h-5" />
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm sm:text-base text-white uppercase tracking-wide">
                        {pillar.title}
                      </span>
                      <span
                        className={`
                          text-[10px] font-bold px-2 py-0.5 rounded-full uppercase
                          ${hasRisk
                            ? 'bg-red-950 text-red-400 border border-red-500/40'
                            : isHigh
                              ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
                              : 'bg-slate-800 text-slate-300'
                          }
                        `}
                      >
                        {evalItem.rating}
                      </span>
                    </div>

                    <div className="text-xs text-slate-400 truncate mt-0.5">
                      {evalItem.placedBlocks.length > 0
                        ? `Placed: ${evalItem.placedBlocks.map(b => b.title).join(', ')}`
                        : 'No characteristics assigned'
                      }
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <div className="text-right">
                    <div className="text-xs font-mono text-slate-400">Score</div>
                    <div className="font-bold font-mono text-sm sm:text-base text-white">
                      {evalItem.score} <span className="text-slate-500 text-xs">/ 20</span>
                    </div>
                  </div>

                  <div className="p-1 rounded-lg bg-slate-800/60 text-slate-400">
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </div>
              </button>

              {/* Expanded Detailed Breakdown */}
              {isExpanded && (
                <div className="p-4 pt-2 border-t border-slate-800/80 space-y-3 bg-slate-950/40 text-xs leading-relaxed">
                  {/* Feedback Explanation */}
                  <div className="space-y-1">
                    <div className="font-semibold text-slate-300 flex items-center gap-1.5 text-xs">
                      {hasRisk ? (
                        <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
                      ) : (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      )}
                      <span>Management Analysis:</span>
                    </div>
                    <p className="text-slate-300 pl-5 leading-normal">
                      {evalItem.feedback}
                    </p>
                  </div>

                  {/* Management Principle */}
                  <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 flex items-start gap-2.5">
                    <BookOpen className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-cyan-300 uppercase tracking-wider text-[10px] font-mono block">
                        Management Principle Involved
                      </strong>
                      <span className="text-slate-200 font-medium">
                        {evalItem.managementPrinciple}
                      </span>
                    </div>
                  </div>

                  {/* Suggestion for Improvement */}
                  {evalItem.suggestion && (
                    <div className="p-3 rounded-xl bg-teal-950/30 border border-teal-500/30 flex items-start gap-2.5">
                      <Lightbulb className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-amber-300 uppercase tracking-wider text-[10px] font-mono block">
                          Suggested Management Enhancement
                        </strong>
                        <span className="text-slate-300">
                          {evalItem.suggestion}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
