import React, { useState } from 'react';
import { ManagementBlock, OrganizationalPillarInfo, PillarId } from '../types/game';
import { CharacteristicBlock } from './CharacteristicBlock';
import { DynamicIcon } from './DynamicIcon';
import { Plus, ShieldCheck, AlertTriangle } from 'lucide-react';

interface OrganizationPillarProps {
  pillar: OrganizationalPillarInfo;
  placedBlocks: ManagementBlock[];
  selectedBlock: ManagementBlock | null;
  onDropBlock: (blockId: string, targetPillarId: PillarId, sourcePillarId?: PillarId | null) => void;
  onSelectPillar: (pillarId: PillarId) => void;
  onRemoveBlock: (block: ManagementBlock, pillarId?: PillarId) => void;
  presentationMode?: boolean;
  showEvaluationState?: boolean;
}

export const OrganizationPillar: React.FC<OrganizationPillarProps> = ({
  pillar,
  placedBlocks,
  selectedBlock,
  onDropBlock,
  onSelectPillar,
  onRemoveBlock,
  presentationMode = false,
  showEvaluationState = false,
}) => {
  const [isDragOver, setIsDragOver] = useState(false);

  const hasNegative = placedBlocks.some(b => b.type === 'negative');
  const hasBlocks = placedBlocks.length > 0;

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (!isDragOver) setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);

    try {
      const dataStr = e.dataTransfer.getData('text/plain');
      if (dataStr) {
        const { blockId, sourcePillarId } = JSON.parse(dataStr);
        onDropBlock(blockId, pillar.id, sourcePillarId);
      }
    } catch (err) {
      console.error('Failed to parse drag drop data', err);
    }
  };

  const handlePillarClick = () => {
    if (selectedBlock) {
      onSelectPillar(pillar.id);
    }
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={handlePillarClick}
      className={`
        relative flex flex-col rounded-2xl transition-all duration-300
        ${presentationMode ? 'min-h-[400px] p-5' : 'min-h-[360px] p-4'}
        ${isDragOver
          ? 'bg-nexora-800/90 ring-4 ring-cyan-400 shadow-glow-cyan scale-[1.01]'
          : selectedBlock
            ? 'bg-nexora-900/95 ring-2 ring-dashed ring-cyan-500/50 hover:ring-cyan-400 cursor-pointer'
            : 'bg-nexora-900/80 border border-slate-700/60 shadow-pillar'
        }
        ${showEvaluationState && hasNegative ? 'border-red-500/60 bg-red-950/20 shadow-glow-rose' : ''}
        ${showEvaluationState && hasBlocks && !hasNegative ? 'border-emerald-500/50 shadow-glow-emerald' : ''}
        ${!showEvaluationState && hasBlocks ? 'border-cyan-500/40' : ''}
      `}
    >
      {/* Top Header of Pillar */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800/80 gap-2">
        <div className="flex items-center gap-2.5 min-w-0">
          <div
            className={`
              p-2.5 rounded-xl shrink-0 flex items-center justify-center
              ${showEvaluationState && hasNegative
                ? 'bg-red-500/20 text-red-400'
                : 'bg-nexora-800 text-cyan-400 border border-cyan-500/30'
              }
            `}
            style={{ color: showEvaluationState && hasNegative ? '#EF4444' : pillar.accentColor }}
          >
            <DynamicIcon name={pillar.iconName} className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <h3 className={`font-bold uppercase tracking-wider text-slate-100 truncate ${presentationMode ? 'text-base' : 'text-sm'}`}>
              {pillar.title}
            </h3>
            <p className="text-[11px] text-slate-400 truncate font-medium">
              {pillar.subtitle}
            </p>
          </div>
        </div>

        {/* Status Chip */}
        <div className="shrink-0">
          {showEvaluationState ? (
            hasNegative ? (
              <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-950/90 text-red-400 border border-red-500/40">
                <AlertTriangle className="w-3 h-3" /> Trap Risk
              </span>
            ) : hasBlocks ? (
              <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-950/90 text-emerald-300 border border-emerald-500/40">
                <ShieldCheck className="w-3 h-3" /> Synergized
              </span>
            ) : (
              <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-slate-800/70 text-slate-400 border border-slate-700">
                Empty
              </span>
            )
          ) : (
            hasBlocks ? (
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-500/40">
                {placedBlocks.length} Active
              </span>
            ) : (
              <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-slate-800/70 text-slate-400 border border-slate-700">
                Empty
              </span>
            )
          )}
        </div>
      </div>

      {/* Represents Dimension Chips */}
      <div className="my-2.5 flex flex-wrap gap-1">
        {pillar.represents.slice(0, 3).map((item, idx) => (
          <span
            key={idx}
            className="text-[10px] text-slate-400 bg-slate-800/50 px-1.5 py-0.5 rounded border border-slate-700/50 truncate max-w-full"
            title={item}
          >
            • {item.split('&')[0]}
          </span>
        ))}
      </div>

      {/* Placed Blocks Area */}
      <div className="flex-1 flex flex-col gap-2.5 my-1 overflow-y-auto max-h-[300px] pr-0.5">
        {hasBlocks ? (
          placedBlocks.map((block) => (
            <CharacteristicBlock
              key={block.id}
              block={block}
              isInPillar={true}
              currentPillarId={pillar.id}
              onRemove={onRemoveBlock}
              presentationMode={presentationMode}
              showEvaluationState={showEvaluationState}
            />
          ))
        ) : (
          <div
            className={`
              flex-1 flex flex-col items-center justify-center text-center p-4 rounded-xl border-2 border-dashed transition-all
              ${selectedBlock
                ? 'border-cyan-400/60 bg-cyan-950/20 text-cyan-300 animate-pulse'
                : 'border-slate-800 bg-slate-950/30 text-slate-500 hover:border-slate-700'
              }
            `}
          >
            <div className="p-2.5 rounded-full bg-slate-900/80 mb-2 border border-slate-800">
              <Plus className={`w-4 h-4 ${selectedBlock ? 'text-cyan-400' : 'text-slate-500'}`} />
            </div>
            <p className="text-xs font-semibold text-slate-300">
              {selectedBlock ? 'Tap to place selected option' : 'Drop Management Option Here'}
            </p>
            <p className="text-[10px] text-slate-500 mt-0.5">
              Drag from bench or select and click
            </p>
          </div>
        )}
      </div>

      {/* Pillar Footer Indicator */}
      <div className="pt-2 mt-auto border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-400">
        <span className="font-mono text-[10px] text-slate-500">
          ASSIGNED: {placedBlocks.length}
        </span>
        {showEvaluationState && hasNegative && (
          <span className="text-[10px] text-red-400 font-semibold animate-pulse">
            Internal Risk Detected
          </span>
        )}
        {!showEvaluationState && hasBlocks && (
          <span className="text-[10px] text-cyan-400 font-medium">
            Active in Structure
          </span>
        )}
      </div>
    </div>
  );
};
