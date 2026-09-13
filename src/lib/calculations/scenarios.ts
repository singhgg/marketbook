/**
 * Scenario Lab Simulation Engine
 * Computes hypothetical portfolio outcomes under custom and macro stress presets.
 * Note: Clearly labeled as SIMULATION. Never presented as a prediction.
 */

export interface ScenarioHolding {
  symbol: string;
  name: string;
  category: 'CRYPTO' | 'EQUITY' | 'COMMODITY' | 'NFT';
  currentPrice: number;
  quantity: number;
}

export interface ScenarioShock {
  symbol: string;
  pctChange: number; // e.g. 0.20 for +20%
}

export interface ScenarioSimulationResult {
  preset: string;
  initialTotalValue: number;
  projectedTotalValue: number;
  absoluteImpact: number;
  percentageImpact: number;
  assetBreakdown: {
    symbol: string;
    name: string;
    initialValue: number;
    projectedValue: number;
    deltaValue: number;
    shockPct: number;
  }[];
  disclaimer: string;
}

export const SCENARIO_PRESETS: Record<string, Record<string, number>> = {
  BULL: {
    BTC: 0.25,
    ETH: 0.35,
    SOL: 0.45,
    NVDA: 0.18,
    AAPL: 0.08,
    MSFT: 0.1,
    SPY: 0.07,
    QQQ: 0.12,
    GLD: 0.02,
  },
  BEAR: {
    BTC: -0.22,
    ETH: -0.28,
    SOL: -0.35,
    NVDA: -0.15,
    AAPL: -0.09,
    MSFT: -0.08,
    SPY: -0.07,
    QQQ: -0.11,
    GLD: 0.08,
  },
  BASE: {
    BTC: 0.05,
    ETH: 0.06,
    SOL: 0.08,
    NVDA: 0.04,
    AAPL: 0.02,
    MSFT: 0.03,
    SPY: 0.02,
    QQQ: 0.03,
    GLD: 0.01,
  },
};

export function simulateScenario(
  holdings: ScenarioHolding[],
  shocks: Record<string, number>,
  presetName: string = 'CUSTOM'
): ScenarioSimulationResult {
  let initialTotalValue = 0;
  let projectedTotalValue = 0;

  const breakdown = holdings.map((h) => {
    const initialVal = h.quantity * h.currentPrice;
    const shockPct = shocks[h.symbol] ?? (shocks['DEFAULT'] ?? 0);
    const projectedVal = initialVal * (1 + shockPct);
    const deltaVal = projectedVal - initialVal;

    initialTotalValue += initialVal;
    projectedTotalValue += projectedVal;

    return {
      symbol: h.symbol,
      name: h.name,
      initialValue: Number(initialVal.toFixed(2)),
      projectedValue: Number(projectedVal.toFixed(2)),
      deltaValue: Number(deltaVal.toFixed(2)),
      shockPct: Number((shockPct * 100).toFixed(2)),
    };
  });

  const absoluteImpact = projectedTotalValue - initialTotalValue;
  const percentageImpact = initialTotalValue > 0 ? (absoluteImpact / initialTotalValue) * 100 : 0;

  return {
    preset: presetName,
    initialTotalValue: Number(initialTotalValue.toFixed(2)),
    projectedTotalValue: Number(projectedTotalValue.toFixed(2)),
    absoluteImpact: Number(absoluteImpact.toFixed(2)),
    percentageImpact: Number(percentageImpact.toFixed(2)),
    assetBreakdown: breakdown.sort((a, b) => b.deltaValue - a.deltaValue),
    disclaimer: 'SIMULATION ONLY: Hypothetical model output. Does not represent future price predictions or trading advice.',
  };
}
