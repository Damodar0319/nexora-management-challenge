import React, { useState, useEffect } from 'react';
import { GameMode, ManagementBlock, PillarId, PillarPlacements, OverallEvaluation } from './types/game';
import { MANAGEMENT_BLOCKS } from './data/blocks';
import { GAME_MODES } from './data/scenarios';
import { calculateOrganizationEvaluation } from './utils/scoring';
import { Navbar } from './components/Navbar';
import { LandingScreen } from './components/LandingScreen';
import { OrganizationBuilder } from './components/OrganizationBuilder';
import { ResultsScreen } from './components/ResultsScreen';
import { PresentationModal } from './components/PresentationModal';

export const App: React.FC = () => {
  const [screen, setScreen] = useState<'landing' | 'building' | 'results'>('landing');
  const [currentMode, setCurrentMode] = useState<GameMode>('quick');
  const [placements, setPlacements] = useState<PillarPlacements>({
    people: [],
    performance: [],
    innovation: [],
    purpose: [],
    structure: []
  });
  const [availableBlocks, setAvailableBlocks] = useState<ManagementBlock[]>([]);
  const [selectedBlock, setSelectedBlock] = useState<ManagementBlock | null>(null);
  const [evaluation, setEvaluation] = useState<OverallEvaluation | null>(null);
  const [presentationMode, setPresentationMode] = useState<boolean>(false);
  const [isPrinciplesModalOpen, setIsPrinciplesModalOpen] = useState<boolean>(false);

  // Sync presentation mode class to document body
  useEffect(() => {
    if (presentationMode) {
      document.body.classList.add('presentation-mode');
    } else {
      document.body.classList.remove('presentation-mode');
    }
  }, [presentationMode]);

  // Start or reset a game mode
  const startGame = (mode: GameMode) => {
    const config = GAME_MODES[mode];
    setCurrentMode(mode);

    // Deep clone initial placements
    const initialPlacements: PillarPlacements = {
      people: [...config.initialPlacements.people],
      performance: [...config.initialPlacements.performance],
      innovation: [...config.initialPlacements.innovation],
      purpose: [...config.initialPlacements.purpose],
      structure: [...config.initialPlacements.structure],
    };

    // Collect already placed block IDs
    const placedIds = new Set<string>();
    Object.values(initialPlacements).forEach(blocks => {
      blocks.forEach(b => placedIds.add(b.id));
    });

    // Populate available bench
    const bench = config.availableBlockIds
      .filter(id => !placedIds.has(id))
      .map(id => MANAGEMENT_BLOCKS.find(b => b.id === id)!)
      .filter(Boolean);

    setPlacements(initialPlacements);
    setAvailableBlocks(bench);
    setSelectedBlock(null);
    setEvaluation(null);
    setScreen('building');
  };

  // Switch mode directly
  const handleSelectMode = (mode: GameMode) => {
    startGame(mode);
  };

  // Drag and drop handler
  const handleDropBlock = (blockId: string, targetPillarId: PillarId, sourcePillarId?: PillarId | null) => {
    let block: ManagementBlock | undefined;

    // Check if source is a pillar
    if (sourcePillarId && sourcePillarId !== targetPillarId) {
      block = placements[sourcePillarId].find(b => b.id === blockId);
      if (block) {
        // Remove from source pillar
        setPlacements(prev => ({
          ...prev,
          [sourcePillarId]: prev[sourcePillarId].filter(b => b.id !== blockId),
          [targetPillarId]: [...prev[targetPillarId], block!]
        }));
        setSelectedBlock(null);
        return;
      }
    }

    // Otherwise it came from bench
    block = availableBlocks.find(b => b.id === blockId);
    if (!block) return;

    // Remove from bench & add to target pillar
    setAvailableBlocks(prev => prev.filter(b => b.id !== blockId));
    setPlacements(prev => ({
      ...prev,
      [targetPillarId]: [...prev[targetPillarId], block!]
    }));
    setSelectedBlock(null);
  };

  // Click-to-place handler (when a block is selected and a pillar is clicked)
  const handleSelectPillar = (pillarId: PillarId) => {
    if (!selectedBlock) return;

    // Remove from bench
    setAvailableBlocks(prev => prev.filter(b => b.id !== selectedBlock.id));

    // Also remove from any other pillar if it was already placed somewhere
    setPlacements(prev => {
      const next: PillarPlacements = {
        people: prev.people.filter(b => b.id !== selectedBlock.id),
        performance: prev.performance.filter(b => b.id !== selectedBlock.id),
        innovation: prev.innovation.filter(b => b.id !== selectedBlock.id),
        purpose: prev.purpose.filter(b => b.id !== selectedBlock.id),
        structure: prev.structure.filter(b => b.id !== selectedBlock.id),
      };
      next[pillarId] = [...next[pillarId], selectedBlock];
      return next;
    });

    setSelectedBlock(null);
  };

  // Remove block from a pillar back to the bench
  const handleRemoveBlock = (block: ManagementBlock, pillarId?: PillarId) => {
    if (!pillarId) return;

    setPlacements(prev => ({
      ...prev,
      [pillarId]: prev[pillarId].filter(b => b.id !== block.id)
    }));

    // Add back to bench if not already there
    setAvailableBlocks(prev => {
      if (prev.some(b => b.id === block.id)) return prev;
      return [...prev, block].sort((a, b) => a.blockNumber - b.blockNumber);
    });

    if (selectedBlock?.id === block.id) {
      setSelectedBlock(null);
    }
  };

  // Clear all pillars back to bench
  const handleResetBoard = () => {
    const allBlocksToReturn: ManagementBlock[] = [];
    Object.values(placements).forEach(blocks => {
      allBlocksToReturn.push(...blocks);
    });

    setPlacements({
      people: [],
      performance: [],
      innovation: [],
      purpose: [],
      structure: []
    });

    setAvailableBlocks(prev => {
      const combined = [...prev, ...allBlocksToReturn];
      const unique = Array.from(new Map(combined.map(b => [b.id, b])).values());
      return unique.sort((a, b) => a.blockNumber - b.blockNumber);
    });

    setSelectedBlock(null);
  };

  // Evaluate the organization
  const handleEvaluate = () => {
    const result = calculateOrganizationEvaluation(placements);
    setEvaluation(result);
    setScreen('results');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Improve organization: return to building screen while keeping placements intact
  const handleImproveOrganization = () => {
    setScreen('building');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Play again: restart from current mode
  const handlePlayAgain = () => {
    startGame(currentMode);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-enterprise-grid flex flex-col text-slate-100 selection:bg-cyan-500 selection:text-white">
      {/* Top Navbar */}
      <Navbar
        currentMode={currentMode}
        onSelectMode={handleSelectMode}
        presentationMode={presentationMode}
        onTogglePresentationMode={() => setPresentationMode(prev => !prev)}
        onOpenPrinciplesModal={() => setIsPrinciplesModalOpen(true)}
        onResetGame={() => setScreen('landing')}
        isInGame={screen !== 'landing'}
      />

      {/* Main Screen Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-4">
        {screen === 'landing' && (
          <LandingScreen
            onStartGame={startGame}
            selectedMode={currentMode}
            onSelectMode={setCurrentMode}
            presentationMode={presentationMode}
            onTogglePresentationMode={() => setPresentationMode(prev => !prev)}
            onOpenPrinciplesModal={() => setIsPrinciplesModalOpen(true)}
          />
        )}

        {screen === 'building' && (
          <OrganizationBuilder
            placements={placements}
            availableBlocks={availableBlocks}
            selectedBlock={selectedBlock}
            onSelectBlock={setSelectedBlock}
            onDropBlock={handleDropBlock}
            onSelectPillar={handleSelectPillar}
            onRemoveBlock={handleRemoveBlock}
            onEvaluate={handleEvaluate}
            onResetBoard={handleResetBoard}
            currentMode={currentMode}
            presentationMode={presentationMode}
          />
        )}

        {screen === 'results' && evaluation && (
          <ResultsScreen
            evaluation={evaluation}
            placements={placements}
            onImproveOrganization={handleImproveOrganization}
            onPlayAgain={handlePlayAgain}
            presentationMode={presentationMode}
          />
        )}
      </main>

      {/* Presentation Mode Info Modal */}
      <PresentationModal
        isOpen={isPrinciplesModalOpen}
        onClose={() => setIsPrinciplesModalOpen(false)}
      />

      {/* Footer */}
      <footer className="mt-auto py-6 border-t border-slate-900 bg-nexora-950/80 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="font-mono text-[11px] text-slate-400">
            NEXORA — The Human-Centred Smart Enterprise • Essentials of Management
          </div>
          <div className="text-slate-500 text-[11px]">
            Designed for interactive classroom presentation & simulation analysis
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
