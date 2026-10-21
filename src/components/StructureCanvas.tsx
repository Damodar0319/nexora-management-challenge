import React, { useState, useMemo } from 'react';
import { BlueprintDefinition, StructureSlot, GameBlock, BlockColor } from '../types/game';
import { BlockPiece } from './BlockPiece';
import { DynamicIcon } from './DynamicIcon';
import { 
  Trophy, 
  RotateCcw, 
  Sparkles, 
  Wand2, 
  Plus, 
  X
} from 'lucide-react';
import { playSnapSound, playPopSound, playClickSound } from '../utils/sound';

interface StructureCanvasProps {
  blueprint: BlueprintDefinition;
  slots: StructureSlot[];
  selectedBlock: GameBlock | null;
  availableBlocks: GameBlock[];
  onPlaceBlock: (slotId: string, block: GameBlock) => void;
  onRemoveBlock: (slotId: string) => void;
  onFinishGame: () => void;
  onResetStructure: () => void;
  onAutoFill: () => void;
  isEarthquakeActive: boolean;
}

export const StructureCanvas: React.FC<StructureCanvasProps> = ({
  blueprint,
  slots,
  selectedBlock,
  availableBlocks,
  onPlaceBlock,
  onRemoveBlock,
  onFinishGame,
  onResetStructure,
  onAutoFill,
  isEarthquakeActive,
}) => {
  const [hoveredSlotId, setHoveredSlotId] = useState<string | null>(null);
  const [activePickerSlotId, setActivePickerSlotId] = useState<string | null>(null);
  const [pickerFilter, setPickerFilter] = useState<'recommended' | 'all' | BlockColor>('recommended');

  const totalSlots = slots.length;
  const filledSlots = slots.filter(s => s.block !== null);
  const filledCount = filledSlots.length;
  const isFull = filledCount === totalSlots;
  const canFinish = filledCount >= 1; // Can check result at any time if at least 1 block placed

  // Set of block IDs currently placed in the structure
  const placedBlockIds = useMemo(() => {
    const ids = new Set<string>();
    slots.forEach(s => {
      if (s.block) ids.add(s.block.id);
    });
    return ids;
  }, [slots]);

  // Find active slot for modal picker
  const activePickerSlot = slots.find(s => s.id === activePickerSlotId) || null;

  // Color counts for live balance bar
  const colorCounts: Record<BlockColor, number> = {
    red: slots.filter(s => s.block?.color === 'red').length,
    yellow: slots.filter(s => s.block?.color === 'yellow').length,
    blue: slots.filter(s => s.block?.color === 'blue').length,
    green: slots.filter(s => s.block?.color === 'green').length,
  };

  const handleDrop = (e: React.DragEvent, slotId: string) => {
    e.preventDefault();
    setHoveredSlotId(null);
    try {
      const dataStr = e.dataTransfer.getData('text/plain');
      if (dataStr) {
        const { blockId } = JSON.parse(dataStr);
        const targetBlock = availableBlocks.find(b => b.id === blockId);
        if (targetBlock) {
          onPlaceBlock(slotId, targetBlock);
        }
      }
    } catch (err) {
      console.error('Drag drop error', err);
    }
  };

  const handleSlotClick = (slot: StructureSlot) => {
    if (slot.block) return; // already filled

    if (selectedBlock) {
      onPlaceBlock(slot.id, selectedBlock);
      setActivePickerSlotId(null);
    } else {
      // Open clean, centered modal picker
      playClickSound();
      setPickerFilter('recommended');
      setActivePickerSlotId(slot.id);
    }
  };

  const handleRemove = (slotId: string) => {
    playPopSound();
    onRemoveBlock(slotId);
  };

  // Group slots by tier descending (Apex top, Base bottom)
  const tiers = Array.from(new Set(slots.map(s => s.tier))).sort((a, b) => b - a);

  // Status message
  const getStatusText = () => {
    if (isFull) return '🏆 All 10 slots filled! Click "Check Result & Finish" to evaluate your score!';
    if (filledCount === 0) return '👉 Click any empty slot in the pyramid to pick an attribute, or drag blocks from below!';
    return `✨ ${filledCount} of ${totalSlots} blocks placed. Select carefully — wrong answers deduct points when results are checked!`;
  };

  // Slot Color Styles based on required attribute
  const getSlotColorStyles = (color: BlockColor) => {
    switch (color) {
      case 'red':
        return {
          bg: 'bg-red-50/90 border-red-300 hover:border-red-500 hover:bg-red-100/90',
          badge: 'bg-red-500 text-white shadow-sm',
          hint: 'text-red-700',
          ring: 'focus:ring-red-400',
          iconColor: 'text-red-600',
        };
      case 'yellow':
        return {
          bg: 'bg-amber-50/90 border-amber-300 hover:border-amber-500 hover:bg-amber-100/90',
          badge: 'bg-amber-400 text-slate-950 font-black shadow-sm',
          hint: 'text-amber-800',
          ring: 'focus:ring-amber-400',
          iconColor: 'text-amber-600',
        };
      case 'blue':
        return {
          bg: 'bg-blue-50/90 border-blue-300 hover:border-blue-500 hover:bg-blue-100/90',
          badge: 'bg-blue-600 text-white shadow-sm',
          hint: 'text-blue-700',
          ring: 'focus:ring-blue-400',
          iconColor: 'text-blue-600',
        };
      case 'green':
        return {
          bg: 'bg-emerald-50/90 border-emerald-300 hover:border-emerald-500 hover:bg-emerald-100/90',
          badge: 'bg-emerald-600 text-white shadow-sm',
          hint: 'text-emerald-700',
          ring: 'focus:ring-emerald-400',
          iconColor: 'text-emerald-600',
        };
    }
  };

  // Filter blocks inside modal picker:
  // Disappear if already placed in other slots so the same option cannot be selected twice!
  const modalFilteredBlocks = activePickerSlot ? availableBlocks.filter(b => {
    // If block is already placed anywhere in the pyramid, do not show it!
    if (placedBlockIds.has(b.id)) {
      return false;
    }
    if (pickerFilter === 'recommended') {
      return b.color === activePickerSlot.attributeColor;
    }
    if (pickerFilter === 'all') {
      return true;
    }
    return b.color === pickerFilter;
  }) : [];

  // Available counts for tab badges
  const availableReds = availableBlocks.filter(b => b.color === 'red' && !placedBlockIds.has(b.id)).length;
  const availableYellows = availableBlocks.filter(b => b.color === 'yellow' && !placedBlockIds.has(b.id)).length;
  const availableBlues = availableBlocks.filter(b => b.color === 'blue' && !placedBlockIds.has(b.id)).length;
  const availableGreens = availableBlocks.filter(b => b.color === 'green' && !placedBlockIds.has(b.id)).length;
  const availableTotal = availableBlocks.filter(b => !placedBlockIds.has(b.id)).length;

  return (
    <div className={`relative bg-white border-4 border-slate-100 rounded-[32px] p-4 sm:p-7 shadow-2xl transition-all ${isEarthquakeActive ? 'animate-earthquake' : ''}`}>
      {/* Top Header Bar */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b-2 border-slate-100">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-3.5 py-1 rounded-full text-xs font-black uppercase font-mono bg-blue-600 text-white shadow-sm flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
              {blueprint.name}
            </span>
            <span className="text-xs font-bold text-slate-500">
              ({totalSlots} blocks to complete)
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight font-display mt-1">
            The 10-Block Management Pyramid
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 font-medium">
            Each level and slot specifies its target attribute. Wrong choices deduct points when results are checked!
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5 w-full md:w-auto justify-end">
          {/* Quick Demo Auto-Fill */}
          <button
            onClick={() => {
              playSnapSound();
              onAutoFill();
            }}
            className="px-3.5 py-2.5 rounded-2xl bg-amber-400 hover:bg-amber-500 text-slate-950 font-black text-xs sm:text-sm transition-all shadow-md flex items-center gap-1.5 hover:scale-105 active:scale-95"
            title="Automatically fills the pyramid with correct management blocks"
          >
            <Wand2 className="w-4 h-4 text-slate-900" />
            <span>Auto-Fill Demo</span>
          </button>

          {/* Reset button */}
          <button
            onClick={onResetStructure}
            disabled={filledCount === 0}
            className="px-3 py-2.5 rounded-2xl border-2 border-slate-200 text-slate-600 hover:text-red-600 hover:bg-red-50 hover:border-red-200 text-xs font-black transition-all disabled:opacity-40 disabled:pointer-events-none flex items-center gap-1"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Clear
          </button>

          {/* CHECK RESULT & FINISH BUTTON */}
          <button
            onClick={onFinishGame}
            disabled={!canFinish}
            className={`
              px-5 py-2.5 rounded-2xl font-black text-xs sm:text-sm tracking-wide transition-all flex items-center gap-2 shadow-lg
              ${isFull
                ? 'bg-gradient-to-r from-red-500 via-amber-400 via-emerald-500 to-blue-500 text-white shadow-xl hover:scale-105 active:scale-95 animate-pulse'
                : canFinish
                  ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/25 hover:scale-102'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }
            `}
          >
            <Trophy className={`w-4 h-4 ${isFull ? 'animate-bounce text-yellow-200' : ''}`} />
            <span>{isFull ? 'CHECK RESULT & FINISH! 🏆' : `CHECK RESULT (${filledCount}/${totalSlots})`}</span>
          </button>
        </div>
      </div>

      {/* Colorful Live Progress & Color Balance Banner */}
      <div className="py-3 px-4 my-4 rounded-2xl bg-gradient-to-r from-red-50 via-amber-50 via-blue-50 to-emerald-50 border-2 border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-inner">
        {/* Progress Bar with Emoji */}
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <span className="text-xl">
            {isFull ? '🤩' : filledCount > totalSlots / 2 ? '🚀' : '🧱'}
          </span>
          <div>
            <div className="text-xs font-black text-slate-800 font-mono">
              PYRAMID PROGRESS: <span className="text-blue-600 font-extrabold text-sm">{filledCount}</span> / {totalSlots} BLOCKS
            </div>
            <div className="w-40 sm:w-48 h-3.5 bg-slate-200 rounded-full overflow-hidden mt-0.5 border border-slate-300">
              <div
                className="h-full bg-gradient-to-r from-red-500 via-yellow-400 via-blue-500 to-emerald-500 transition-all duration-300"
                style={{ width: `${(filledCount / totalSlots) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Live Colorful Balance Pills */}
        <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap justify-end">
          <div className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-red-500 text-white font-mono text-xs font-black shadow-sm">
            <span>🔴 Red: {colorCounts.red}</span>
          </div>
          <div className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-amber-400 text-slate-950 font-mono text-xs font-black shadow-sm">
            <span>🟡 Yellow: {colorCounts.yellow}</span>
          </div>
          <div className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-blue-600 text-white font-mono text-xs font-black shadow-sm">
            <span>🔵 Blue: {colorCounts.blue}</span>
          </div>
          <div className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-emerald-600 text-white font-mono text-xs font-black shadow-sm">
            <span>🟢 Green: {colorCounts.green}</span>
          </div>
        </div>
      </div>

      {/* Helpful Status Bar */}
      <div className="mb-4 text-center text-xs sm:text-sm font-extrabold text-slate-700 bg-slate-50 py-2 px-3 rounded-xl border border-slate-200">
        {getStatusText()}
      </div>

      {/* Main Structure Diagram Canvas */}
      <div className="relative min-h-[420px] sm:min-h-[480px] bg-gradient-to-b from-sky-50/50 via-white to-amber-50/40 rounded-3xl p-4 sm:p-6 border-2 border-slate-200 flex flex-col justify-end shadow-inner">
        {/* Playful block grid background */}
        <div className="absolute inset-0 bg-block-grid opacity-60 pointer-events-none rounded-3xl" />

        {/* The Structure Rows */}
        <div className="relative z-10 w-full max-w-4xl mx-auto space-y-5 sm:space-y-6">
          {tiers.map((tierNum) => {
            const tierSlots = slots.filter(s => s.tier === tierNum);
            const tierInfo = blueprint.tierDescriptions?.[tierNum];
            const tierTitle = tierInfo?.title || tierSlots[0]?.tierLabel || `Level ${tierNum}`;
            const tierAttributeText = tierInfo?.attributeText || tierSlots[0]?.tierAttributeHint;

            return (
              <div key={tierNum} className="flex flex-col items-center">
                {/* Level / Tier Header with Attribute Tag */}
                <div className="flex flex-col sm:flex-row items-center gap-1.5 sm:gap-2.5 text-center bg-white/95 backdrop-blur-md px-4 py-1.5 rounded-2xl border-2 border-slate-200 shadow-md mb-2 font-mono">
                  <span className="text-xs sm:text-sm font-black text-slate-900 tracking-wide">
                    {tierTitle}
                  </span>
                  {tierAttributeText && (
                    <span className="text-[11px] font-extrabold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-800 border border-slate-300">
                      {tierAttributeText}
                    </span>
                  )}
                </div>

                {/* Slots Grid */}
                <div className={`grid gap-3 sm:gap-4 w-full justify-center ${
                  tierSlots.length === 1 ? 'max-w-xs grid-cols-1' :
                  tierSlots.length === 2 ? 'max-w-lg grid-cols-2' :
                  tierSlots.length === 3 ? 'max-w-2xl grid-cols-3' :
                  'max-w-4xl grid-cols-2 sm:grid-cols-4'
                }`}>
                  {tierSlots.map((slot) => {
                    const isHovered = hoveredSlotId === slot.id;
                    const isTargetable = selectedBlock !== null && slot.block === null;
                    const style = getSlotColorStyles(slot.attributeColor);
                    const isMatch = slot.block && slot.block.color === slot.attributeColor;

                    return (
                      <div key={slot.id} className="relative">
                        <div
                          onDragOver={(e) => {
                            e.preventDefault();
                            e.dataTransfer.dropEffect = 'move';
                            if (hoveredSlotId !== slot.id) setHoveredSlotId(slot.id);
                          }}
                          onDragLeave={() => {
                            if (hoveredSlotId === slot.id) setHoveredSlotId(null);
                          }}
                          onDrop={(e) => handleDrop(e, slot.id)}
                          onClick={() => handleSlotClick(slot)}
                          className={`
                            relative min-h-[96px] sm:min-h-[106px] rounded-3xl transition-all duration-200 flex items-center justify-center cursor-pointer select-none border-3
                            ${slot.block
                              ? 'shadow-md border-transparent'
                              : `border-dashed ${style.bg} ${isTargetable ? 'ring-4 ring-blue-400 scale-[1.03] shadow-lg' : ''} ${isHovered ? 'scale-105 shadow-xl ring-4 ring-offset-2 ring-blue-500' : ''}`
                            }
                          `}
                        >
                          {slot.block ? (
                            <div className="relative w-full h-full">
                              <BlockPiece
                                block={slot.block}
                                isInSlot
                                onRemove={() => handleRemove(slot.id)}
                              />
                              {/* Matching attribute color badge */}
                              {isMatch && (
                                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full bg-emerald-500 text-white font-mono text-[9px] font-black shadow-md border-2 border-white whitespace-nowrap">
                                  ✓ Attribute Aligned
                                </div>
                              )}
                            </div>
                          ) : (
                            <div className="flex flex-col items-center justify-between p-2.5 text-center w-full h-full">
                              {/* Connector socket studs on top */}
                              <div className="absolute -top-2 left-1/2 -translate-x-1/2 flex items-center gap-2.5 pointer-events-none opacity-60">
                                <div className="w-3.5 h-1.5 rounded-full bg-slate-400 shadow-sm" />
                                <div className="w-3.5 h-1.5 rounded-full bg-slate-400 shadow-sm" />
                              </div>

                              {/* Prominent Target Attribute Badge at Top */}
                              <div className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase font-mono tracking-wide ${style.badge} flex items-center gap-1`}>
                                <span>{slot.targetAttribute}</span>
                              </div>

                              {/* Slot Name */}
                              <div className="my-1">
                                <span className="text-xs sm:text-sm font-black text-slate-800 tracking-tight leading-tight block">
                                  {slot.label}
                                </span>
                              </div>

                              {/* Action Guidance */}
                              <div className={`text-[10px] font-bold ${style.hint} leading-none flex items-center gap-1`}>
                                <Plus className="w-3 h-3" />
                                <span>{slot.attributeHint}</span>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Foundation Base Bed Platform (Solid Toy Baseplate with Studs) */}
        <div className="relative z-10 mt-6 pt-1">
          <div className="w-full max-w-4xl mx-auto h-9 rounded-2xl bg-gradient-to-r from-red-500 via-amber-400 via-blue-500 to-emerald-500 p-0.5 shadow-xl">
            <div className="w-full h-full bg-slate-900 rounded-[14px] flex items-center justify-between px-4 text-white">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                <span className="text-[11px] font-mono font-black tracking-widest uppercase text-yellow-300">
                  ★ 10-BLOCK PYRAMID FOUNDATION BASEPLATE ★
                </span>
              </div>
              <div className="text-[11px] font-mono font-bold text-slate-300 hidden sm:block">
                RED (3) • YELLOW (3) • BLUE (2) • GREEN (2) SLOTS
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FULLY VISIBLE CENTERED SELECTION MODAL (Zero Clipping, Disappears When Placed Elsewhere!) */}
      {activePickerSlot && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/70 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-xl bg-white rounded-3xl p-5 sm:p-6 shadow-2xl border-4 border-blue-500 overflow-hidden space-y-4 my-6">
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-3 border-b-2 border-slate-100 gap-3">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500">
                    Place Block For:
                  </span>
                  <span className="font-black text-sm px-3 py-0.5 rounded-full bg-blue-100 text-blue-800">
                    {activePickerSlot.label}
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                  <span className="text-xs font-bold text-slate-600">Target Attribute:</span>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-black uppercase font-mono ${getSlotColorStyles(activePickerSlot.attributeColor).badge}`}>
                    {activePickerSlot.targetAttribute}
                  </span>
                </div>
              </div>

              <button
                onClick={() => setActivePickerSlotId(null)}
                className="w-9 h-9 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold flex items-center justify-center transition-colors shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* In-Modal Filter Tabs with dynamic remaining available counts */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              <button
                onClick={() => setPickerFilter('recommended')}
                className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1 whitespace-nowrap ${
                  pickerFilter === 'recommended'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
                }`}
              >
                <span>⭐ Recommended ({
                  activePickerSlot.attributeColor === 'red' ? availableReds :
                  activePickerSlot.attributeColor === 'yellow' ? availableYellows :
                  activePickerSlot.attributeColor === 'blue' ? availableBlues : availableGreens
                })</span>
              </button>

              <button
                onClick={() => setPickerFilter('all')}
                className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all whitespace-nowrap ${
                  pickerFilter === 'all'
                    ? 'bg-slate-900 text-white shadow-md'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <span>All Available ({availableTotal})</span>
              </button>

              <button
                onClick={() => setPickerFilter('red')}
                className={`px-2.5 py-1.5 rounded-xl text-xs font-black transition-all whitespace-nowrap ${
                  pickerFilter === 'red' ? 'bg-red-500 text-white shadow-md' : 'bg-red-50 text-red-700'
                }`}
              >
                🔴 Red ({availableReds})
              </button>

              <button
                onClick={() => setPickerFilter('yellow')}
                className={`px-2.5 py-1.5 rounded-xl text-xs font-black transition-all whitespace-nowrap ${
                  pickerFilter === 'yellow' ? 'bg-amber-400 text-slate-950 shadow-md' : 'bg-amber-50 text-amber-800'
                }`}
              >
                🟡 Yellow ({availableYellows})
              </button>

              <button
                onClick={() => setPickerFilter('blue')}
                className={`px-2.5 py-1.5 rounded-xl text-xs font-black transition-all whitespace-nowrap ${
                  pickerFilter === 'blue' ? 'bg-blue-600 text-white shadow-md' : 'bg-blue-50 text-blue-700'
                }`}
              >
                🔵 Blue ({availableBlues})
              </button>

              <button
                onClick={() => setPickerFilter('green')}
                className={`px-2.5 py-1.5 rounded-xl text-xs font-black transition-all whitespace-nowrap ${
                  pickerFilter === 'green' ? 'bg-emerald-600 text-white shadow-md' : 'bg-emerald-50 text-emerald-700'
                }`}
              >
                🟢 Green ({availableGreens})
              </button>
            </div>

            {/* Super Clear, Easy-to-Scroll Grid of Blocks (Placed blocks disappear so same option cannot be selected!) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-[50vh] overflow-y-auto pr-2 custom-visible-scrollbar p-1">
              {modalFilteredBlocks.map((b) => (
                <button
                  key={b.id}
                  onClick={() => {
                    onPlaceBlock(activePickerSlot.id, b);
                    setActivePickerSlotId(null);
                  }}
                  className={`
                    p-3 rounded-2xl text-left transition-all hover:scale-102 active:scale-95 flex flex-col justify-between gap-2 border-2 shadow-sm
                    ${b.color === 'red'
                      ? 'bg-red-50 text-red-950 border-red-200 hover:border-red-400 hover:bg-red-100'
                      : b.color === 'yellow'
                        ? 'bg-amber-50 text-amber-950 border-amber-200 hover:border-amber-400 hover:bg-amber-100'
                        : b.color === 'blue'
                          ? 'bg-blue-50 text-blue-950 border-blue-200 hover:border-blue-400 hover:bg-blue-100'
                          : 'bg-emerald-50 text-emerald-950 border-emerald-200 hover:border-emerald-400 hover:bg-emerald-100'
                    }
                    ${b.color === activePickerSlot.attributeColor ? 'ring-2 ring-blue-500 shadow-md' : ''}
                  `}
                >
                  <div className="flex items-start justify-between gap-1.5">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-xl shrink-0 bg-black/10">
                        <DynamicIcon name={b.icon} className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="font-black text-xs sm:text-sm block leading-tight">
                          {b.title}
                        </span>
                        <span className="text-[10px] font-medium opacity-80 block mt-0.5">
                          {b.subtitle}
                        </span>
                      </div>
                    </div>

                    <span className="px-2 py-0.5 rounded-full font-mono text-[10px] font-black shrink-0 bg-black/10">
                      +{b.power} pts
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-1.5 border-t border-black/10 text-[10px] font-bold">
                    <span className="opacity-70 truncate italic">
                      {b.principle}
                    </span>
                    <span className="underline ml-1 shrink-0 text-blue-600 font-extrabold">
                      Tap to Place ➔
                    </span>
                  </div>
                </button>
              ))}

              {modalFilteredBlocks.length === 0 && (
                <div className="col-span-full py-8 text-center text-slate-500 text-xs font-medium">
                  All blocks in this category have already been placed in other slots of the pyramid.
                </div>
              )}
            </div>

            {/* Footer tip */}
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-medium">
              <span>💡 Options disappear once selected so you can't pick the same option twice!</span>
              <button
                onClick={() => setActivePickerSlotId(null)}
                className="font-bold text-slate-700 hover:text-slate-900 underline"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
