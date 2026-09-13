'use client';

import React, { useMemo } from 'react';
import Link from 'next/link';
import { Shield, Activity, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useMarketStore } from '@/lib/store';
import { evaluateMarketRegime } from '@/lib/calculations/regime';

export default function MarketRegimePage() {
  const assets = useMarketStore((s) => s.assets);

  const regimeState = useMemo(() => {
    const list = Object.values(assets);
    const crypto = list.filter((a) => a.assetType === 'CRYPTO');
    const stocks = list.filter((a) => a.assetType === 'STOCK');
    const gld = list.find((a) => a.symbol === 'GLD');

    const cryptoAvg = crypto.reduce((sum, a) => sum + a.change24h, 0) / (crypto.length || 1);
    const stockAvg = stocks.reduce((sum, a) => sum + a.change24h, 0) / (stocks.length || 1);
    const goldChange = gld?.change24h ?? 0.4;

    return evaluateMarketRegime({
      cryptoAvgChange: cryptoAvg,
      equityAvgChange: stockAvg,
      goldChange,
      volatilityIndex: 16.2,
    });
  }, [assets]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div className="paper-panel" style={{ padding: '24px 28px' }}>
        <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--accent-mbx50)', marginBottom: '4px' }}>
          MACRO LIQUIDITY MONITOR
        </div>
        <h1 style={{ fontSize: '24px', fontWeight: 800, letterSpacing: '-0.02em', color: 'var(--ink-primary)' }}>
          Market Regime Classification
        </h1>
        <p style={{ color: 'var(--ink-secondary)', fontSize: '13px', marginTop: '4px' }}>
          Automated multi-factor evaluation of risk-appetite rotation across high-beta digital assets, benchmark equities, safe-haven gold, and options implied volatility.
        </p>
      </div>

      {/* Main Regime Status Showcase */}
      <div
        className="paper-panel"
        style={{
          padding: '32px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          backgroundColor: 'var(--bg-secondary)',
        }}
      >
        <div style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--ink-tertiary)', marginBottom: '8px' }}>
          Current Active Market Regime
        </div>
        <div
          style={{
            fontSize: '42px',
            fontWeight: 900,
            letterSpacing: '-0.03em',
            color:
              regimeState.regime === 'RISK-ON'
                ? 'var(--color-positive)'
                : regimeState.regime === 'RISK-OFF'
                ? 'var(--color-negative)'
                : regimeState.regime === 'HIGH VOLATILITY'
                ? 'var(--color-anomaly)'
                : 'var(--ink-primary)',
          }}
        >
          {regimeState.regime}
        </div>
        <p style={{ maxWidth: '600px', fontSize: '14px', color: 'var(--ink-secondary)', marginTop: '8px', lineHeight: 1.5 }}>
          {regimeState.summary}
        </p>

        {/* Signal Strength Gauge */}
        <div style={{ width: '100%', maxWidth: '400px', marginTop: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', fontWeight: 600, color: 'var(--ink-tertiary)', marginBottom: '6px' }}>
            <span>SIGNAL CONVICTION</span>
            <span className="num-mono">{regimeState.signalStrength} / 100 ({regimeState.confidence} CONFIDENCE)</span>
          </div>
          <div style={{ width: '100%', height: '8px', backgroundColor: 'var(--bg-surface)', borderRadius: '4px', overflow: 'hidden' }}>
            <div
              style={{
                width: `${regimeState.signalStrength}%`,
                height: '100%',
                backgroundColor:
                  regimeState.regime === 'RISK-ON'
                    ? 'var(--color-positive)'
                    : regimeState.regime === 'RISK-OFF'
                    ? 'var(--color-negative)'
                    : 'var(--accent-mbx50)',
                transition: 'width 0.5s ease',
              }}
            />
          </div>
        </div>
      </div>

      {/* Supporting Indicators Table */}
      <div className="paper-panel" style={{ padding: '24px' }}>
        <h3 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
          Supporting Macro Indicators & Factor Weights
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {regimeState.supportingIndicators.map((ind, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '12px 16px',
                backgroundColor: 'var(--bg-surface)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '4px',
              }}
            >
              <div>
                <div style={{ fontWeight: 600, fontSize: '13px' }}>{ind.name}</div>
                <div style={{ fontSize: '11px', color: 'var(--ink-tertiary)' }}>Weight: {ind.weight}%</div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <div className="num-mono" style={{ fontSize: '14px', fontWeight: 700 }}>
                  {ind.value}
                </div>
                <span
                  style={{
                    fontSize: '10px',
                    fontWeight: 700,
                    padding: '2px 6px',
                    borderRadius: '2px',
                    backgroundColor:
                      ind.impact === 'BULLISH'
                        ? 'rgba(5, 150, 105, 0.1)'
                        : ind.impact === 'BEARISH'
                        ? 'rgba(220, 38, 38, 0.1)'
                        : 'rgba(107, 114, 128, 0.1)',
                    color:
                      ind.impact === 'BULLISH'
                        ? 'var(--color-positive)'
                        : ind.impact === 'BEARISH'
                        ? 'var(--color-negative)'
                        : 'var(--ink-secondary)',
                  }}
                >
                  {ind.impact}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
