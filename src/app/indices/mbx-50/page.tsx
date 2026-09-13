'use client';

import React from 'react';
import Link from 'next/link';
import { Zap, TrendingUp, TrendingDown, Layers, BookOpen } from 'lucide-react';
import { useMarketStore } from '@/lib/store';
import { InteractiveChart } from '@/components/InteractiveChart';
import { LivePrice } from '@/components/LivePrice';

export default function MBX50IndexPage() {
  const getMBX50Data = useMarketStore((s) => s.getMBX50Data);
  const mbx = getMBX50Data();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <div className="paper-panel" style={{ padding: '24px 28px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <span
                style={{
                  fontSize: '10px',
                  fontWeight: 800,
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  padding: '2px 6px',
                  borderRadius: '2px',
                  backgroundColor: 'rgba(14, 98, 81, 0.12)',
                  color: 'var(--accent-mbx50)',
                }}
              >
                PROPRIETARY ANALYTICAL COMPOSITE
              </span>
              <span style={{ fontSize: '12px', color: 'var(--ink-tertiary)' }}>
                Rule-Based Methodology
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px' }}>
              <h1 style={{ fontSize: '28px', fontWeight: 800, color: 'var(--accent-mbx50)', letterSpacing: '-0.02em' }}>
                MBX-50
              </h1>
              <span style={{ fontSize: '18px', color: 'var(--ink-secondary)', fontWeight: 500 }}>
                MarketBook Cross-Market 50
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'baseline', gap: '16px', marginTop: '8px' }}>
              <span className="num-mono" style={{ fontSize: '28px', fontWeight: 800, color: 'var(--ink-primary)' }}>
                ${mbx.indexValue.toFixed(2)}
              </span>
              <span
                className="num-mono"
                style={{
                  fontSize: '14px',
                  fontWeight: 700,
                  color: mbx.change24h >= 0 ? 'var(--color-positive)' : 'var(--color-negative)',
                  backgroundColor: mbx.change24h >= 0 ? 'rgba(5, 150, 105, 0.08)' : 'rgba(220, 38, 38, 0.08)',
                  padding: '2px 6px',
                  borderRadius: '2px',
                }}
              >
                {mbx.change24h >= 0 ? '+' : ''}{mbx.change24h.toFixed(2)}% (24H)
              </span>
            </div>
          </div>

          {/* Performance Snapshot */}
          <div style={{ display: 'flex', gap: '12px' }}>
            <div style={{ padding: '10px 14px', backgroundColor: 'var(--bg-surface)', borderRadius: '4px', textAlign: 'center' }}>
              <div style={{ fontSize: '10px', color: 'var(--ink-tertiary)', textTransform: 'uppercase' }}>7-Day</div>
              <div className="num-mono" style={{ fontSize: '14px', fontWeight: 700, color: 'var(--color-positive)', marginTop: '2px' }}>
                +{mbx.change7d}%
              </div>
            </div>
            <div style={{ padding: '10px 14px', backgroundColor: 'var(--bg-surface)', borderRadius: '4px', textAlign: 'center' }}>
              <div style={{ fontSize: '10px', color: 'var(--ink-tertiary)', textTransform: 'uppercase' }}>30-Day</div>
              <div className="num-mono" style={{ fontSize: '14px', fontWeight: 700, color: 'var(--color-positive)', marginTop: '2px' }}>
                +{mbx.change30d}%
              </div>
            </div>
            <div style={{ padding: '10px 14px', backgroundColor: 'var(--bg-surface)', borderRadius: '4px', textAlign: 'center' }}>
              <div style={{ fontSize: '10px', color: 'var(--ink-tertiary)', textTransform: 'uppercase' }}>YTD</div>
              <div className="num-mono" style={{ fontSize: '14px', fontWeight: 700, color: 'var(--color-positive)', marginTop: '2px' }}>
                +{mbx.ytdChange}%
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Chart */}
      <InteractiveChart symbol="MBX-50" assetType="INDEX" initialPrice={mbx.indexValue} height={360} />

      {/* Top Contributors & Detractors */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
        {/* Contributors */}
        <div className="paper-panel" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
            <TrendingUp size={16} color="var(--color-positive)" />
            <h3 style={{ fontSize: '13px', fontWeight: 700, textTransform: 'uppercase' }}>
              Top Performance Contributors
            </h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {mbx.topContributors.map((c) => (
              <div
                key={c.symbol}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '10px 12px',
                  backgroundColor: 'var(--bg-surface)',
                  borderRadius: '3px',
                }}
              >
                <div>
                  <span style={{ fontWeight: 700, fontSize: '13px' }}>{c.symbol}</span>
                  <span style={{ fontSize: '11px', color: 'var(--ink-secondary)', marginLeft: '6px' }}>{c.name}</span>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span className="num-mono" style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-positive)' }}>
                    +{c.contribution.toFixed(3)}% pts
                  </span>
                  <div style={{ fontSize: '10px', color: 'var(--ink-tertiary)' }}>
                    Asset 24H: +{c.change24h.toFixed(2)}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Detractors */}
        <div className="paper-panel" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
            <TrendingDown size={16} color="var(--color-negative)" />
            <h3 style={{ fontSize: '13px', fontWeight: 700, textTransform: 'uppercase' }}>
              Top Performance Detractors
            </h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {mbx.topDetractors.map((d) => (
              <div
                key={d.symbol}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '10px 12px',
                  backgroundColor: 'var(--bg-surface)',
                  borderRadius: '3px',
                }}
              >
                <div>
                  <span style={{ fontWeight: 700, fontSize: '13px' }}>{d.symbol}</span>
                  <span style={{ fontSize: '11px', color: 'var(--ink-secondary)', marginLeft: '6px' }}>{d.name}</span>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span className="num-mono" style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-negative)' }}>
                    {d.contribution.toFixed(3)}% pts
                  </span>
                  <div style={{ fontSize: '10px', color: 'var(--ink-tertiary)' }}>
                    Asset 24H: {d.change24h.toFixed(2)}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Category Exposure & Methodology */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '20px' }}>
        <div className="paper-panel" style={{ gridColumn: 'span 5', padding: '20px' }}>
          <h3 style={{ fontSize: '13px', fontWeight: 700, textTransform: 'uppercase', marginBottom: '14px' }}>
            Sector & Category Allocation
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {mbx.categoryExposure.map((cat) => (
              <div key={cat.category}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: 600, marginBottom: '4px' }}>
                  <span>{cat.category}</span>
                  <span className="num-mono">{cat.weight}%</span>
                </div>
                <div style={{ width: '100%', height: '6px', backgroundColor: 'var(--bg-surface)', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{ width: `${cat.weight}%`, height: '100%', backgroundColor: 'var(--accent-mbx50)' }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="paper-panel" style={{ gridColumn: 'span 7', padding: '20px' }}>
          <h3 style={{ fontSize: '13px', fontWeight: 700, textTransform: 'uppercase', marginBottom: '10px' }}>
            Methodology & Index Architecture
          </h3>
          <p style={{ fontSize: '12px', color: 'var(--ink-secondary)', lineHeight: 1.6 }}>
            The <strong>MBX-50 Composite Index</strong> tracks the 50 most liquid market constituents across traditional equities, decentralized stores of value, enterprise compute hardware, and monetary commodity reserves. Rebalanced monthly using a square-root market capitalization formula with strict single-asset caps at 25% to ensure balanced cross-market exposure without excessive concentration in any single asset class.
          </p>
          <div style={{ marginTop: '14px', fontSize: '11px', color: 'var(--ink-tertiary)', borderTop: '1px solid var(--border-subtle)', paddingTop: '10px' }}>
            Base Level: 1,820.00 &bull; Calculation Frequency: Real-Time streaming continuous evaluation.
          </div>
        </div>
      </div>
    </div>
  );
}
