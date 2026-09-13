'use client';

import React, { useState } from 'react';
import { Layers, Info, ArrowUpDown } from 'lucide-react';
import { getCorrelationMatrix } from '@/lib/calculations/correlations';

export default function CorrelationLabPage() {
  const [timeframe, setTimeframe] = useState<'1D' | '1W' | '1M' | '3M' | '1Y'>('1M');
  const matrixData = getCorrelationMatrix(timeframe);

  const assets = matrixData.assets;
  const matrix = matrixData.matrix;

  const getHeatmapColor = (val: number) => {
    if (val === 1) return '#EFE9DD';
    if (val >= 0.75) return 'rgba(5, 150, 105, 0.25)';
    if (val >= 0.4) return 'rgba(5, 150, 105, 0.12)';
    if (val >= 0) return 'rgba(107, 114, 128, 0.08)';
    if (val >= -0.2) return 'rgba(220, 38, 38, 0.1)';
    return 'rgba(220, 38, 38, 0.25)';
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div className="paper-panel" style={{ padding: '24px 28px' }}>
        <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--accent-stocks)', marginBottom: '4px' }}>
          MULTI-ASSET COMPARISON & CO-MOVEMENT
        </div>
        <h1 style={{ fontSize: '24px', fontWeight: 800, letterSpacing: '-0.02em', color: 'var(--ink-primary)' }}>
          Correlation Lab & Cross-Asset Matrix
        </h1>
        <p style={{ color: 'var(--ink-secondary)', fontSize: '13px', marginTop: '4px' }}>
          Evaluate statistical Pearson correlation coefficients (r &isin; [-1.0, +1.0]) between core equities, crypto assets, commodities, and benchmark indices.
        </p>

        {/* Timeframe Switcher */}
        <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
          {(['1D', '1W', '1M', '3M', '1Y'] as const).map((tf) => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf)}
              style={{
                padding: '6px 14px',
                fontSize: '12px',
                fontWeight: 600,
                borderRadius: '3px',
                backgroundColor: timeframe === tf ? 'var(--ink-primary)' : 'var(--bg-surface)',
                color: timeframe === tf ? 'var(--bg-base)' : 'var(--ink-secondary)',
                border: timeframe === tf ? '1px solid var(--ink-primary)' : '1px solid var(--border-primary)',
              }}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>

      {/* Correlation Matrix Surface */}
      <div className="paper-panel" style={{ padding: '24px', overflowX: 'auto' }}>
        <h3 style={{ fontSize: '14px', fontWeight: 700, textTransform: 'uppercase', marginBottom: '16px' }}>
          Pearson Correlation Matrix ({timeframe})
        </h3>

        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'center', fontSize: '12px' }}>
          <thead>
            <tr>
              <th style={{ padding: '10px', textAlign: 'left', color: 'var(--ink-tertiary)' }}>ASSET</th>
              {assets.map((a) => (
                <th key={a} style={{ padding: '10px', fontWeight: 700, color: 'var(--ink-primary)' }}>
                  {a}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {assets.map((rowAsset) => (
              <tr key={rowAsset} style={{ borderTop: '1px solid var(--border-subtle)' }}>
                <td style={{ padding: '10px', textAlign: 'left', fontWeight: 700, color: 'var(--ink-primary)' }}>
                  {rowAsset}
                </td>
                {assets.map((colAsset) => {
                  const val = matrix[rowAsset]?.[colAsset] ?? 0;
                  return (
                    <td
                      key={colAsset}
                      className="num-mono"
                      style={{
                        padding: '10px',
                        backgroundColor: getHeatmapColor(val),
                        fontWeight: 600,
                        color: val >= 0.7 ? '#047857' : val < 0 ? '#B91C1C' : 'var(--ink-primary)',
                        border: '1px solid var(--bg-base)',
                      }}
                    >
                      {val.toFixed(2)}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>

        {/* Legend */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '20px', marginTop: '20px', fontSize: '11px', color: 'var(--ink-secondary)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '12px', height: '12px', backgroundColor: 'rgba(5, 150, 105, 0.25)', borderRadius: '2px' }} />
            <span>Strong Positive (&gt; +0.70)</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '12px', height: '12px', backgroundColor: 'rgba(107, 114, 128, 0.1)', borderRadius: '2px' }} />
            <span>Uncorrelated (-0.20 to +0.40)</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '12px', height: '12px', backgroundColor: 'rgba(220, 38, 38, 0.25)', borderRadius: '2px' }} />
            <span>Inverse Hedge (&lt; -0.20)</span>
          </div>
        </div>

        <div style={{ marginTop: '20px', padding: '12px', backgroundColor: 'var(--bg-surface)', borderRadius: '4px', fontSize: '11px', color: 'var(--ink-tertiary)', textAlign: 'center' }}>
          {matrixData.disclaimer}
        </div>
      </div>
    </div>
  );
}
