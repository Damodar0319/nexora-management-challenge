import { PillarId, PillarPlacements, OverallEvaluation, PillarEvaluation, ManagementBlock } from '../types/game';
import { PILLARS } from '../data/pillars';

export function calculateOrganizationEvaluation(placements: PillarPlacements): OverallEvaluation {
  const pillarEvaluations: Partial<Record<PillarId, PillarEvaluation>> = {};
  
  let totalRawPillarScore = 0;
  let totalPenalties = 0;
  let totalBlocksPlaced = 0;
  let positiveMatchesCount = 0;
  let negativeBlocksCount = 0;

  // Track best decision and biggest risk
  let bestDecision: { blockTitle: string; pillarName: string; reason: string; gain: number } | null = null;
  let biggestRisk: { blockTitle: string; pillarName: string; risk: string; damage: number } | null = null;

  // Evaluate each pillar
  PILLARS.forEach(pillar => {
    const blocks = placements[pillar.id] || [];
    totalBlocksPlaced += blocks.length;

    let pillarScore = 0;
    let hasRisk = false;
    let primaryMatchFound = false;
    let negativeBlockFound: ManagementBlock | null = null;

    if (blocks.length === 0) {
      pillarScore = 0;
    } else {
      blocks.forEach(block => {
        if (block.type === 'positive') {
          if (block.primaryPillar === pillar.id) {
            pillarScore += 18;
            primaryMatchFound = true;
            positiveMatchesCount++;

            if (!bestDecision || 18 > bestDecision.gain) {
              bestDecision = {
                blockTitle: block.title,
                pillarName: pillar.title,
                reason: block.positiveImpactReason,
                gain: 18
              };
            }
          } else if (block.secondaryPillars?.includes(pillar.id)) {
            pillarScore += 14;
            positiveMatchesCount++;

            if (!bestDecision || 14 > bestDecision.gain) {
              bestDecision = {
                blockTitle: block.title,
                pillarName: pillar.title,
                reason: `Supports ${pillar.title} through cross-functional spillover.`,
                gain: 14
              };
            }
          } else {
            // General positive but misaligned
            pillarScore += 7;
          }
        } else {
          // Negative block
          negativeBlocksCount++;
          hasRisk = true;
          negativeBlockFound = block;

          const isCritical = block.criticallyDamagedPillars?.includes(pillar.id);
          const penalty = isCritical ? 18 : 12;
          pillarScore -= penalty;
          totalPenalties += penalty;

          if (!biggestRisk || penalty > biggestRisk.damage) {
            biggestRisk = {
              blockTitle: block.title,
              pillarName: pillar.title,
              risk: block.negativeImpactReason || 'Severely damages organizational health.',
              damage: penalty
            };
          }
        }
      });
    }

    // Clamp individual pillar score between 0 and 20
    const clampedScore = Math.max(0, Math.min(20, pillarScore));
    totalRawPillarScore += clampedScore;

    // Determine pillar rating
    let rating: PillarEvaluation['rating'] = 'deficient';
    if (clampedScore === 0) rating = 'critical';
    else if (clampedScore < 10) rating = 'deficient';
    else if (clampedScore < 15) rating = 'functional';
    else if (clampedScore < 19) rating = 'strong';
    else rating = 'exemplary';

    // Generate educational feedback
    const { feedback, principle, suggestion } = generatePillarFeedback(pillar.id, blocks);

    pillarEvaluations[pillar.id] = {
      pillarId: pillar.id,
      pillarName: pillar.title,
      score: clampedScore,
      rating,
      placedBlocks: blocks,
      feedback,
      managementPrinciple: principle,
      suggestion,
      hasRisk
    };
  });

  // Calculate Synergy Bonuses
  let synergyBonus = 0;
  
  // Synergy 1: People + Structure alignment (Participative Leadership/Employee Dev + Open Communication/Cross Collaboration)
  const peopleBlocks = placements['people'] || [];
  const structureBlocks = placements['structure'] || [];
  const hasHumanLeadership = peopleBlocks.some(b => b.id === 'b2-participative-leadership' || b.id === 'b6-employee-development');
  const hasTeamwork = structureBlocks.some(b => b.id === 'b3-open-communication' || b.id === 'b8-cross-functional-collaboration');
  if (hasHumanLeadership && hasTeamwork) {
    synergyBonus += 3;
  }

  // Synergy 2: Performance + Innovation alignment (Clear Planning/Data + Innovation)
  const perfBlocks = placements['performance'] || [];
  const innovBlocks = placements['innovation'] || [];
  const hasRigorousPlanning = perfBlocks.some(b => b.id === 'b1-clear-planning' || b.id === 'b10-data-informed-decisions');
  const hasAgileInnovation = innovBlocks.some(b => b.id === 'b5-innovation-adaptability');
  if (hasRigorousPlanning && hasAgileInnovation) {
    synergyBonus += 3;
  }

  // Synergy 3: Purpose integrity (Ethical Decision Making or Sustainability on Purpose)
  const purposeBlocks = placements['purpose'] || [];
  const hasPurposeCore = purposeBlocks.some(b => b.id === 'b7-ethical-decision-making' || b.id === 'b9-sustainability');
  if (hasPurposeCore) {
    synergyBonus += 2;
  }

  // Balance Bonus: all 5 pillars have >= 14 points (no neglected pillar)
  const allPillarsHealthy = Object.values(pillarEvaluations).every(p => p && p.score >= 14);
  const balanceBonus = allPillarsHealthy ? 4 : 0;

  // Calculate final score (0 to 100)
  let rawTotal = totalRawPillarScore + (negativeBlocksCount === 0 ? (synergyBonus + balanceBonus) : 0);
  
  // If user placed 5 optimal blocks in all 5 pillars with no negatives: exact 100
  const isPerfectIdeal = PILLARS.every(pillar => {
    const blocks = placements[pillar.id] || [];
    return blocks.some(b => b.primaryPillar === pillar.id && b.type === 'positive') &&
           blocks.every(b => b.type === 'positive');
  });

  let overallScore = isPerfectIdeal ? 100 : Math.min(99, Math.max(0, rawTotal));

  // Determine Organization Status Tier
  let statusTier: OverallEvaluation['statusTier'];
  let tierDescription: string;

  if (overallScore < 40) {
    statusTier = 'UNSTABLE ORGANIZATION';
    tierDescription = 'Critical structural vulnerabilities detected. Harmful practices or major operational gaps threaten enterprise stability and workforce morale.';
  } else if (overallScore < 60) {
    statusTier = 'DEVELOPING ORGANIZATION';
    tierDescription = 'Foundational practices are emerging, but fragmented execution and misaligned pillars inhibit full organizational velocity.';
  } else if (overallScore < 80) {
    statusTier = 'EFFECTIVE ORGANIZATION';
    tierDescription = 'Solid operational coordination with clear management competence across core areas. Minor fine-tuning needed for peak agility.';
  } else if (overallScore < 100) {
    statusTier = 'HIGH-PERFORMING ORGANIZATION';
    tierDescription = 'Exemplary synergy across people, processes, and strategic goals. Highly resilient, purpose-driven, and competitively positioned.';
  } else {
    statusTier = 'IDEAL ORGANIZATION ACHIEVED';
    tierDescription = 'Masterclass in organizational architecture. Flawless balance of human empowerment, agile innovation, operational rigor, and ethical purpose!';
  }

  // Identify strongest and weakest pillars
  const sortedPillars = [...PILLARS].map(p => ({
    id: p.id,
    name: p.title,
    score: pillarEvaluations[p.id]?.score || 0
  })).sort((a, b) => b.score - a.score);

  const strongestPillar = sortedPillars[0];
  const weakestPillar = sortedPillars[sortedPillars.length - 1];

  // Recommendations
  const recommendedImprovements = generateRecommendations(pillarEvaluations as Record<PillarId, PillarEvaluation>);

  return {
    overallScore,
    statusTier,
    tierDescription,
    pillarEvaluations: pillarEvaluations as Record<PillarId, PillarEvaluation>,
    strongestPillar,
    weakestPillar,
    bestDecision,
    biggestRisk,
    recommendedImprovements,
    totalBlocksPlaced,
    synergyBonus,
    balanceBonus,
    penalties: totalPenalties
  };
}

