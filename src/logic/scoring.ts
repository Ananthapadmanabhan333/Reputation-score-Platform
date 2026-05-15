/**
 * Reputation Score Platform Scoring Engine
 * 
 * Implements a weighted Bayesian Average with Time Decay.
 */

export interface Interaction {
  id: string;
  type: 'task' | 'communication' | 'feedback';
  timestamp: number;
  reliability: number; // 0-1
  professionalism: number; // 0-1
  consistency: number; // 0-1
  weight?: number;
}

export interface ScoreBreakdown {
  overall: number;
  reliability: number;
  professionalism: number;
  consistency: number;
  tier: string;
}

export const calculateScore = (interactions: Interaction[]): ScoreBreakdown => {
  if (interactions.length === 0) {
    return { overall: 500, reliability: 500, professionalism: 500, consistency: 500, tier: 'Newborn' };
  }

  const now = Date.now();
  const decayConstant = 0.0000000001; // Adjust for meaningful decay over days/months
  const platformMean = 0.5;
  const confidenceFactor = 10; // "m" in Bayesian formula

  let weightedReliability = 0;
  let weightedProfessionalism = 0;
  let weightedConsistency = 0;
  let totalWeight = 0;

  interactions.forEach((i) => {
    const age = now - i.timestamp;
    const timeWeight = Math.exp(-decayConstant * age);
    const raterWeight = i.weight || 1; // RWF (Reputation Weighted Feedback)
    const combinedWeight = timeWeight * raterWeight;

    weightedReliability += i.reliability * combinedWeight;
    weightedProfessionalism += i.professionalism * combinedWeight;
    weightedConsistency += i.consistency * combinedWeight;
    totalWeight += combinedWeight;
  });

  // Bayesian Smoothing
  const smooth = (weightedSum: number, weight: number) => {
    return (weightedSum + confidenceFactor * platformMean) / (weight + confidenceFactor);
  };

  const r = smooth(weightedReliability, totalWeight);
  const p = smooth(weightedProfessionalism, totalWeight);
  const c = smooth(weightedConsistency, totalWeight);

  // Pillar weights
  const overallRaw = (r * 0.4) + (p * 0.3) + (c * 0.3);
  const overall = Math.round(overallRaw * 1000);

  const getTier = (score: number) => {
    if (score >= 900) return 'Diamond';
    if (score >= 750) return 'Platinum';
    if (score >= 600) return 'Gold';
    if (score >= 400) return 'Silver';
    return 'Bronze';
  };

  return {
    overall,
    reliability: Math.round(r * 1000),
    professionalism: Math.round(p * 1000),
    consistency: Math.round(c * 1000),
    tier: getTier(overall),
  };
};

export const generateMockData = (count: number): Interaction[] => {
  const interactions: Interaction[] = [];
  const now = Date.now();
  const dayMs = 24 * 60 * 60 * 1000;

  for (let i = 0; i < count; i++) {
    interactions.push({
      id: Math.random().toString(36).substr(2, 9),
      type: 'task',
      timestamp: now - Math.random() * 30 * dayMs,
      reliability: 0.6 + Math.random() * 0.4,
      professionalism: 0.5 + Math.random() * 0.5,
      consistency: 0.7 + Math.random() * 0.3,
      weight: Math.random() * 2,
    });
  }
  return interactions;
};
