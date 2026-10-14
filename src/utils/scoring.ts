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
          // Negative block (Trap)
          negativeBlocksCount++;
          hasRisk = true;

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
  
  // Synergy 1: People + Structure alignment (Participative Leadership/Mentorship/Autonomy + Cross-Functional Pods/Transparent Wikis)
  const peopleBlocks = placements['people'] || [];
  const structureBlocks = placements['structure'] || [];
  const hasHumanLeadership = peopleBlocks.some(b => b.type === 'positive');
  const hasTeamwork = structureBlocks.some(b => b.type === 'positive');
  if (hasHumanLeadership && hasTeamwork) {
    synergyBonus += 3;
  }

  // Synergy 2: Performance + Innovation alignment (Roadmaps/Data/Lean + Sandboxes/Fast-Fail/Agile)
  const perfBlocks = placements['performance'] || [];
  const innovBlocks = placements['innovation'] || [];
  const hasRigorousPlanning = perfBlocks.some(b => b.type === 'positive');
  const hasAgileInnovation = innovBlocks.some(b => b.type === 'positive');
  if (hasRigorousPlanning && hasAgileInnovation) {
    synergyBonus += 3;
  }

  // Synergy 3: Purpose integrity (Ethical Reviews / ESG / Whistleblower / Stakeholder Model)
  const purposeBlocks = placements['purpose'] || [];
  const hasPurposeCore = purposeBlocks.some(b => b.type === 'positive');
  if (hasPurposeCore) {
    synergyBonus += 2;
  }

  // Balance Bonus: all 5 pillars have >= 14 points (no neglected pillar)
  const allPillarsHealthy = Object.values(pillarEvaluations).every(p => p && p.score >= 14);
  const balanceBonus = allPillarsHealthy ? 4 : 0;

  // Calculate final score (0 to 100)
  let rawTotal = totalRawPillarScore + (negativeBlocksCount === 0 ? (synergyBonus + balanceBonus) : 0);
  
  // Perfect ideal condition: all 5 pillars have an optimal primary positive match AND ZERO negative blocks placed
  const isPerfectIdeal = PILLARS.every(pillar => {
    const blocks = placements[pillar.id] || [];
    return blocks.some(b => b.primaryPillar === pillar.id && b.type === 'positive') &&
           blocks.every(b => b.type === 'positive');
  }) && negativeBlocksCount === 0;

  let overallScore = isPerfectIdeal ? 100 : Math.min(99, Math.max(0, rawTotal));

  // Determine Organization Status Tier
  let statusTier: OverallEvaluation['statusTier'];
  let tierDescription: string;

  if (overallScore < 40) {
    statusTier = 'UNSTABLE ORGANIZATION';
    tierDescription = 'Critical structural vulnerabilities detected. Harmful management traps or major operational voids threaten enterprise survival and workforce stability.';
  } else if (overallScore < 60) {
    statusTier = 'DEVELOPING ORGANIZATION';
    tierDescription = 'Foundational practices are emerging, but fragmented execution, misaligned policies, or latent risks prevent peak organizational velocity.';
  } else if (overallScore < 80) {
    statusTier = 'EFFECTIVE ORGANIZATION';
    tierDescription = 'Solid operational coordination with clear management competence across core areas. Minor fine-tuning needed for full enterprise synergy.';
  } else if (overallScore < 100) {
    statusTier = 'HIGH-PERFORMING ORGANIZATION';
    tierDescription = 'Exemplary synergy across people, processes, and strategic goals. Highly resilient, purpose-driven, and competitively positioned in the marketplace.';
  } else {
    statusTier = 'IDEAL ORGANIZATION ACHIEVED';
    tierDescription = 'Masterclass in organizational architecture! Flawless balance of human empowerment, disciplined performance, agile innovation, ethical purpose, and collaborative teamwork!';
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
      feedback: 'This pillar currently has no allocated management policies. An unmanaged pillar creates operational blind spots.',
      principle: 'Organizational Completeness & Balanced Scorecard (Kaplan & Norton)',
      suggestion: `Assign a dedicated strategic practice into ${pillarId.toUpperCase()} to establish its operational foundation.`
    };
  }

  // Check if any negative trap was placed
  const trap = blocks.find(b => b.type === 'negative');
  if (trap) {
    return {
      feedback: `Warning: "${trap.title}" is a deceptive management trap! ${trap.negativeImpactReason || 'It introduces hidden friction and undermines performance.'}`,
      principle: trap.principle,
      suggestion: `Replace "${trap.title}" with a healthy, empowering management policy that aligns with ${pillarId.toUpperCase()}.`
    };
  }

  // Check best positive match
  const primaryMatch = blocks.find(b => b.primaryPillar === pillarId && b.type === 'positive');
  if (primaryMatch) {
    return {
      feedback: `Outstanding alignment! "${primaryMatch.title}" directly reinforces the core mandate of ${pillarId.toUpperCase()}. ${primaryMatch.positiveImpactReason}`,
      principle: primaryMatch.principle,
      suggestion: 'Excellent selection. Ensure this practice is reinforced by leadership and transparent company-wide norms.'
    };
  }

  const secondaryMatch = blocks.find(b => b.secondaryPillars?.includes(pillarId) && b.type === 'positive');
  if (secondaryMatch) {
    return {
      feedback: `Valuable complementary practice. While "${secondaryMatch.title}" primarily targets ${secondaryMatch.primaryPillar.toUpperCase()}, it generates beneficial positive spillover here.`,
      principle: secondaryMatch.principle,
      suggestion: `Consider anchoring this pillar with a primary ${pillarId.toUpperCase()} capability for maximum impact.`
    };
  }

  const generalBlock = blocks[0];
  return {
    feedback: `"${generalBlock.title}" is a positive practice, but its impact on ${pillarId.toUpperCase()} is peripheral rather than foundational.`,
    principle: generalBlock.principle,
    suggestion: `Reallocate "${generalBlock.title}" to its primary domain and select a practice specifically tailored to ${pillarId.toUpperCase()}.`
  };
}

function generateRecommendations(evaluations: Record<PillarId, PillarEvaluation>): string[] {
  const recommendations: string[] = [];

  PILLARS.forEach(p => {
    const evaluation = evaluations[p.id];
    if (!evaluation || evaluation.score < 14) {
      if (evaluation?.hasRisk) {
        recommendations.push(`Critical Priority: Eliminate counterproductive corporate traps in ${p.title}. ${evaluation.suggestion}`);
      } else if (evaluation?.placedBlocks.length === 0) {
        recommendations.push(`Assign foundational strategic policies to empower ${p.title}.`);
      } else {
        recommendations.push(`Optimize ${p.title}: ${evaluation?.suggestion || 'Align with dedicated strategic practices.'}`);
      }
    }
  });

  if (recommendations.length === 0) {
    recommendations.push('Maintain cross-pillar synergy and conduct regular organizational learning audits to keep NEXORA at peak performance.');
  }

  return recommendations;
}
