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
    badge: 'Fast (~2 min)',
    durationMinutes: 2,
    description: 'Select the optimal management policies for each of NEXORA’s five organizational pillars from a curated set of practices and hidden pitfalls.',
    objective: 'Build a well-rounded foundation by discerning high-impact practices from common corporate traps.',
    targetAudience: 'Ideal for rapid classroom demonstrations and fast interactive polling.',
    initialPlacements: {
      people: [],
      performance: [],
      innovation: [],
      purpose: [],
      structure: []
    },
    // Curated 25 diverse options (both high-leverage and disguised traps)
    availableBlockIds: [
      'p1-participative-leadership',
      'p2-mentorship-cadence',
      'p3-psychological-safety',
      'p4-workplace-autonomy',
      'p9-excessive-micromanagement',
      'p10-stack-ranking',
      'f1-clear-strategic-roadmaps',
      'f2-smart-kpi-cascading',
      'f3-data-informed-analytics',
      'f5-lean-process-optimization',
      'f9-unclear-objectives',
      'f11-zero-tolerance-failure',
      'i1-dedicated-rd-sandbox',
      'i2-fast-failure-experimentation',
      'i4-agile-sprint-cycles',
      'i9-departmental-silos',
      'i12-bureaucratic-committees',
      'e1-ethical-governance-framework',
      'e2-esg-supply-chain',
      'e4-whistleblower-fortress',
      'e8-greenwashing-campaigns',
      's1-cross-functional-pods',
      's2-transparent-documentation',
      's5-raci-governance-clarity',
      's8-departmental-turf-wars'
    ]
  },
  challenge: {
    id: 'challenge',
    title: 'Executive Challenge (Full 63 Options)',
    badge: 'Strategic (~5 min)',
    durationMinutes: 5,
    description: 'The ultimate management test. Choose from over 60 realistic corporate policies, culture frameworks, and operational strategies.',
    objective: 'Discern positive drivers from counterproductive pitfalls, placing optimal practices to maximize enterprise effectiveness without falling for disguised corporate traps.',
    targetAudience: 'Comprehensive classroom challenge evaluating critical management judgment.',
    initialPlacements: {
      people: [],
      performance: [],
      innovation: [],
      purpose: [],
      structure: []
    },
    // All 63 blocks!
    availableBlockIds: MANAGEMENT_BLOCKS.map(b => b.id)
  },
  repair: {
    id: 'repair',
    title: 'Repair The Organization',
    badge: 'Turnaround (~4 min)',
    durationMinutes: 4,
    description: 'NEXORA is in an operational crisis plagued by micromanagement, silos, shifting directives, greenwashing, and departmental turf wars. Diagnose and replace toxic policies.',
    objective: 'Identify and remove all dysfunctional management practices and substitute them with high-performing management principles from the 60+ options.',
    targetAudience: 'Great for learning root-cause analysis and turnaround management.',
    // Pre-loaded broken state
    initialPlacements: {
      people: [MANAGEMENT_BLOCKS.find(b => b.id === 'p9-excessive-micromanagement')!],
      performance: [MANAGEMENT_BLOCKS.find(b => b.id === 'f9-unclear-objectives')!],
      innovation: [MANAGEMENT_BLOCKS.find(b => b.id === 'i9-departmental-silos')!],
      purpose: [MANAGEMENT_BLOCKS.find(b => b.id === 'e8-greenwashing-campaigns')!],
      structure: [MANAGEMENT_BLOCKS.find(b => b.id === 's8-departmental-turf-wars')!]
    },
    // Available bench blocks to rescue the organization (all remaining 58 blocks)
    availableBlockIds: MANAGEMENT_BLOCKS.map(b => b.id)
  }
};
