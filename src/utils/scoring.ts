import { BlockColor, StructureSlot, StructureEvaluation, PlacedResultItem } from '../types/game';

export function evaluateStructure(slots: StructureSlot[]): StructureEvaluation {
  const totalSlots = slots.length;
  const filledSlots = slots.filter(s => s.block !== null);
  const filledCount = filledSlots.length;
  const isCompleted = filledCount === totalSlots;

  // Track colors
  const colorCounts: Record<BlockColor, number> = {
    red: 0,
    yellow: 0,
    blue: 0,
    green: 0,
  };

  filledSlots.forEach(s => {
    if (s.block) {
      colorCounts[s.block.color]++;
    }
  });

  const colorPercentages: Record<BlockColor, number> = {
    red: filledCount > 0 ? Math.round((colorCounts.red / filledCount) * 100) : 0,
    yellow: filledCount > 0 ? Math.round((colorCounts.yellow / filledCount) * 100) : 0,
    blue: filledCount > 0 ? Math.round((colorCounts.blue / filledCount) * 100) : 0,
    green: filledCount > 0 ? Math.round((colorCounts.green / filledCount) * 100) : 0,
  };

  // Analyze each placed block
  let correctCount = 0;
  let wrongCount = 0;
  let pointsAdded = 0;
  let pointsDeducted = 0;

  const resultsBreakdown: PlacedResultItem[] = [];

  filledSlots.forEach(slot => {
    const block = slot.block!;
    const isWrong = !!block.isWrong;

    if (isWrong) {
      wrongCount++;
      const deduction = 15;
      pointsDeducted += deduction;
      resultsBreakdown.push({
        block,
        slotLabel: slot.label,
        isWrong: true,
        scoreChange: -deduction,
        explanation: block.wrongReason || 'Management pitfall that compromises organizational performance.',
      });
    } else {
      correctCount++;
      // Base points for correct block: 10
      let addition = 10;
      // Bonus if it matches the slot's intended attribute color
      if (block.color === slot.attributeColor) {
        addition += 2;
      }
      pointsAdded += addition;
      resultsBreakdown.push({
        block,
        slotLabel: slot.label,
        isWrong: false,
        scoreChange: addition,
        explanation: `Effective management practice: ${block.principle} aligned with ${slot.targetAttribute}.`,
      });
    }
  });

  // Master perfection bonus: if all 10 slots filled and 0 wrong answers, bonus points to cap at 100
  let rawScore = pointsAdded - pointsDeducted;
  if (isCompleted && wrongCount === 0 && rawScore >= 100) {
    rawScore = 100;
  } else if (isCompleted && wrongCount === 0) {
    rawScore = 100; // Perfect 10/10 pyramid!
  }

  const finalScore = Math.max(0, Math.min(100, Math.round(rawScore)));

  // Calculate grade based on score and wrong answers
  let grade: 'S+' | 'A' | 'B' | 'C' | 'FAIL' = 'C';
  if (wrongCount >= 3) {
    grade = 'FAIL';
  } else if (wrongCount === 2) {
    grade = 'C';
  } else if (wrongCount === 1) {
    grade = finalScore >= 70 ? 'B' : 'C';
  } else if (isCompleted && wrongCount === 0) {
    grade = 'S+';
  } else if (finalScore >= 80) {
    grade = 'A';
  } else if (finalScore >= 60) {
    grade = 'B';
  } else {
    grade = 'C';
  }

  // Earthquake resistance calculation (0-100%)
  const baseSlots = slots.filter(s => s.tier === 1);
  const baseFilledCorrect = baseSlots.filter(s => s.block !== null && !s.block.isWrong).length;
  const baseRatio = baseSlots.length > 0 ? baseFilledCorrect / baseSlots.length : 1;
  const completionRatio = totalSlots > 0 ? filledCount / totalSlots : 0;
  
  let earthquakeResistance = Math.round((baseRatio * 50) + (completionRatio * 30) + (correctCount * 2));
  if (wrongCount > 0) {
    earthquakeResistance = Math.max(10, earthquakeResistance - (wrongCount * 25));
  }
  earthquakeResistance = Math.min(100, Math.max(0, earthquakeResistance));

  // Structure Name
  let structureName = 'The 10-Block Management Pyramid';
  if (wrongCount >= 3) {
    structureName = '⚠️ Fragile Organization (Multiple Pitfalls)';
  } else if (wrongCount > 0) {
    structureName = '⚠️ Partially Compromised Structure';
  } else if (isCompleted) {
    structureName = '🏆 High-Performance Master Monument';
  }

  // Recommendation message
  let recommendation = '';
  if (wrongCount > 0) {
    recommendation = `You selected ${wrongCount} wrong answer(s), deducting ${pointsDeducted} points. Review the breakdown below to see which management principles were compromised!`;
  } else if (isCompleted) {
    recommendation = 'Flawless execution! All 10 management attributes were correctly selected and placed with zero pitfalls.';
  } else {
    recommendation = `You have placed ${filledCount} of ${totalSlots} blocks with ${correctCount} correct selections so far.`;
  }

  return {
    totalSlots,
    filledSlots: filledCount,
    isCompleted,
    score: finalScore,
    grade,
    structureName,
    colorCounts,
    colorPercentages,
    earthquakeResistance,
    recommendation,
    correctCount,
    wrongCount,
    pointsAdded,
    pointsDeducted,
    resultsBreakdown,
  };
}
