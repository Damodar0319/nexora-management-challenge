import React from 'react';
import { ManagementBlock, PillarId } from '../types/game';
import { DynamicIcon } from './DynamicIcon';
import { X, Sparkles, AlertOctagon, Check, ArrowRight } from 'lucide-react';

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
        ${compact ? 'p-2.5' : presentationMode ? 'p-4' : 'p-3.5'}
        ${isInPillar
          ? isPositive
            ? 'bg-slate-900/90 border-2 border-emerald-500/50 hover:border-emerald-400 shadow-sm'
            : 'bg-red-950/80 border-2 border-red-500/60 hover:border-red-400 shadow-sm'
          : isPositive
            ? 'bg-nexora-800/90 border border-cyan-500/30 hover:border-cyan-400 hover:bg-nexora-750'
            : 'bg-slate-900/90 border border-amber-600/40 hover:border-amber-400 hover:bg-amber-950/40'
        }
        ${isSelected ? 'ring-4 ring-cyan-400 shadow-glow-cyan scale-[1.02] bg-nexora-750' : ''}
        ${isDragging ? 'opacity-40 scale-95' : 'opacity-100'}
        shadow-md
      `}
    >
      {/* Top badges */}
      <div className="flex items-center justify-between mb-1.5 gap-2">
        <div className="flex items-center gap-1.5">
          <span
            className={`
              text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded
              ${isPositive
                ? 'bg-cyan-950/80 text-cyan-300 border border-cyan-500/30'
                : 'bg-red-950/90 text-red-300 border border-red-500/30'
              }
            `}
          >
            #{block.blockNumber} {isPositive ? 'Practice' : 'Trap'}
          </span>
        </div>

        {isInPillar && onRemove ? (
          <button
            type="button"
            onClick={handleRemove}
            title="Remove block back to bench"
            className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        ) : isSelected ? (
          <span className="flex items-center gap-1 text-[11px] font-semibold text-cyan-300 animate-pulse">
            Active <ArrowRight className="w-3 h-3" />
          </span>
        ) : null}
      </div>

      {/* Main Title & Icon */}
      <div className="flex items-start gap-2.5">
        <div
          className={`
            p-2 rounded-lg shrink-0 mt-0.5
            ${isPositive
              ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
              : 'bg-red-500/10 text-red-400 border border-red-500/20'
            }
          `}
        >
          <DynamicIcon name={block.iconName} className="w-4 h-4" />
        </div>

        <div className="min-w-0 flex-1">
          <h4
            className={`
              font-semibold leading-snug tracking-tight truncate
              ${presentationMode ? 'text-base font-bold' : 'text-sm'}
              ${isPositive ? 'text-slate-100' : 'text-amber-100'}
            `}
            title={block.title}
          >
            {block.title}
          </h4>
          <p
            className={`
              text-slate-400 mt-1 line-clamp-2 leading-relaxed
              ${presentationMode ? 'text-xs' : 'text-[11px]'}
            `}
          >
            {block.description}
          </p>
        </div>
      </div>

      {/* Selection helper bar */}
      {isSelected && (
        <div className="mt-2 pt-2 border-t border-cyan-500/30 flex items-center justify-between text-[11px] text-cyan-300 font-medium">
          <span>Tap a pillar to place</span>
          <span className="px-1.5 py-0.5 bg-cyan-500/20 rounded text-[10px]">Ready</span>
        </div>
      )}
    </div>
  );
};
