import React, { useState, useMemo } from 'react';
import { GameBlock, BlockColor } from '../types/game';
import { BlockPiece } from './BlockPiece';
import { 
  Search, 
  Sparkles, 
  Plus, 
  Wand2, 
  CheckCircle,
  ArrowUpRight
} from 'lucide-react';
import { playClickSound } from '../utils/sound';

interface BlockInventoryProps {
  blocks: GameBlock[];
  selectedBlock: GameBlock | null;
  placedBlockIds: Set<string>;
  onSelectBlock: (block: GameBlock | null) => void;
  onQuickPlaceBlock: (block: GameBlock) => void;
  onOpenCustomBlockModal: () => void;
  onAutoFill: () => void;
}

export const BlockInventory: React.FC<BlockInventoryProps> = ({
  blocks,
  selectedBlock,
  placedBlockIds,
  onSelectBlock,
  onQuickPlaceBlock,
  onOpenCustomBlockModal,
  onAutoFill,
}) => {
  const [activeTab, setActiveTab] = useState<'all' | BlockColor>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredBlocks = useMemo(() => {
    return blocks.filter((b) => {
      if (activeTab !== 'all' && b.color !== activeTab) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          b.title.toLowerCase().includes(q) ||
          b.subtitle.toLowerCase().includes(q) ||
          b.description.toLowerCase().includes(q) ||
          b.principle.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [blocks, activeTab, searchQuery]);

  const handleTabChange = (tab: 'all' | BlockColor) => {
    playClickSound();
    setActiveTab(tab);
  };

  const colorCounts = {
    all: blocks.length,
    red: blocks.filter(b => b.color === 'red').length,
    yellow: blocks.filter(b => b.color === 'yellow').length,
    blue: blocks.filter(b => b.color === 'blue').length,
    green: blocks.filter(b => b.color === 'green').length,
  };

  return (
    <div className="bg-white border-4 border-slate-100 rounded-[32px] p-4 sm:p-7 shadow-2xl space-y-4">
      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b-2 border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-amber-400 animate-ping" />
            <span className="text-xs font-mono font-black uppercase tracking-wider text-slate-500">
              Attributes Palette (5 per Color)
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight font-display mt-0.5">
            Choose Your Management Blocks
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            Each color has 5 choices. Choose carefully — wrong choices will deduct points when results are checked!
          </p>
        </div>

        {/* Quick action button */}
        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <button
            onClick={onOpenCustomBlockModal}
            className="px-3.5 py-2 rounded-2xl border-2 border-blue-400 bg-blue-50 hover:bg-blue-100 text-blue-900 text-xs sm:text-sm font-black transition-all flex items-center justify-center gap-1 shadow-sm hover:scale-105"
          >
            <Plus className="w-4 h-4 text-blue-600" />
            <span>+ Custom Block</span>
          </button>
        </div>
      </div>

      {/* 4-Color Category Filter Tabs */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
        {/* Colorful Segment Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {/* ALL */}
          <button
            onClick={() => handleTabChange('all')}
            className={`
              px-3.5 py-2 rounded-2xl text-xs sm:text-sm font-black transition-all whitespace-nowrap flex items-center gap-1.5
              ${activeTab === 'all'
                ? 'bg-slate-900 text-white shadow-lg scale-105'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }
            `}
          >
            <span>🌈 All ({colorCounts.all})</span>
          </button>

          {/* 🔴 RED */}
          <button
            onClick={() => handleTabChange('red')}
            className={`
              px-3.5 py-2 rounded-2xl text-xs sm:text-sm font-black transition-all whitespace-nowrap flex items-center gap-1.5
              ${activeTab === 'red'
                ? 'bg-red-500 text-white shadow-lg ring-4 ring-red-300 scale-105'
                : 'bg-red-50 hover:bg-red-100 text-red-700 border-2 border-red-200'
              }
            `}
          >
            <span>🔴 Leadership</span>
            <span className="text-[11px] px-2 py-0.2 rounded-full bg-black/15 font-mono">
              {colorCounts.red}
            </span>
          </button>

          {/* 🟡 YELLOW */}
          <button
            onClick={() => handleTabChange('yellow')}
            className={`
              px-3.5 py-2 rounded-2xl text-xs sm:text-sm font-black transition-all whitespace-nowrap flex items-center gap-1.5
              ${activeTab === 'yellow'
                ? 'bg-amber-400 text-slate-950 shadow-lg ring-4 ring-amber-200 scale-105'
                : 'bg-amber-50 hover:bg-amber-100 text-amber-900 border-2 border-amber-200'
              }
            `}
          >
            <span>🟡 Innovation</span>
            <span className="text-[11px] px-2 py-0.2 rounded-full bg-black/15 font-mono">
              {colorCounts.yellow}
            </span>
          </button>

          {/* 🔵 BLUE */}
          <button
            onClick={() => handleTabChange('blue')}
            className={`
              px-3.5 py-2 rounded-2xl text-xs sm:text-sm font-black transition-all whitespace-nowrap flex items-center gap-1.5
              ${activeTab === 'blue'
                ? 'bg-blue-600 text-white shadow-lg ring-4 ring-blue-300 scale-105'
                : 'bg-blue-50 hover:bg-blue-100 text-blue-700 border-2 border-blue-200'
              }
            `}
          >
            <span>🔵 Systems</span>
            <span className="text-[11px] px-2 py-0.2 rounded-full bg-black/15 font-mono">
              {colorCounts.blue}
            </span>
          </button>

          {/* 🟢 GREEN */}
          <button
            onClick={() => handleTabChange('green')}
            className={`
              px-3.5 py-2 rounded-2xl text-xs sm:text-sm font-black transition-all whitespace-nowrap flex items-center gap-1.5
              ${activeTab === 'green'
                ? 'bg-emerald-600 text-white shadow-lg ring-4 ring-emerald-300 scale-105'
                : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border-2 border-emerald-200'
              }
            `}
          >
            <span>🟢 People</span>
            <span className="text-[11px] px-2 py-0.2 rounded-full bg-black/15 font-mono">
              {colorCounts.green}
            </span>
          </button>
        </div>

        {/* Search input */}
        <div className="relative min-w-[200px]">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search block name..."
            className="w-full pl-10 pr-3.5 py-2 rounded-2xl border-2 border-slate-200 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50 focus:bg-white transition-all font-medium"
          />
        </div>
      </div>

      {/* Selected Block Banner Indicator */}
      {selectedBlock && (
        <div className="p-3.5 rounded-2xl border-2 flex items-center justify-between gap-3 shadow-md animate-fadeIn bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-400 text-blue-900">
          <div className="flex items-center gap-2.5">
            <span className="w-3 h-3 rounded-full bg-blue-600 animate-ping" />
            <span className="text-xs sm:text-sm font-black">
              Ready to Place: <span className="underline">{selectedBlock.title}</span> ({selectedBlock.color.toUpperCase()})
            </span>
            <span className="text-xs opacity-80 hidden sm:inline font-medium">
              — Tap an empty slot to place!
            </span>
          </div>
          <button
            onClick={() => onSelectBlock(null)}
            className="text-xs font-black underline shrink-0 px-2 py-1 rounded-lg hover:bg-black/10"
          >
            Cancel
          </button>
        </div>
      )}

      {/* Blocks Grid with custom visible scrollbar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3.5 pt-1 max-h-[440px] overflow-y-auto pr-2 custom-visible-scrollbar">
        {filteredBlocks.map((block) => {
          const isPlaced = placedBlockIds.has(block.id);
          const isSelected = selectedBlock?.id === block.id;

          return (
            <div key={block.id} className="relative">
              <BlockPiece
                block={block}
                isSelected={isSelected}
                onSelect={(b) => {
                  if (isSelected) {
                    onSelectBlock(null);
                  } else {
                    onSelectBlock(b);
                  }
                }}
                onQuickPlace={(b) => onQuickPlaceBlock(b)}
              />

              {/* Placed indicator badge */}
              {isPlaced && (
                <div className="absolute top-2.5 right-2.5 backdrop-blur-sm text-white text-[10px] font-mono font-black px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-lg pointer-events-none border bg-slate-900/90 border-emerald-400">
                  <CheckCircle className="w-3 h-3 text-emerald-400" />
                  Placed
                </div>
              )}
            </div>
          );
        })}

        {filteredBlocks.length === 0 && (
          <div className="col-span-full py-12 text-center text-slate-400 text-sm font-medium">
            No blocks found matching "{searchQuery}".
          </div>
        )}
      </div>
    </div>
  );
};
