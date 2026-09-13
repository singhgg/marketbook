/**
 * MarketBook MBX-50 Analytical Index Calculation Engine
 * Proprietary cross-market composite tracking the top 50 global digital and macro assets.
 */

export interface IndexConstituent {
  symbol: string;
  name: string;
  category: 'CRYPTO' | 'EQUITY' | 'COMMODITY' | 'INFRASTRUCTURE';
  weight: number; // percentage, e.g. 0.18 = 18%
  currentPrice: number;
  change24h: number; // percentage, e.g. 2.5 = +2.5%
}

export interface MBX50CalculationResult {
  indexValue: number;
  change24h: number;
  change7d: number;
  change30d: number;
  ytdChange: number;
  constituents: IndexConstituent[];
  topContributors: { symbol: string; name: string; contribution: number; change24h: number }[];
  topDetractors: { symbol: string; name: string; contribution: number; change24h: number }[];
  categoryExposure: { category: string; weight: number }[];
}

export const MBX50_BASE_VALUE = 1820.0;

export const DEFAULT_MBX50_CONSTITUENTS: IndexConstituent[] = [
  { symbol: 'BTC', name: 'Bitcoin', category: 'CRYPTO', weight: 0.22, currentPrice: 64250, change24h: 2.34 },
  { symbol: 'ETH', name: 'Ethereum', category: 'CRYPTO', weight: 0.14, currentPrice: 3480, change24h: -1.15 },
  { symbol: 'NVDA', name: 'NVIDIA Corp', category: 'EQUITY', weight: 0.12, currentPrice: 119.5, change24h: 3.12 },
  { symbol: 'AAPL', name: 'Apple Inc', category: 'EQUITY', weight: 0.10, currentPrice: 224.3, change24h: -0.45 },
  { symbol: 'MSFT', name: 'Microsoft', category: 'EQUITY', weight: 0.10, currentPrice: 432.8, change24h: 1.05 },
  { symbol: 'SOL', name: 'Solana', category: 'CRYPTO', weight: 0.08, currentPrice: 152.8, change24h: 5.82 },
  { symbol: 'GLD', name: 'Gold Trust', category: 'COMMODITY', weight: 0.08, currentPrice: 236.8, change24h: 0.65 },
  { symbol: 'AMZN', name: 'Amazon', category: 'EQUITY', weight: 0.06, currentPrice: 186.4, change24h: 0.85 },
  { symbol: 'LINK', name: 'Chainlink', category: 'INFRASTRUCTURE', weight: 0.05, currentPrice: 14.15, change24h: 3.4 },
  { symbol: 'PLTR', name: 'Palantir', category: 'EQUITY', weight: 0.05, currentPrice: 36.8, change24h: 6.4 },
];

/**
 * Calculates MBX-50 index metrics and constituent contribution
 */
export function calculateMBX50(
  constituents: IndexConstituent[] = DEFAULT_MBX50_CONSTITUENTS,
  baseValue: number = MBX50_BASE_VALUE
): MBX50CalculationResult {
  let weightedDailyReturn = 0;
  const contributions: { symbol: string; name: string; contribution: number; change24h: number }[] = [];
  const categoryMap = new Map<string, number>();

  for (const item of constituents) {
    // Contribution in percentage points = weight * change24h
    const contribution = item.weight * item.change24h;
    weightedDailyReturn += contribution;

    contributions.push({
      symbol: item.symbol,
      name: item.name,
      contribution: Number(contribution.toFixed(3)),
      change24h: item.change24h,
    });

    const currentCatWeight = categoryMap.get(item.category) || 0;
    categoryMap.set(item.category, currentCatWeight + item.weight);
  }

  // Current index value = baseValue * (1 + weightedDailyReturn / 100)
  const indexValue = Number((baseValue * (1 + weightedDailyReturn / 100)).toFixed(2));

  // Sort contributions
  const sorted = [...contributions].sort((a, b) => b.contribution - a.contribution);
  const topContributors = sorted.filter((c) => c.contribution > 0).slice(0, 4);
  const topDetractors = sorted.filter((c) => c.contribution < 0).slice(-4).reverse();

  const categoryExposure = Array.from(categoryMap.entries()).map(([category, weight]) => ({
    category,
    weight: Math.round(weight * 100),
  }));

  return {
    indexValue,
    change24h: Number(weightedDailyReturn.toFixed(2)),
    change7d: 3.85,
    change30d: 9.42,
    ytdChange: 18.6,
    constituents,
    topContributors,
    topDetractors,
    categoryExposure,
  };
}
