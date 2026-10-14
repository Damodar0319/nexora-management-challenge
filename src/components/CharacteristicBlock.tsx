import React from 'react';
import { ManagementBlock, PillarId } from '../types/game';
import { DynamicIcon } from './DynamicIcon';
import { X, ArrowRight, ShieldCheck, AlertTriangle } from 'lucide-react';

interface CharacteristicBlockProps {
  block: ManagementBlock;
  isSelected?: boolean;
  isDragging?: boolean;
  isInPillar?: boolean;
  currentPillarId?: PillarId;
  onSelect?: (block: ManagementBlock) => void;
  onRemove?: (block: ManagementBlock, pillarId?: PillarId) => void;
  compact?: boolean;
  presentationMode?: boolean;
  showEvaluationState?: boolean; // Only revealed after evaluation!
}

export const CharacteristicBlock: React.FC<CharacteristicBlockProps> = ({
  block,
  isSelected = false,
  isDragging = false,
  isInPillar = false,
  currentPillarId,
  onSelect,
  onRemove,
  compact = false,
  presentationMode = false,
  showEvaluationState = false,
}) => {
  const isPositive = block.type === 'positive';

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    e.dataTransfer.setData('text/plain', JSON.stringify({
      blockId: block.id,
      sourcePillarId: currentPillarId || null,
    }));
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onSelect) {
      onSelect(block);
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onRemove) {
      onRemove(block, currentPillarId);
    }
  };

  // Format block number with leading zero
  const formattedNumber = String(block.blockNumber).padStart(2, '0');

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          if (onSelect) onSelect(block);
        }
      }}
      className={`
        relative group cursor-grab active:cursor-grabbing select-none rounded-xl transition-all duration-200
        flex flex-col justify-between
        ${compact ? 'p-3 min-h-[90px]' : presentationMode ? 'p-4 min-h-[130px]' : 'p-3.5 min-h-[110px]'}
        ${showEvaluationState
          ? isPositive
            ? 'bg-slate-900 border-2 border-emerald-500/80 shadow-glow-emerald'
            : 'bg-red-950/90 border-2 border-red-500/80 shadow-glow-rose'
          : isInPillar
            ? 'bg-slate-900/95 border-2 border-cyan-400/60 shadow-md hover:border-cyan-300'
            : 'bg-slate-900/90 border border-slate-700/80 hover:border-cyan-400 hover:bg-slate-850'
        }
        ${isSelected ? 'ring-2 ring-cyan-400 border-cyan-400 bg-slate-850 shadow-glow-cyan scale-[1.01]' : ''}
        ${isDragging ? 'opacity-40 scale-95' : 'opacity-100'}
        shadow-sm
      `}
    >
      <div>
        {/* Top Header Badge */}
        <div className="flex items-center justify-between mb-2 gap-2">
          <div className="flex items-center gap-1.5">
            <span
              className={`
                text-[11px] uppercase font-bold tracking-wider px-2 py-0.5 rounded
                ${showEvaluationState
                  ? isPositive
                    ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/50 flex items-center gap-1'
                    : 'bg-red-950 text-red-300 border border-red-500/50 flex items-center gap-1'
                  : 'bg-slate-800 text-cyan-300 border border-slate-700'
                }
              `}
            >
              {showEvaluationState ? (
                isPositive ? (
                  <>
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> #{formattedNumber} Best Practice
                  </>
                ) : (
                  <>
                    <AlertTriangle className="w-3.5 h-3.5 text-red-400" /> #{formattedNumber} Hidden Trap
                  </>
                )
              ) : (
                `#${formattedNumber} Option`
              )}
            </span>
          </div>

          {isInPillar && onRemove ? (
            <button
              type="button"
              onClick={handleRemove}
              title="Remove option back to pool"
              className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          ) : isSelected ? (
            <span className="flex items-center gap-1 text-xs font-bold text-cyan-300 animate-pulse">
              Selected <ArrowRight className="w-3.5 h-3.5" />
            </span>
          ) : null}
        </div>

        {/* Title and Icon Row */}
        <div className="flex items-start gap-2.5">
          <div
            className={`
              p-2 rounded-lg shrink-0 mt-0.5
              ${showEvaluationState
                ? isPositive
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  : 'bg-red-500/20 text-red-300 border border-red-500/40'
                : 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30'
              }
            `}
          >
            <DynamicIcon name={block.iconName} className="w-4 h-4" />
          </div>

          <div className="min-w-0 flex-1">
            <h4
              className={`
                font-bold leading-snug break-words
                ${presentationMode ? 'text-base text-white' : 'text-sm text-slate-100'}
                ${showEvaluationState && !isPositive ? 'text-red-100' : 'text-white'}
              `}
            >
              {block.title}
            </h4>
            
            {/* High-Contrast Description */}
            <p
              className={`
                mt-1.5 leading-relaxed text-slate-300 font-normal break-words
                ${presentationMode ? 'text-xs' : 'text-[12px]'}
              `}
            >
              {block.description}
            </p>
          </div>
        </div>
      </div>

      {/* Selection helper bar */}
      {isSelected && (
        <div className="mt-2.5 pt-2 border-t border-cyan-500/40 flex items-center justify-between text-xs text-cyan-300 font-semibold">
          <span>Tap any pillar above to place</span>
          <span className="px-2 py-0.5 bg-cyan-500/20 rounded text-[11px] font-mono">Ready</span>
        </div>
      )}
    </div>
  );
};
