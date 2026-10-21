import React, { useState, useEffect, useMemo } from 'react';
import { GameBlock, StructureSlot, BlueprintDefinition, StructureEvaluation } from './types/game';
import { INITIAL_BLOCKS } from './data/blocks';
import { BLUEPRINTS } from './data/blueprints';
import { evaluateStructure } from './utils/scoring';
import { Navbar } from './components/Navbar';
import { StructureCanvas } from './components/StructureCanvas';
import { BlockInventory } from './components/BlockInventory';
import { VictoryModal } from './components/VictoryModal';
import { CustomBlockModal } from './components/CustomBlockModal';
import { HelpModal } from './components/HelpModal';
import { 
  playSnapSound, 
  playPopSound, 
  playClickSound, 
  toggleSound, 
  getSoundEnabled 
} from './utils/sound';

export const App: React.FC = () => {
  const [currentBlueprint] = useState<BlueprintDefinition>(BLUEPRINTS[0]);
  const [slots, setSlots] = useState<StructureSlot[]>(() => {
    return BLUEPRINTS[0].slots.map(s => ({ ...s, block: null }));
  });

  // Custom blocks created by user
  const [customBlocks, setCustomBlocks] = useState<GameBlock[]>([]);

  // Combined active blocks pool (20 blocks total: 5 per color: 3 right, 2 wrong)
  const blocks = useMemo(() => {
    return [...INITIAL_BLOCKS, ...customBlocks];
  }, [customBlocks]);

  const [selectedBlock, setSelectedBlock] = useState<GameBlock | null>(null);

  // Modals & Interactivity states
  const [isVictoryOpen, setIsVictoryOpen] = useState(false);
  const [isCustomModalOpen, setIsCustomModalOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isSoundEnabled, setIsSoundEnabled] = useState(getSoundEnabled());
  const [isEarthquakeActive, setIsEarthquakeActive] = useState(false);
  const [evaluation, setEvaluation] = useState<StructureEvaluation | null>(null);

  // Set of placed block IDs to show visual badges in the inventory
  const placedBlockIds = useMemo(() => {
    const ids = new Set<string>();
    slots.forEach(s => {
      if (s.block) ids.add(s.block.id);
    });
    return ids;
  }, [slots]);

  // Place a block into a specific slot (Zero spoilers: no buzzer or wrong answer alert during placement!)
  const handlePlaceBlock = (slotId: string, blockToPlace: GameBlock) => {
    playSnapSound();

    setSlots(prevSlots => {
      // First, remove this block if it was already placed in another slot
      const cleanedSlots = prevSlots.map(s => {
        if (s.block?.id === blockToPlace.id) {
          return { ...s, block: null };
        }
        return s;
      });

      // Now place into target slot
      const nextSlots = cleanedSlots.map(s => {
        if (s.id === slotId) {
          return { ...s, block: blockToPlace };
        }
        return s;
      });

      // If all 10 slots are filled, automatically evaluate and show results
      const allFilled = nextSlots.every(s => s.block !== null);
      if (allFilled) {
        const evalResult = evaluateStructure(nextSlots);
        setEvaluation(evalResult);
        setTimeout(() => {
          setIsVictoryOpen(true);
        }, 600);
      }

      return nextSlots;
    });

    setSelectedBlock(null);
  };

  // Effortless 1-Click Quick Place: Snaps block into the FIRST open slot matching color or any open slot
  const handleQuickPlaceBlock = (blockToPlace: GameBlock) => {
    playSnapSound();
    const emptySlot = slots.find(s => s.block === null && s.attributeColor === blockToPlace.color) 
                   || slots.find(s => s.block === null);

    if (emptySlot) {
      handlePlaceBlock(emptySlot.id, blockToPlace);
    } else {
      setSelectedBlock(blockToPlace);
    }
  };

  // Remove a block from a slot
  const handleRemoveBlock = (slotId: string) => {
    setSlots(prevSlots => {
      return prevSlots.map(s => {
        if (s.id === slotId) {
          return { ...s, block: null };
        }
        return s;
      });
    });
  };

  // Clear all slots
  const handleResetStructure = () => {
    playPopSound();
    setSlots(currentBlueprint.slots.map(s => ({ ...s, block: null })));
    setSelectedBlock(null);
    setIsVictoryOpen(false);
  };

  // Instant Auto-Fill demonstration with correct management blocks
  const handleAutoFill = () => {
    playSnapSound();
    const correctReds = INITIAL_BLOCKS.filter(b => b.color === 'red' && !b.isWrong);
    const correctYellows = INITIAL_BLOCKS.filter(b => b.color === 'yellow' && !b.isWrong);
    const correctBlues = INITIAL_BLOCKS.filter(b => b.color === 'blue' && !b.isWrong);
    const correctGreens = INITIAL_BLOCKS.filter(b => b.color === 'green' && !b.isWrong);

    let redIdx = 0;
    let yellowIdx = 0;
    let blueIdx = 0;
    let greenIdx = 0;

    setSlots(prevSlots => {
      const nextSlots = prevSlots.map(s => {
        if (s.attributeColor === 'red') {
          const blk = correctReds[redIdx % correctReds.length];
          redIdx++;
          return { ...s, block: blk };
        }
        if (s.attributeColor === 'yellow') {
          const blk = correctYellows[yellowIdx % correctYellows.length];
          yellowIdx++;
          return { ...s, block: blk };
        }
        if (s.attributeColor === 'blue') {
          const blk = correctBlues[blueIdx % correctBlues.length];
          blueIdx++;
          return { ...s, block: blk };
        }
        if (s.attributeColor === 'green') {
          const blk = correctGreens[greenIdx % correctGreens.length];
          greenIdx++;
          return { ...s, block: blk };
        }
        return s;
      });

      const evalResult = evaluateStructure(nextSlots);
      setEvaluation(evalResult);
      setTimeout(() => {
        setIsVictoryOpen(true);
      }, 500);

      return nextSlots;
    });
  };

  // Add custom block
  const handleAddCustomBlock = (newBlock: GameBlock) => {
    setCustomBlocks(prev => [newBlock, ...prev]);
    handleQuickPlaceBlock(newBlock);
  };

  // Trigger Earthquake Simulation
  const handleTriggerEarthquake = () => {
    setIsEarthquakeActive(true);
    setTimeout(() => {
      setIsEarthquakeActive(false);
    }, 1200);
  };

  // Check Result & Finish Game manually
  const handleFinishGame = () => {
    playClickSound();
    const evalResult = evaluateStructure(slots);
    setEvaluation(evalResult);
    setIsVictoryOpen(true);
  };

  // Sound toggle
  const handleToggleSound = () => {
    const nextState = toggleSound();
    setIsSoundEnabled(nextState);
  };

  // Global listener for HTML5 drop events
  useEffect(() => {
    const handleDroppedEvent = (e: Event) => {
      const customEvent = e as CustomEvent<{ slotId: string; blockId: string }>;
      const { slotId, blockId } = customEvent.detail;
      const targetBlock = blocks.find(b => b.id === blockId);
      if (targetBlock) {
        handlePlaceBlock(slotId, targetBlock);
      }
    };

    window.addEventListener('block-dropped-on-slot', handleDroppedEvent);
    return () => {
      window.removeEventListener('block-dropped-on-slot', handleDroppedEvent);
    };
  }, [blocks]);

  const filledCount = slots.filter(s => s.block !== null).length;

  return (
    <div className="min-h-screen flex flex-col bg-block-grid text-slate-800">
      {/* Top Navigation: Single 10-block level */}
      <Navbar
        currentBlueprint={currentBlueprint}
        isSoundEnabled={isSoundEnabled}
        onToggleSound={handleToggleSound}
        onOpenHelp={() => setIsHelpOpen(true)}
        onReset={handleResetStructure}
        filledCount={filledCount}
        totalSlots={slots.length}
      />

      {/* Main Game Interface */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-5 space-y-6">
        {/* Colorful Welcome Banner */}
        <div className="bg-gradient-to-r from-red-500 via-amber-400 via-blue-500 to-emerald-500 p-1 rounded-[30px] shadow-xl">
          <div className="bg-white rounded-[26px] p-4 sm:p-5 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4 text-center md:text-left">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-red-500 via-amber-400 to-blue-500 flex items-center justify-center text-white shadow-lg font-display font-black text-2xl shrink-0">
                🧱
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight font-display">
                  10-Block Management Pyramid Challenge
                </h1>
                <p className="text-xs sm:text-sm text-slate-600 font-medium mt-0.5">
                  Choose from <span className="font-extrabold text-red-600">🔴 Red (Leadership)</span>,{' '}
                  <span className="font-extrabold text-amber-600">🟡 Yellow (Innovation)</span>,{' '}
                  <span className="font-extrabold text-blue-600">🔵 Blue (Systems)</span>, and{' '}
                  <span className="font-extrabold text-emerald-600">🟢 Green (People)</span>. 5 options each: 3 right, 2 wrong. Wrong choices deduct points when checking results!
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 shrink-0">
              <button
                onClick={handleAutoFill}
                className="px-4 py-2.5 rounded-2xl bg-amber-400 hover:bg-amber-500 text-slate-950 font-black text-xs sm:text-sm transition-all shadow-md hover:scale-105 active:scale-95 flex items-center gap-1.5"
              >
                <span>⚡ 1-Click Auto Fill</span>
              </button>
              <button
                onClick={() => setIsHelpOpen(true)}
                className="px-3.5 py-2.5 rounded-2xl border-2 border-slate-300 hover:bg-slate-100 text-slate-700 font-bold text-xs sm:text-sm transition-colors"
              >
                How to Play
              </button>
            </div>
          </div>
        </div>

        {/* The Structure Canvas (The 10-Block Pyramid) */}
        <StructureCanvas
          blueprint={currentBlueprint}
          slots={slots}
          selectedBlock={selectedBlock}
          availableBlocks={blocks}
          onPlaceBlock={handlePlaceBlock}
          onRemoveBlock={handleRemoveBlock}
          onFinishGame={handleFinishGame}
          onResetStructure={handleResetStructure}
          onAutoFill={handleAutoFill}
          isEarthquakeActive={isEarthquakeActive}
        />

        {/* The Block Palette Drawer */}
        <BlockInventory
          blocks={blocks}
          selectedBlock={selectedBlock}
          placedBlockIds={placedBlockIds}
          onSelectBlock={setSelectedBlock}
          onQuickPlaceBlock={handleQuickPlaceBlock}
          onOpenCustomBlockModal={() => setIsCustomModalOpen(true)}
          onAutoFill={handleAutoFill}
        />
      </main>

      {/* Victory / Results Evaluation Modal */}
      <VictoryModal
        isOpen={isVictoryOpen}
        evaluation={evaluation}
        blueprint={currentBlueprint}
        onClose={() => setIsVictoryOpen(false)}
        onReset={handleResetStructure}
        onTriggerEarthquake={handleTriggerEarthquake}
        isEarthquakeActive={isEarthquakeActive}
      />

      {/* Custom Block Creator Modal */}
      <CustomBlockModal
        isOpen={isCustomModalOpen}
        onClose={() => setIsCustomModalOpen(false)}
        onAddBlock={handleAddCustomBlock}
      />

      {/* How to Play Help Modal */}
      <HelpModal
        isOpen={isHelpOpen}
        onClose={() => setIsHelpOpen(false)}
      />

      {/* Cheerful Footer */}
      <footer className="mt-auto py-5 border-t-2 border-slate-200 bg-white/90 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="font-mono text-xs font-black text-slate-700">
            ★ ESSENTIALS OF MANAGEMENT (EOM) • 10-BLOCK PYRAMID SIMULATION ★
          </div>
          <div className="text-slate-500 text-xs font-semibold">
            Red (Leadership) • Yellow (Innovation) • Blue (Systems) • Green (People)
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
