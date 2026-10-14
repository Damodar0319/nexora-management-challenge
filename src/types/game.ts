export type PillarId = 'people' | 'performance' | 'innovation' | 'purpose' | 'structure';

export type BlockType = 'positive' | 'negative';

export interface ManagementBlock {
  id: string;
  blockNumber: number;
  title: string;
  type: BlockType;
  description: string;
  iconName: string;
  // Core management principle associated with this characteristic
  principle: string;
  // Which pillar gets the highest baseline synergy (+20)
  primaryPillar: PillarId;
  // Secondary pillar that also gets strong synergy (+12 to +16)
  secondaryPillars?: PillarId[];
  // If negative, which pillars suffer severe damage
  criticallyDamagedPillars?: PillarId[];
  // Educational rationales
  positiveImpactReason: string;
  negativeImpactReason?: string;
}

export interface OrganizationalPillarInfo {
  id: PillarId;
  title: string;
  subtitle: string;
  iconName: string;
  accentColor: string;
  represents: string[];
  description: string;
}

export type GameMode = 'quick' | 'challenge' | 'repair';

export type PillarPlacements = Record<PillarId, ManagementBlock[]>;

export interface PillarEvaluation {
  pillarId: PillarId;
  pillarName: string;
  score: number; // 0 to 20 normalized
  rating: 'critical' | 'deficient' | 'functional' | 'strong' | 'exemplary';
  placedBlocks: ManagementBlock[];
  feedback: string;
  managementPrinciple: string;
  suggestion: string;
  hasRisk: boolean;
}

export interface OverallEvaluation {
  overallScore: number; // 0 to 100
  statusTier: 'UNSTABLE ORGANIZATION' | 'DEVELOPING ORGANIZATION' | 'EFFECTIVE ORGANIZATION' | 'HIGH-PERFORMING ORGANIZATION' | 'IDEAL ORGANIZATION ACHIEVED';
  tierDescription: string;
  pillarEvaluations: Record<PillarId, PillarEvaluation>;
  strongestPillar: { id: PillarId; name: string; score: number };
  weakestPillar: { id: PillarId; name: string; score: number };
  bestDecision: { blockTitle: string; pillarName: string; reason: string } | null;
  biggestRisk: { blockTitle: string; pillarName: string; risk: string } | null;
  recommendedImprovements: string[];
  totalBlocksPlaced: number;
  synergyBonus: number;
  balanceBonus: number;
  penalties: number;
}
