import { GameMode, PillarPlacements } from '../types/game';
import { MANAGEMENT_BLOCKS } from './blocks';

export interface GameModeConfig {
  id: GameMode;
  title: string;
  badge: string;
  durationMinutes: number;
  description: string;
  objective: string;
  targetAudience: string;
  initialPlacements: PillarPlacements;
  availableBlockIds: string[];
}

export const GAME_MODES: Record<GameMode, GameModeConfig> = {
  quick: {
    id: 'quick',
    title: 'Quick Build',
    badge: 'Fast-Paced (~2 min)',
    durationMinutes: 2,
    description: 'Select and place the single best management characteristic for each of NEXORA’s five organizational pillars.',
    objective: 'Build a well-rounded foundation by matching five core management practices to their ideal pillars.',
    targetAudience: 'Ideal for rapid class demonstrations and quick concept tests.',
    initialPlacements: {
      people: [],
      performance: [],
      innovation: [],
      purpose: [],
      structure: []
    },
    // Curated high-impact positive blocks
    availableBlockIds: [
      'b1-clear-planning',
      'b2-participative-leadership',
      'b3-open-communication',
      'b4-accountability',
      'b5-innovation-adaptability',
      'b6-employee-development',
      'b7-ethical-decision-making',
      'b8-cross-functional-collaboration',
      'b9-sustainability',
      'b10-data-informed-decisions'
    ]
  },
  challenge: {
    id: 'challenge',
    title: 'Management Challenge',
    badge: 'Strategic (~4 min)',
    durationMinutes: 4,
    description: 'Face the full managerial reality. Navigate a mixed pool of both high-leverage practices and deceptive, toxic organizational traps.',
    objective: 'Discern positive drivers from counterproductive pitfalls, placing optimal practices to maximize enterprise effectiveness.',
    targetAudience: 'Comprehensive classroom challenge evaluating critical management judgment.',
    initialPlacements: {
      people: [],
      performance: [],
      innovation: [],
      purpose: [],
      structure: []
    },
    // All 15 blocks
    availableBlockIds: MANAGEMENT_BLOCKS.map(b => b.id)
  },
  repair: {
    id: 'repair',
    title: 'Repair The Organization',
    badge: 'Crisis Turnaround (~3 min)',
    durationMinutes: 3,
    description: 'NEXORA is in an operational crisis plagued by micromanagement, silos, and no accountability. Diagnose the damage and replace toxic practices.',
    objective: 'Identify and remove all 5 dysfunctional management practices and substitute them with high-performing management principles.',
    targetAudience: 'Great for learning root-cause analysis and turnaround management.',
    // Pre-loaded broken state!
    initialPlacements: {
      people: [MANAGEMENT_BLOCKS.find(b => b.id === 'b11-excessive-micromanagement')!],
      performance: [MANAGEMENT_BLOCKS.find(b => b.id === 'b13-unclear-objectives')!],
      innovation: [MANAGEMENT_BLOCKS.find(b => b.id === 'b12-departmental-silos')!],
      purpose: [MANAGEMENT_BLOCKS.find(b => b.id === 'b15-no-accountability')!],
      structure: [MANAGEMENT_BLOCKS.find(b => b.id === 'b14-poor-communication')!]
    },
    // Available bench blocks to rescue the organization
    availableBlockIds: [
      'b1-clear-planning',
      'b2-participative-leadership',
      'b3-open-communication',
      'b4-accountability',
      'b5-innovation-adaptability',
      'b6-employee-development',
      'b7-ethical-decision-making',
      'b8-cross-functional-collaboration',
      'b9-sustainability',
      'b10-data-informed-decisions'
    ]
  }
};
