import React from 'react';
import { GameBlock } from '../types/game';
import { DynamicIcon } from './DynamicIcon';
import { X, ArrowUpRight } from 'lucide-react';
import { playClickSound } from '../utils/sound';

interface BlockPieceProps {
  block: GameBlock;
  isSelected?: boolean;
  isInSlot?: boolean;
  compact?: boolean;
  onSelect?: (block: GameBlock) => void;
  onQuickPlace?: (block: GameBlock) => void;
  onRemove?: () => void;
  draggable?: boolean;
}

export const BlockPiece: React.FC<BlockPieceProps> = ({
  block,
  isSelected = false,
  isInSlot = false,
  compact = false,
  onSelect,
  onQuickPlace,
  onRemove,
  draggable = true,
}) => {
  // All blocks have identical styling per color — wrong answers are identical in appearance!
  const getColorClasses = () => {
    switch (block.color) {
      case 'red':
        return 'block-3d-red text-white';
      case 'yellow':
        return 'block-3d-yellow text-slate-900';
      case 'blue':
        return 'block-3d-blue text-white';
      case 'green':
        return 'block-3d-green text-white';
    }
  };

  const getStudColor = () => {
    switch (block.color) {
      case 'red':
        return 'bg-red-200/50 border-red-500/30';
      case 'yellow':
        return 'bg-yellow-100/60 border-yellow-400/40';
      case 'blue':
        return 'bg-blue-200/50 border-blue-400/30';
      case 'green':
        return 'bg-emerald-100/50 border-emerald-400/30';
    }
  };

  const getColorName = () => {
    switch (block.color) {
      case 'red': return '🔴 Leadership';
      case 'yellow': return '🟡 Innovation';
      case 'blue': return '🔵 Systems';
      case 'green': return '🟢 People';
    }
  };

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    playClickSound();
    e.dataTransfer.setData('text/plain', JSON.stringify({ blockId: block.id }));
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    playClickSound();
    if (onSelect) {
      onSelect(block);
    }
  };

  const handleQuickPlaceClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    playClickSound();
    if (onQuickPlace) {
      onQuickPlace(block);
    } else if (onSelect) {
      onSelect(block);
    }
  };

  const handleRemoveClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onRemove) {
      onRemove();
    }
  };

  // Compact rendering inside a structure slot
  if (isInSlot || compact) {
    return (
      <div
        draggable={draggable}
        onDragStart={handleDragStart}
        onClick={handleClick}
        className={`
          relative w-full h-full min-h-[76px] sm:min-h-[86px] p-3 rounded-2xl cursor-grab active:cursor-grabbing
          flex flex-col justify-between transition-all duration-200 select-none
          ${getColorClasses()}
          ${isSelected ? 'ring-4 ring-offset-2 ring-blue-500 scale-[1.02]' : 'hover:scale-[1.02]'}
        `}
      >
        {/* Shiny 3D Brick Studs on top */}
        <div className="absolute -top-2 left-1/2 -translate-x-1/2 flex items-center gap-3 pointer-events-none">
          <div className={`w-4 h-2 rounded-full brick-stud ${getStudColor()}`} />
          <div className={`w-4 h-2 rounded-full brick-stud ${getStudColor()}`} />
        </div>

        <div className="flex items-start justify-between gap-1.5">
          <div className="flex items-center gap-2 min-w-0">
            <div className="p-1.5 rounded-xl shrink-0 shadow-inner bg-black/20">
              <DynamicIcon name={block.icon} className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <span className="font-black text-xs sm:text-sm tracking-tight truncate leading-tight block drop-shadow-sm">
                {block.title}
              </span>
            </div>
          </div>

          {onRemove && (
            <button
              onClick={handleRemoveClick}
              title="Remove block back to tray"
              className="p-1 -mr-1 -mt-1 rounded-full transition-transform hover:scale-110 active:scale-90 bg-black/25 hover:bg-black/50 text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div className="flex items-center justify-between text-[11px] font-semibold opacity-95 pt-1 border-t border-black/15">
          <span className="truncate text-[10px] font-medium tracking-tight">
            {block.subtitle}
          </span>
          <span className="shrink-0 px-2 py-0.5 rounded-full font-mono text-[10px] font-black bg-black/20">
            +{block.power}pt
          </span>
        </div>
      </div>
    );
  }

  // Full Card in Inventory Tray
  return (
    <div
      draggable={draggable}
      onDragStart={handleDragStart}
      onClick={handleClick}
      className={`
        group relative p-4 rounded-3xl cursor-grab active:cursor-grabbing select-none
        flex flex-col justify-between min-h-[132px] transition-all duration-200
        ${getColorClasses()}
        ${isSelected ? 'ring-4 ring-offset-2 ring-slate-900 scale-105 shadow-2xl' : 'hover:-translate-y-1.5 hover:shadow-2xl'}
      `}
    >
      {/* 3D Toy Brick Studs */}
      <div className="absolute -top-2.5 left-7 flex items-center gap-3.5 pointer-events-none">
        <div className={`w-5 h-2.5 rounded-full brick-stud ${getStudColor()}`} />
        <div className={`w-5 h-2.5 rounded-full brick-stud ${getStudColor()}`} />
      </div>

      <div>
        <div className="flex items-center justify-between gap-2 mb-2">
          <span className="text-[11px] font-bold font-mono tracking-wide px-2.5 py-0.5 rounded-full backdrop-blur-sm bg-black/15">
            {getColorName()}
          </span>

          <span className="text-[11px] font-black px-2 py-0.5 rounded-full font-mono bg-black/20">
            +{block.power} pts
          </span>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-2xl shadow-inner shrink-0 bg-black/20">
            <DynamicIcon name={block.icon} className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-black text-sm sm:text-base leading-tight tracking-tight drop-shadow-sm">
              {block.title}
            </h4>
            <p className="text-xs font-medium opacity-90 mt-0.5 leading-snug">
              {block.subtitle}
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Action Footer */}
      <div className="mt-3 pt-2.5 border-t border-black/15 flex items-center justify-between">
        <span className="text-[10px] font-bold opacity-80 truncate">
          {block.principle}
        </span>

        {/* 1-Click Quick Place Button */}
        <button
          onClick={handleQuickPlaceClick}
          className="px-2.5 py-1 rounded-xl font-extrabold text-[11px] transition-all flex items-center gap-1 shadow-sm hover:scale-105 active:scale-95 bg-white/25 hover:bg-white/40 text-current"
          title="Place into structure"
        >
          <span>{isSelected ? 'Selected' : 'Place'}</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