function generatePillarFeedback(pillarId: PillarId, blocks: ManagementBlock[]): { feedback: string; principle: string; suggestion: string } {
  if (blocks.length === 0) {
    return {
      feedback: 'This pillar currently has no allocated management characteristics. An unmanaged pillar creates operational blind spots.',
      principle: 'Organizational Completeness & Balanced Scorecard',
      suggestion: `Assign a dedicated management block such as ${getRecommendedBlockTitle(pillarId)} to anchor this pillar.`
    };
  }

  const primaryBlock = blocks[0];

  // Specific feedback combinations as required by prompt
  if (primaryBlock.id === 'b11-excessive-micromanagement') {
    return {
      feedback: 'Your organization may struggle with employee autonomy and motivation. Excessive supervision can discourage initiative and reduce employee ownership.',
      principle: 'Leadership Styles & Motivation Theory (Herzberg / McGregor Theory Y)',
      suggestion: 'Replace excessive micromanagement with participative leadership, clear responsibilities, and regular feedback.'
    };
  }

  if (primaryBlock.id === 'b8-cross-functional-collaboration' && pillarId === 'structure') {
    return {
      feedback: 'Excellent choice! Cross-functional collaboration helps departments coordinate their expertise and work toward shared objectives.',
      principle: 'Coordination and Matrix Organizational Design',
      suggestion: 'Maintain open communication channels to support joint cross-departmental initiatives.'
    };
  }

  if (primaryBlock.id === 'b1-clear-planning' && pillarId === 'performance') {
    return {
      feedback: 'Strong choice. Clear objectives and resource allocation help the organization coordinate activities and evaluate progress.',
      principle: 'Planning and Performance Management (SMART Goals)',
      suggestion: 'Pair clear planning with data-informed decisions for continuous feedback loops.'
    };
  }

  if (primaryBlock.id === 'b12-departmental-silos') {
    return {
      feedback: 'Departmental silos create severe friction, hoard information, and prevent collaborative synergy across business units.',
      principle: 'Organizational Integration & Systemic Thinking',
      suggestion: 'Dismantle silos by instituting cross-functional project teams and shared performance indicators.'
    };
  }

  if (primaryBlock.id === 'b13-unclear-objectives') {
    return {
      feedback: 'Without clear objectives, team members pull in conflicting directions, wasting resources and eroding organizational momentum.',
      principle: 'Strategic Goal Formulation & Management by Objectives (MBO)',
      suggestion: 'Establish transparent, measurable key performance indicators (KPIs) and align individual roles with company mission.'
    };
  }

  if (primaryBlock.id === 'b14-poor-communication') {
    return {
      feedback: 'Information bottlenecks and non-transparent communication breed mistrust, errors, and uncoordinated operational delays.',
      principle: 'Managerial Communication Channels & Feedback Loops',
      suggestion: 'Cultivate open communication norms with transparent Town Halls, agile standups, and psychological safety.'
    };
  }

  if (primaryBlock.id === 'b15-no-accountability') {
    return {
      feedback: 'Absence of accountability leads to missed deliverables, demotivates high performers, and normalizes low operational quality.',
      principle: 'Managerial Control Systems & Responsibility Accounting',
      suggestion: 'Define distinct roles, establish regular progress audits, and celebrate accountable performance.'
    };
  }

  // Positive placements
  if (primaryBlock.primaryPillar === pillarId) {
    return {
      feedback: `Outstanding alignment! "${primaryBlock.title}" directly reinforces the core mandate of ${pillarId.toUpperCase()}. ${primaryBlock.positiveImpactReason}`,
      principle: primaryBlock.principle,
      suggestion: 'Great choice. Ensure this practice is reinforced consistently by leadership and internal policies.'
    };
  }

  if (primaryBlock.secondaryPillars?.includes(pillarId)) {
    return {
      feedback: `Valuable complementary practice. While "${primaryBlock.title}" primarily targets ${primaryBlock.primaryPillar.toUpperCase()}, it provides healthy positive spillover here.`,
      principle: primaryBlock.principle,
      suggestion: `Consider placing ${getRecommendedBlockTitle(pillarId)} here for the absolute maximum organizational impact.`
    };
  }

  return {
    feedback: `"${primaryBlock.title}" is a positive practice, but its impact on ${pillarId.toUpperCase()} is peripheral rather than foundational.`,
    principle: primaryBlock.principle,
    suggestion: `Reallocate "${primaryBlock.title}" to its primary home and place ${getRecommendedBlockTitle(pillarId)} into this pillar.`
  };
}

