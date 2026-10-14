import React, { useState, useMemo } from 'react';
import { ManagementBlock, PillarId, PillarPlacements } from '../types/game';
import { PILLARS } from '../data/pillars';
import { OrganizationPillar } from './OrganizationPillar';
import { CharacteristicBlock } from './CharacteristicBlock';
import { OrganizationBlueprint } from './OrganizationBlueprint';
import { StrengthMeter } from './StrengthMeter';
import { 
  Building2, 
  RotateCcw, 
  CheckCircle2, 
  Layers, 
  Search, 
  X, 
  ArrowRight, 
  Filter 
} from 'lucide-react';

interface OrganizationBuilderProps {
  placements: PillarPlacements;
  availableBlocks: ManagementBlock[];
  selectedBlock: ManagementBlock | null;
  onSelectBlock: (block: ManagementBlock | null) => void;
  onDropBlock: (blockId: string, targetPillarId: PillarId, sourcePillarId?: PillarId | null) => void;
  onSelectPillar: (pillarId: PillarId) => void;
  onRemoveBlock: (block: ManagementBlock, pillarId?: PillarId) => void;
  onEvaluate: () => void;
  onResetBoard: () => void;
  presentationMode: boolean;
}

export const OrganizationBuilder: React.FC<OrganizationBuilderProps> = ({
  placements,
  availableBlocks,
  selectedBlock,
  onSelectBlock,
  onDropBlock,
  onSelectPillar,
  onRemoveBlock,
  onEvaluate,
  onResetBoard,
  presentationMode,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<'all' | PillarId>('all');

  // Count placed blocks
  let totalBlocksPlaced = 0;
  let pillarsCompletedCount = 0;
  PILLARS.forEach(p => {
    const count = placements[p.id]?.length || 0;
    totalBlocksPlaced += count;
    if (count > 0) pillarsCompletedCount++;
  });

  const canEvaluate = totalBlocksPlaced >= 5;

  // Filter available blocks
  const filteredBlocks = useMemo(() => {
    return availableBlocks.filter(block => {
      // Category filter based on primary or secondary alignment
      if (categoryFilter !== 'all') {
        const matchesCategory = block.primaryPillar === categoryFilter || block.secondaryPillars?.includes(categoryFilter);
        if (!matchesCategory) return false;
      }

      // Search query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = block.title.toLowerCase().includes(q);
        const matchesDesc = block.description.toLowerCase().includes(q);
        return matchesTitle || matchesDesc;
      }

      return true;
    });
  }, [availableBlocks, categoryFilter, searchQuery]);

  return (
    <div className="space-y-6 pb-12">
      {/* Central Visual Header */}
      <div className="text-center space-y-1">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-cyan-500/30 text-[11px] font-mono uppercase tracking-widest text-cyan-400">
          <Building2 className="w-3.5 h-3.5" />
          Strategic Organizational Simulation Lab
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white uppercase font-display">
          NEXORA
        </h1>
        <p className="text-xs sm:text-sm font-semibold tracking-widest text-cyan-400 uppercase">
          THE HUMAN-CENTRED SMART ENTERPRISE
        </p>
      </div>

      {/* Top Strength Meter (During Construction) */}
      <StrengthMeter
        blocksPlacedCount={totalBlocksPlaced}
        pillarsCompletedCount={pillarsCompletedCount}
        minBlocksRequired={5}
        presentationMode={presentationMode}
      />

      {/* Interactive Blueprint Network */}
      <OrganizationBlueprint
        placements={placements}
        presentationMode={presentationMode}
      />

      {/* Organizational Pillars Area */}
      <div className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2 px-1">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-white uppercase tracking-wide flex items-center gap-2">
              <Layers className="w-4 h-4 text-cyan-400" />
              The Five Organizational Pillars
            </h2>
            <p className="text-xs text-slate-400">
              Assign strategic decisions into pillars. Beware: deceptive management traps are hidden among best practices!
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onResetBoard}
              title="Reset placed blocks"
              className="px-3 py-1.5 rounded-xl glass-panel-subtle text-slate-400 hover:text-white hover:border-slate-500 text-xs flex items-center gap-1.5 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Clear Pillars</span>
            </button>
          </div>
        </div>

        {/* 5 Pillar Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3.5">
          {PILLARS.map((pillar) => (
            <OrganizationPillar
              key={pillar.id}
              pillar={pillar}
              placedBlocks={placements[pillar.id] || []}
              selectedBlock={selectedBlock}
              onDropBlock={onDropBlock}
              onSelectPillar={onSelectPillar}
              onRemoveBlock={onRemoveBlock}
              presentationMode={presentationMode}
              showEvaluationState={false}
            />
          ))}
        </div>
      </div>

      {/* Management Characteristic Blocks Bench */}
      <div className="glass-panel p-5 rounded-3xl border-cyan-500/20 space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-base font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <span>Management Decision Pool</span>
              <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-500/40 font-normal">
                {availableBlocks.length} Options Available
              </span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              {selectedBlock
                ? `Selected: "${selectedBlock.title}" — Click on any pillar above to assign!`
                : 'Select or drag any management policy into the appropriate organizational pillar.'
              }
            </p>
          </div>

          {/* Search bar & Category filter */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Search Input */}
            <div className="relative min-w-[200px] sm:min-w-[240px]">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search policies & practices..."
                className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-9 pr-8 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-colors"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>

            {selectedBlock && (
              <button
                type="button"
                onClick={() => onSelectBlock(null)}
                className="px-2.5 py-1.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white text-xs border border-slate-700"
              >
                Deselect
              </button>
            )}
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          <span className="text-slate-400 font-mono text-[11px] mr-1 flex items-center gap-1">
            <Filter className="w-3 h-3 text-cyan-400" /> Focus Area:
          </span>

          <button
            type="button"
            onClick={() => setCategoryFilter('all')}
            className={`px-3 py-1 rounded-lg font-medium transition-colors ${categoryFilter === 'all' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'bg-slate-900 text-slate-400 hover:text-white'}`}
          >
            All Areas ({availableBlocks.length})
          </button>

          {PILLARS.map(p => (
            <button
              key={p.id}
              type="button"
              onClick={() => setCategoryFilter(p.id)}
              className={`px-3 py-1 rounded-lg font-medium transition-colors ${categoryFilter === p.id ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'bg-slate-900 text-slate-400 hover:text-white'}`}
            >
              {p.title}
            </button>
          ))}
        </div>

        {/* Bench Grid with 60+ cards */}
        {filteredBlocks.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-3.5 max-h-[560px] overflow-y-auto pr-2">
            {filteredBlocks.map((block) => (
              <CharacteristicBlock
                key={block.id}
                block={block}
                isSelected={selectedBlock?.id === block.id}
                onSelect={(b) => onSelectBlock(selectedBlock?.id === b.id ? null : b)}
                presentationMode={presentationMode}
                showEvaluationState={false}
              />
            ))}
          </div>
        ) : (
          <div className="p-8 text-center text-slate-500 text-sm">
            {searchQuery || categoryFilter !== 'all'
              ? 'No management options match your current filter. Try clearing the search or category.'
              : 'All available characteristic blocks have been deployed into the pillars!'
            }
          </div>
        )}
      </div>

      {/* Sticky Bottom Evaluation Trigger Bar */}
      <div className="sticky bottom-4 z-40 p-4 rounded-2xl glass-panel bg-nexora-900/95 border-2 border-cyan-400/50 shadow-2xl flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div
            className={`
              p-2.5 rounded-xl flex items-center justify-center
              ${canEvaluate ? 'bg-cyan-400 text-slate-950' : 'bg-slate-800 text-slate-500'}
            `}
          >
            <CheckCircle2 className="w-5 h-5" />
          </div>

          <div>
            <div className="font-bold text-sm text-white">
              {canEvaluate ? 'Ready for Strategic Evaluation' : 'Building Organization in Progress'}
            </div>
            <div className="text-xs text-slate-400">
              {canEvaluate
                ? `${totalBlocksPlaced} management options placed across ${pillarsCompletedCount}/5 pillars.`
                : `Place at least 5 management options across pillars to evaluate (${totalBlocksPlaced}/5 placed).`
              }
            </div>
          </div>
        </div>

        <button
          type="button"
          disabled={!canEvaluate}
          onClick={onEvaluate}
          className={`
            px-8 py-3.5 rounded-xl font-black text-sm uppercase tracking-wider flex items-center gap-2 transition-all shadow-lg
            ${canEvaluate
              ? 'bg-gradient-to-r from-cyan-400 via-teal-400 to-emerald-400 text-slate-950 hover:brightness-110 active:scale-95 shadow-glow-cyan cursor-pointer'
              : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
            }
          `}
        >
          <span>EVALUATE MY ORGANIZATION</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
