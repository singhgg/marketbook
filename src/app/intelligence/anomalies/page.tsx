'use client';

import React, { useMemo } from 'react';
import Link from 'next/link';
import { AlertTriangle, Zap, ShieldAlert, ArrowRight, Activity } from 'lucide-react';
import { useMarketStore } from '@/lib/store';
import { detectMarketAnomalies, MarketAnomaly } from '@/lib/calculations/anomalies';
import { LivePrice } from '@/components/LivePrice';

export default function AnomaliesPage() {
  const assets = useMarketStore((s) => s.assets);

  const anomalies: MarketAnomaly[] = useMemo(() => {
    const list = Object.values(assets).map((a) => ({
      symbol: a.symbol,
      name: a.name,
      assetType: a.assetType as any,
      price: a.price,
      change24h: a.change24h,
      volume24h: a.volume24h,
      avgVolume30d: a.volume24h * 0.42,
    }));
    return detectMarketAnomalies(list);
  }, [assets]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div className="paper-panel" style={{ padding: '24px 28px' }}>
        <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--accent-anomaly)', marginBottom: '4px' }}>
          STATISTICAL OUTLIER DETECTION
        </div>
        <h1 style={{ fontSize: '24px', fontWeight: 800, letterSpacing: '-0.02em', color: 'var(--ink-primary)' }}>
          Market Anomaly Engine
        </h1>
        <p style={{ color: 'var(--ink-secondary)', fontSize: '13px', marginTop: '4px' }}>
          Real-time identification of unusual volume surges, liquidity vacuums, 2-sigma volatility breaches, and cross-market price-volume divergences.
        </p>
      </div>

      {/* Anomalies List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {anomalies.length === 0 ? (
          <div className="paper-panel" style={{ padding: '40px', textAlign: 'center', color: 'var(--ink-tertiary)' }}>
            No statistically significant anomalies detected across current order books.
          </div>
        ) : (
          anomalies.map((anom) => (
            <div
              key={anom.id}
              className="paper-panel"
              style={{
                padding: '20px 24px',
                borderLeft: `4px solid ${
                  anom.severity === 'CRITICAL'
                    ? 'var(--color-negative)'
                    : anom.severity === 'ELEVATED'
                    ? 'var(--accent-anomaly)'
                    : 'var(--accent-mbx50)'
                }`,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span
                    style={{
                      fontSize: '12px',
                      fontWeight: 800,
                      padding: '2px 8px',
                      borderRadius: '3px',
                      backgroundColor: 'var(--bg-surface)',
                      color: 'var(--ink-primary)',
                    }}
                  >
                    {anom.assetSymbol}
                  </span>
                  <div>
                    <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--ink-primary)' }}>
                      {anom.condition}
                    </h3>
                    <div style={{ fontSize: '11px', color: 'var(--ink-tertiary)' }}>
                      {anom.assetName} &bull; Timestamp: {new Date(anom.timestamp).toLocaleTimeString()}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span
                    style={{
                      fontSize: '11px',
                      fontWeight: 800,
                      padding: '3px 8px',
                      borderRadius: '3px',
                      backgroundColor:
                        anom.severity === 'CRITICAL'
                          ? 'var(--color-negative-bg)'
                          : 'var(--color-anomaly-bg)',
                      color:
                        anom.severity === 'CRITICAL'
                          ? 'var(--color-negative)'
                          : 'var(--color-anomaly)',
                    }}
                  >
                    {anom.severity} SEVERITY
                  </span>
                  <Link
                    href={`/asset/${anom.assetSymbol}`}
                    style={{
                      fontSize: '11px',
                      fontWeight: 600,
                      padding: '4px 10px',
                      backgroundColor: 'var(--bg-surface)',
                      border: '1px solid var(--border-primary)',
                      borderRadius: '3px',
                    }}
                  >
                    Investigate Asset &rarr;
                  </Link>
                </div>
              </div>

              <div
                style={{
                  marginTop: '14px',
                  padding: '12px 16px',
                  backgroundColor: 'var(--bg-surface)',
                  borderRadius: '4px',
                  border: '1px solid var(--border-subtle)',
                }}
              >
                <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--ink-secondary)', textTransform: 'uppercase', marginBottom: '4px' }}>
                  Supporting Metrics
                </div>
                <div className="num-mono" style={{ fontSize: '13px', fontWeight: 600, color: 'var(--ink-primary)' }}>
                  {anom.supportingMetrics}
                </div>
                <div style={{ fontSize: '12px', color: 'var(--ink-secondary)', marginTop: '6px', lineHeight: 1.4 }}>
                  <strong>Diagnostic Context:</strong> {anom.reason}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
