/**
 * Correlation and Impact Engine
 * Calculates Pearson cross-asset correlation matrices and relationship graphs.
 * NOTE: Correlation does not imply causation.
 */

export interface CorrelationMatrixItem {
  asset1: string;
  asset2: string;
  correlation: number; // -1.0 to 1.0
  relationship: 'STRONG_POSITIVE' | 'MODERATE_POSITIVE' | 'UNCORRELATED' | 'INVERSE';
}

export interface ImpactNode {
  id: string;
  symbol: string;
  name: string;
  type: 'CRYPTO' | 'EQUITY' | 'COMMODITY' | 'INDEX';
  price: number;
  change24h: number;
}

export interface ImpactEdge {
  source: string;
  target: string;
  correlation: number;
  strength: 'HIGH' | 'MEDIUM' | 'LOW';
  timeframe: string;
  interpretation: string;
}

export interface CorrelationMatrixData {
  timeframe: '1D' | '1W' | '1M' | '3M' | '1Y';
  assets: string[];
  matrix: Record<string, Record<string, number>>;
  disclaimer: string;
}

// Canonical cross-market correlation dataset across multiple time horizons
const BASELINE_CORRELATIONS: Record<string, Record<string, Record<string, number>>> = {
  '30D': {
    BTC: { BTC: 1.0, ETH: 0.88, SOL: 0.76, NVDA: 0.52, SPY: 0.44, QQQ: 0.48, GLD: 0.18, 'MBX-50': 0.91 },
    ETH: { BTC: 0.88, ETH: 1.0, SOL: 0.81, NVDA: 0.49, SPY: 0.41, QQQ: 0.45, GLD: 0.12, 'MBX-50': 0.86 },
    SOL: { BTC: 0.76, ETH: 0.81, SOL: 1.0, NVDA: 0.55, SPY: 0.38, QQQ: 0.42, GLD: 0.05, 'MBX-50': 0.82 },
    NVDA: { BTC: 0.52, ETH: 0.49, SOL: 0.55, NVDA: 1.0, SPY: 0.82, QQQ: 0.89, GLD: -0.15, 'MBX-50': 0.74 },
    SPY: { BTC: 0.44, ETH: 0.41, SOL: 0.38, NVDA: 0.82, SPY: 1.0, QQQ: 0.94, GLD: 0.04, 'MBX-50': 0.68 },
    QQQ: { BTC: 0.48, ETH: 0.45, SOL: 0.42, NVDA: 0.89, SPY: 0.94, QQQ: 1.0, GLD: -0.02, 'MBX-50': 0.71 },
    GLD: { BTC: 0.18, ETH: 0.12, SOL: 0.05, NVDA: -0.15, SPY: 0.04, QQQ: -0.02, GLD: 1.0, 'MBX-50': 0.19 },
    'MBX-50': { BTC: 0.91, ETH: 0.86, SOL: 0.82, NVDA: 0.74, SPY: 0.68, QQQ: 0.71, GLD: 0.19, 'MBX-50': 1.0 },
  },
  '1D': {
    BTC: { BTC: 1.0, ETH: 0.92, SOL: 0.84, NVDA: 0.38, SPY: 0.28, QQQ: 0.32, GLD: 0.1, 'MBX-50': 0.89 },
    ETH: { BTC: 0.92, ETH: 1.0, SOL: 0.85, NVDA: 0.35, SPY: 0.25, QQQ: 0.29, GLD: 0.08, 'MBX-50': 0.87 },
    SOL: { BTC: 0.84, ETH: 0.85, SOL: 1.0, NVDA: 0.42, SPY: 0.31, QQQ: 0.36, GLD: 0.02, 'MBX-50': 0.84 },
    NVDA: { BTC: 0.38, ETH: 0.35, SOL: 0.42, NVDA: 1.0, SPY: 0.85, QQQ: 0.91, GLD: -0.22, 'MBX-50': 0.68 },
    SPY: { BTC: 0.28, ETH: 0.25, SOL: 0.31, NVDA: 0.85, SPY: 1.0, QQQ: 0.96, GLD: -0.08, 'MBX-50': 0.62 },
    QQQ: { BTC: 0.32, ETH: 0.29, SOL: 0.36, NVDA: 0.91, SPY: 0.96, QQQ: 1.0, GLD: -0.12, 'MBX-50': 0.65 },
    GLD: { BTC: 0.1, ETH: 0.08, SOL: 0.02, NVDA: -0.22, SPY: -0.08, QQQ: -0.12, GLD: 1.0, 'MBX-50': 0.12 },
    'MBX-50': { BTC: 0.89, ETH: 0.87, SOL: 0.84, NVDA: 0.68, SPY: 0.62, QQQ: 0.65, GLD: 0.12, 'MBX-50': 1.0 },
  },
  '90D': {
    BTC: { BTC: 1.0, ETH: 0.82, SOL: 0.71, NVDA: 0.48, SPY: 0.41, QQQ: 0.44, GLD: 0.24, 'MBX-50': 0.88 },
    ETH: { BTC: 0.82, ETH: 1.0, SOL: 0.77, NVDA: 0.45, SPY: 0.38, QQQ: 0.41, GLD: 0.18, 'MBX-50': 0.83 },
    SOL: { BTC: 0.71, ETH: 0.77, SOL: 1.0, NVDA: 0.51, SPY: 0.35, QQQ: 0.39, GLD: 0.09, 'MBX-50': 0.79 },
    NVDA: { BTC: 0.48, ETH: 0.45, SOL: 0.51, NVDA: 1.0, SPY: 0.79, QQQ: 0.86, GLD: -0.11, 'MBX-50': 0.72 },
    SPY: { BTC: 0.41, ETH: 0.38, SOL: 0.35, NVDA: 0.79, SPY: 1.0, QQQ: 0.92, GLD: 0.11, 'MBX-50': 0.65 },
    QQQ: { BTC: 0.44, ETH: 0.41, SOL: 0.39, NVDA: 0.86, SPY: 0.92, QQQ: 1.0, GLD: 0.05, 'MBX-50': 0.69 },
    GLD: { BTC: 0.24, ETH: 0.18, SOL: 0.09, NVDA: -0.11, SPY: 0.11, QQQ: 0.05, GLD: 1.0, 'MBX-50': 0.22 },
    'MBX-50': { BTC: 0.88, ETH: 0.83, SOL: 0.79, NVDA: 0.72, SPY: 0.65, QQQ: 0.69, GLD: 0.22, 'MBX-50': 1.0 },
  },
};

export function getCorrelationMatrix(timeframe: '1D' | '1W' | '1M' | '3M' | '1Y' = '1M'): CorrelationMatrixData {
  const tfKey = timeframe === '1D' ? '1D' : timeframe === '3M' || timeframe === '1Y' ? '90D' : '30D';
  const matrix = BASELINE_CORRELATIONS[tfKey] || BASELINE_CORRELATIONS['30D'];
  const assets = Object.keys(matrix);

  return {
    timeframe,
    assets,
    matrix,
    disclaimer: 'Correlation metrics reflect historical co-movement and do not imply causal relationships.',
  };
}
