/**
 * Market Regime Classification Engine
 * Analyzes cross-market divergence to determine whether macro environment is Risk-On, Risk-Off, Neutral, or High Volatility.
 */

export type MarketRegimeType = 'RISK-ON' | 'RISK-OFF' | 'NEUTRAL' | 'HIGH VOLATILITY';

export interface RegimeIndicator {
  name: string;
  value: string;
  impact: 'BULLISH' | 'BEARISH' | 'NEUTRAL';
  weight: number;
}

export interface MarketRegimeState {
  regime: MarketRegimeType;
  signalStrength: number; // 0 to 100
  confidence: 'HIGH' | 'MEDIUM' | 'LOW';
  summary: string;
  supportingIndicators: RegimeIndicator[];
  lastUpdated: string;
}

export function evaluateMarketRegime(metrics: {
  cryptoAvgChange: number;
  equityAvgChange: number;
  goldChange: number;
  volatilityIndex: number; // proxy VIX e.g. 15.5
}): MarketRegimeState {
  const { cryptoAvgChange, equityAvgChange, goldChange, volatilityIndex } = metrics;

  const indicators: RegimeIndicator[] = [
    {
      name: 'Crypto Momentum (Beta Leader)',
      value: `${cryptoAvgChange >= 0 ? '+' : ''}${cryptoAvgChange.toFixed(2)}%`,
      impact: cryptoAvgChange > 1.5 ? 'BULLISH' : cryptoAvgChange < -1.5 ? 'BEARISH' : 'NEUTRAL',
      weight: 35,
    },
    {
      name: 'Equity Breadth (S&P/Tech)',
      value: `${equityAvgChange >= 0 ? '+' : ''}${equityAvgChange.toFixed(2)}%`,
      impact: equityAvgChange > 0.5 ? 'BULLISH' : equityAvgChange < -0.5 ? 'BEARISH' : 'NEUTRAL',
      weight: 35,
    },
    {
      name: 'Safe-Haven Flow (Gold/Treasuries)',
      value: `${goldChange >= 0 ? '+' : ''}${goldChange.toFixed(2)}%`,
      impact: goldChange > 1.0 && equityAvgChange < 0 ? 'BEARISH' : 'NEUTRAL',
      weight: 15,
    },
    {
      name: 'Market Volatility Index',
      value: volatilityIndex.toFixed(1),
      impact: volatilityIndex > 22 ? 'BEARISH' : volatilityIndex < 16 ? 'BULLISH' : 'NEUTRAL',
      weight: 15,
    },
  ];

  let bullPoints = 0;
  let bearPoints = 0;

  for (const ind of indicators) {
    if (ind.impact === 'BULLISH') bullPoints += ind.weight;
    if (ind.impact === 'BEARISH') bearPoints += ind.weight;
  }

  let regime: MarketRegimeType = 'NEUTRAL';
  let signalStrength = 50;
  let summary = 'Cross-market flows are balanced with no decisive speculative bias.';

  if (volatilityIndex >= 26) {
    regime = 'HIGH VOLATILITY';
    signalStrength = Math.min(95, Math.round(volatilityIndex * 3));
    summary = 'Abnormal cross-asset volatility detected. Broad market dispersion is elevated.';
  } else if (bullPoints >= 55 && cryptoAvgChange > 0 && equityAvgChange > 0) {
    regime = 'RISK-ON';
    signalStrength = bullPoints;
    summary = 'Capital is actively rotating into speculative assets; crypto and growth equities are leading.';
  } else if (bearPoints >= 55) {
    regime = 'RISK-OFF';
    signalStrength = bearPoints;
    summary = 'Defensive positioning observed; capital retreating into cash and defensive assets.';
  }

  return {
    regime,
    signalStrength,
    confidence: signalStrength > 70 ? 'HIGH' : 'MEDIUM',
    summary,
    supportingIndicators: indicators,
    lastUpdated: new Date().toISOString(),
  };
}
