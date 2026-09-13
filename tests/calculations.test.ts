import { describe, it, expect } from 'vitest';
import { calculateMBX50, DEFAULT_MBX50_CONSTITUENTS } from '../src/lib/calculations/mbx50';
import { evaluateMarketRegime } from '../src/lib/calculations/regime';
import { detectMarketAnomalies } from '../src/lib/calculations/anomalies';
import { getCorrelationMatrix } from '../src/lib/calculations/correlations';
import { simulateScenario } from '../src/lib/calculations/scenarios';
import { computePortfolioValuation } from '../src/lib/calculations/portfolio';
import { getUSEquityMarketStatus, getAssetMarketStatus } from '../src/lib/calculations/marketHours';

describe('MarketBook Calculation Engines', () => {
  it('calculates MBX-50 weighted returns and contributors accurately', () => {
    const res = calculateMBX50(DEFAULT_MBX50_CONSTITUENTS, 1820);
    expect(res.indexValue).toBeGreaterThan(0);
    expect(typeof res.change24h).toBe('number');
    expect(res.topContributors.length).toBeGreaterThan(0);
    expect(res.categoryExposure.length).toBeGreaterThan(0);
  });

  it('evaluates market regime correctly for Risk-On and Risk-Off conditions', () => {
    const riskOn = evaluateMarketRegime({
      cryptoAvgChange: 4.5,
      equityAvgChange: 1.8,
      goldChange: -0.2,
      volatilityIndex: 14.2,
    });
    expect(riskOn.regime).toBe('RISK-ON');
    expect(riskOn.signalStrength).toBeGreaterThanOrEqual(55);

    const highVol = evaluateMarketRegime({
      cryptoAvgChange: -6.2,
      equityAvgChange: -3.5,
      goldChange: 2.1,
      volatilityIndex: 31.0,
    });
    expect(highVol.regime).toBe('HIGH VOLATILITY');
  });

  it('detects volume and price anomalies with correct conditions and severity', () => {
    const anomalies = detectMarketAnomalies([
      {
        symbol: 'TEST_VOL',
        name: 'Test Volume Token',
        assetType: 'CRYPTO',
        price: 100,
        change24h: 1.5,
        volume24h: 10000000,
        avgVolume30d: 3000000, // >3.3x volume
      },
      {
        symbol: 'TEST_SPIKE',
        name: 'Test Spike Equity',
        assetType: 'STOCK',
        price: 50,
        change24h: 14.2, // >4.5% equity threshold
        volume24h: 5000000,
        avgVolume30d: 4800000,
      },
    ]);

    expect(anomalies.length).toBeGreaterThanOrEqual(2);
    expect(anomalies.some((a) => a.assetSymbol === 'TEST_VOL')).toBe(true);
    expect(anomalies.some((a) => a.assetSymbol === 'TEST_SPIKE')).toBe(true);
  });

  it('computes Pearson correlation matrix and disclaimers', () => {
    const matrixData = getCorrelationMatrix('1M');
    expect(matrixData.assets).toContain('BTC');
    expect(matrixData.assets).toContain('ETH');
    expect(matrixData.matrix['BTC']['ETH']).toBeCloseTo(0.88, 1);
    expect(matrixData.disclaimer).toContain('Correlation metrics reflect');
  });

  it('simulates portfolio scenarios without mutating real assets', () => {
    const holdings = [
      { symbol: 'BTC', name: 'Bitcoin', category: 'CRYPTO' as const, currentPrice: 60000, quantity: 2 },
      { symbol: 'NVDA', name: 'NVIDIA', category: 'EQUITY' as const, currentPrice: 100, quantity: 50 },
    ];
    // Initial: (2 * 60000) + (50 * 100) = 120,000 + 5,000 = 125,000
    const res = simulateScenario(holdings, { BTC: 0.1, NVDA: -0.2 }, 'CUSTOM');
    expect(res.initialTotalValue).toBe(125000);
    // BTC delta: +12,000. NVDA delta: -1,000. Net: +11,000 => 136,000
    expect(res.projectedTotalValue).toBe(136000);
    expect(res.absoluteImpact).toBe(11000);
    expect(res.percentageImpact).toBeCloseTo(8.8, 1);
  });

  it('recalculates live portfolio P&L dynamically', () => {
    const holdings = [
      {
        id: 'h1',
        assetId: 'a1',
        symbol: 'BTC',
        name: 'Bitcoin',
        assetType: 'CRYPTO' as const,
        quantity: 1,
        averageCost: 50000,
        currentPrice: 60000,
        change24h: 5.0,
      },
    ];

    const valuation = computePortfolioValuation(holdings);
    expect(valuation.totalValue).toBe(60000);
    expect(valuation.totalCost).toBe(50000);
    expect(valuation.unrealizedPnL).toBe(10000);
    expect(valuation.unrealizedPnLPct).toBe(20.0);
  });

  it('verifies market hours correctly for crypto and equities', () => {
    const cryptoStatus = getAssetMarketStatus('CRYPTO');
    expect(cryptoStatus.isOpen).toBe(true);
    expect(cryptoStatus.statusText).toBe('LIVE');

    const equityStatus = getUSEquityMarketStatus(new Date('2026-09-13T12:00:00Z')); // Sunday
    expect(equityStatus.isOpen).toBe(false);
    expect(equityStatus.statusText).toBe('MARKET CLOSED');
  });
});