function getRecommendedBlockTitle(pillarId: PillarId): string {
  switch (pillarId) {
    case 'people': return '"Participative Leadership" or "Employee Development"';
    case 'performance': return '"Clear Planning" or "Data-Informed Decisions"';
    case 'innovation': return '"Innovation and Adaptability"';
    case 'purpose': return '"Ethical Decision-Making" or "Sustainability"';
    case 'structure': return '"Cross-Functional Collaboration" or "Open Communication"';
  }
}

function generateRecommendations(evaluations: Record<PillarId, PillarEvaluation>): string[] {
  const recommendations: string[] = [];

  PILLARS.forEach(p => {
    const evaluation = evaluations[p.id];
    if (!evaluation || evaluation.score < 14) {
      if (evaluation?.hasRisk) {
        recommendations.push(`Urgent: Remove toxic management practices from ${p.title}. ${evaluation.suggestion}`);
      } else if (evaluation?.placedBlocks.length === 0) {
        recommendations.push(`Empower ${p.title} by assigning an anchor practice like ${getRecommendedBlockTitle(p.id)}.`);
      } else {
        recommendations.push(`Optimize ${p.title}: ${evaluation?.suggestion || 'Align with dedicated strategic practices.'}`);
      }
    }
  });

  if (recommendations.length === 0) {
    recommendations.push('Maintain cross-pillar balance and conduct continuous organizational learning sessions to keep NEXORA at peak performance.');
  }

  return recommendations;
}
