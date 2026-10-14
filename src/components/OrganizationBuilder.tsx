import React, { useState } from 'react';
import { ManagementBlock, PillarId, PillarPlacements, OverallEvaluation, GameMode } from '../types/game';
import { PILLARS } from '../data/pillars';
import { OrganizationPillar } from './OrganizationPillar';
import { CharacteristicBlock } from './CharacteristicBlock';
import { OrganizationBlueprint } from './OrganizationBlueprint';
import { StrengthMeter } from './StrengthMeter';
import { GAME_MODES } from '../data/scenarios';
import { 
  Building2, 
  RotateCcw, 
  Play, 
  CheckCircle2, 
  Layers, 
  Filter, 
  AlertCircle,
  HelpCircle,
  ArrowRight,
  Sparkles
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
  currentMode: GameMode;
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
  currentMode,
  presentationMode,
}) => {
  const [filterType, setFilterType] = useState<'all' | 'positive' | 'negative'>('all');

  const modeConfig = GAME_MODES[currentMode];

  // Count placed blocks
  let totalBlocksPlaced = 0;
  let pillarsCompletedCount = 0;
  PILLARS.forEach(p => {
    const count = placements[p.id]?.length || 0;
    totalBlocksPlaced += count;
    if (count > 0) pillarsCompletedCount++;
  });

  const canEvaluate = totalBlocksPlaced >= 5;

  const filteredAvailableBlocks = availableBlocks.filter(b => {
    if (filterType === 'positive') return b.type === 'positive';
    if (filterType === 'negative') return b.type === 'negative';
    return true;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Central Visual Header */}
      <div className="text-center space-y-1">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-cyan-500/30 text-[11px] font-mono uppercase tracking-widest text-cyan-400">
          <Building2 className="w-3.5 h-3.5" />
          Interactive Construction Area
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
        currentModeTitle={modeConfig.title}
        presentationMode={presentationMode}
      />

      {/* Interactive Live Blueprint Network */}
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
              Drag characteristic blocks from the bench below or click to place
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

        {/* 5 Pillar Grid */}
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
            />
          ))}
        </div>
      </div>

      {/* Management Characteristic Blocks Bench */}
      <div className="glass-panel p-5 rounded-3xl border-cyan-500/20 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-base font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <span>Management Characteristic Blocks</span>
              <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-500/40 font-normal">
                {availableBlocks.length} Available
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              {selectedBlock
                ? `Selected: "${selectedBlock.title}" — Click on any pillar above to assign!`
                : 'Click a block to select, or drag directly into a pillar'
              }
            </p>
          </div>

          {/* Filters & Helpers */}
          <div className="flex items-center gap-2">
            {selectedBlock && (
              <button
                type="button"
                onClick={() => onSelectBlock(null)}
                className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 hover:text-white text-xs border border-slate-700"
              >
                Deselect
              </button>
            )}

            <div className="flex items-center rounded-xl bg-slate-900 p-1 border border-slate-800 text-xs">
              <button
                type="button"
                onClick={() => setFilterType('all')}
                className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${filterType === 'all' ? 'bg-cyan-500/20 text-cyan-300' : 'text-slate-400 hover:text-white'}`}
              >
                All ({availableBlocks.length})
              </button>
              <button
                type="button"
                onClick={() => setFilterType('positive')}
                className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${filterType === 'positive' ? 'bg-emerald-500/20 text-emerald-300' : 'text-slate-400 hover:text-white'}`}
              >
                Practices
              </button>
              <button
                type="button"
                onClick={() => setFilterType('negative')}
                className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${filterType === 'negative' ? 'bg-red-500/20 text-red-300' : 'text-slate-400 hover:text-white'}`}
              >
                Traps
              </button>
            </div>
          </div>
        </div>

        {/* Bench Grid */}
        {filteredAvailableBlocks.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 max-h-[360px] overflow-y-auto pr-1">
            {filteredAvailableBlocks.map((block) => (
              <CharacteristicBlock
                key={block.id}
                block={block}
                isSelected={selectedBlock?.id === block.id}
                onSelect={(b) => onSelectBlock(selectedBlock?.id === b.id ? null : b)}
                presentationMode={presentationMode}
              />
            ))}
          </div>
        ) : (
          <div className="p-8 text-center text-slate-500 text-sm">
            All available characteristic blocks have been deployed into the pillars!
          </div>
        )}
      </div>

      {/* Sticky / Prominent Bottom Evaluation Trigger Bar */}
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
                ? `${totalBlocksPlaced} management blocks deployed across ${pillarsCompletedCount}/5 pillars.`
                : `Place at least 5 blocks across pillars to evaluate (${totalBlocksPlaced}/5 placed).`
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
