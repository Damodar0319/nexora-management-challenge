export type BlockColor = 'red' | 'yellow' | 'blue' | 'green';

export interface GameBlock {
  id: string;
  color: BlockColor;
  title: string;
  subtitle: string;
  icon: string;
  description: string;
  power: number; // uniform display points e.g. 10
  principle: string;
  isCustom?: boolean;
  isWrong?: boolean; // Hidden flag: true if it's one of the 2 wrong answers
  wrongReason?: string; // Revealed only when checking results
}

export interface StructureSlot {
  id: string;
  tier: number; // 1 = base, 2 = mid, 3 = high, 4 = crown
  tierLabel: string;
  tierAttributeHint?: string;
  slotIndex: number;
  label: string;
  targetAttribute: string; // e.g., "Leadership & Vision"
  attributeColor: BlockColor; // 'red' | 'yellow' | 'blue' | 'green'
  attributeHint: string; // e.g., "Put Red Leadership block here"
  allowedColor?: BlockColor | 'any';
  block: GameBlock | null;
}

export interface BlueprintDefinition {
  id: string;
  name: string;
  description: string;
  icon: string;
  tagline: string;
  targetCount: number;
  layout: 'pyramid';
  tierDescriptions?: Record<number, { title: string; attributeText: string }>;
  slots: {
    id: string;
    tier: number;
    tierLabel: string;
    tierAttributeHint?: string;
    slotIndex: number;
    label: string;
    targetAttribute: string;
    attributeColor: BlockColor;
    attributeHint: string;
    allowedColor?: BlockColor | 'any';
  }[];
}

export interface PlacedResultItem {
  block: GameBlock;
  slotLabel: string;
  isWrong: boolean;
  scoreChange: number; // +10 or -15
  explanation: string;
}

export interface StructureEvaluation {
  totalSlots: number;
  filledSlots: number;
  isCompleted: boolean;
  score: number;
  grade: 'S+' | 'A' | 'B' | 'C' | 'FAIL';
  structureName: string;
  colorCounts: Record<BlockColor, number>;
  colorPercentages: Record<BlockColor, number>;
  earthquakeResistance: number; // 0 - 100%
  recommendation: string;
  correctCount: number;
  wrongCount: number;
  pointsAdded: number;
  pointsDeducted: number;
  resultsBreakdown: PlacedResultItem[];
}
