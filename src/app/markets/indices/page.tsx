'use client';

import React, { useMemo } from 'react';
import Link from 'next/link';
import { Globe, ArrowRight } from 'lucide-react';
import { useMarketStore } from '@/lib/store';
import { LivePrice } from '@/components/LivePrice';

export default function IndicesMarketPage() {
  const assets = useMarketStore((s) => s.assets);
  const getMBX50Data = useMarketStore((s) => s.getMBX50Data);
  const mbxData = getMBX50Data();

  const indices = useMemo(() => {
    return Object.values(assets).filter((a) => a.assetType === 'INDEX');
  }, [assets]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div className="paper-panel" style={{ padding: '24px 28px' }}>
        <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--accent-mbx50)', marginBottom: '4px' }}>
          GLOBAL BENCHMARK SUITE
        </div>
        <h1 style={{ fontSize: '24px', fontWeight: 800, letterSpacing: '-0.02em', color: 'var(--ink-primary)' }}>
          Macro Equity & Composite Indices
        </h1>
        <p style={{ color: 'var(--ink-secondary)', fontSize: '13px', marginTop: '4px' }}>
          Comprehensive regional tracking across the United States, India, Europe, and Asia alongside MarketBook&apos;s proprietary MBX-50 cross-market composite.
        </p>
      </div>

      {/* MBX-50 Hero Card */}
      <div
        style={{
          padding: '20px 24px',
          backgroundColor: 'rgba(14, 98, 81, 0.08)',
          border: '1px solid rgba(14, 98, 81, 0.25)',
          borderRadius: '4px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
        }}
      >
        <div>
          <span style={{ fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--accent-mbx50)' }}>
            PROPRIETARY ANALYTICAL INDEX
          </span>
          <div style={{ fontSize: '20px', fontWeight: 800, color: 'var(--ink-primary)' }}>
            MBX-50 (MarketBook Cross-Market Composite)
          </div>
          <div style={{ fontSize: '12px', color: 'var(--ink-secondary)', marginTop: '2px' }}>
            50-asset weighted index blending store of value crypto, compute infrastructure, and core macro equities.
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{ textAlign: 'right' }}>
            <div className="num-mono" style={{ fontSize: '24px', fontWeight: 800, color: 'var(--accent-mbx50)' }}>
              ${mbxData.indexValue.toFixed(2)}
            </div>
            <div className="num-mono" style={{ fontSize: '12px', fontWeight: 600, color: mbxData.change24h >= 0 ? 'var(--color-positive)' : 'var(--color-negative)' }}>
              {mbxData.change24h >= 0 ? '+' : ''}{mbxData.change24h.toFixed(2)}% (24H)
            </div>
          </div>

          <Link
            href="/indices/mbx-50"
            style={{
              padding: '8px 16px',
              backgroundColor: 'var(--accent-mbx50)',
              color: '#FFFFFF',
              borderRadius: '3px',
              fontWeight: 600,
              fontSize: '12px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <span>Methodology & Breakdown</span>
            <ArrowRight size={12} />
          </Link>
        </div>
      </div>

      <div className="paper-panel" style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
          <thead>
            <tr style={{ backgroundColor: 'var(--bg-surface)', borderBottom: '1px solid var(--border-primary)', color: 'var(--ink-secondary)', fontSize: '11px', textTransform: 'uppercase' }}>
              <th style={{ padding: '12px 16px' }}>Index</th>
              <th style={{ padding: '12px 16px' }}>Benchmark Name</th>
              <th style={{ padding: '12px 16px', textAlign: 'right' }}>Level</th>
              <th style={{ padding: '12px 16px', textAlign: 'right' }}>24H Change</th>
              <th style={{ padding: '12px 16px' }}>Region</th>
              <th style={{ padding: '12px 16px', textAlign: 'right' }}>Constituent Count</th>
            </tr>
          </thead>
          <tbody>
            {indices.map((idx) => (
              <tr
                key={idx.symbol}
                style={{ borderBottom: '1px solid var(--border-subtle)', transition: 'background-color 0.15s ease' }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--bg-surface)')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
              >
                <td style={{ padding: '12px 16px' }}>
                  <Link href={idx.symbol === 'MBX-50' ? '/indices/mbx-50' : `/asset/${idx.symbol}`} style={{ fontWeight: 800, color: 'var(--accent-stocks)' }}>
                    {idx.symbol}
                  </Link>
                </td>
                <td style={{ padding: '12px 16px' }}>
                  <div style={{ fontWeight: 600, color: 'var(--ink-primary)' }}>{idx.name}</div>
                </td>
                <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                  <LivePrice symbol={idx.symbol} fallbackPrice={idx.price} prefix="" size="md" />
                </td>
                <td className="num-mono" style={{ padding: '12px 16px', textAlign: 'right', fontWeight: 600, color: idx.change24h >= 0 ? 'var(--color-positive)' : 'var(--color-negative)' }}>
                  {idx.change24h >= 0 ? '+' : ''}{idx.change24h.toFixed(2)}%
                </td>
                <td style={{ padding: '12px 16px' }}>
                  <span style={{ fontSize: '11px', color: 'var(--ink-secondary)', backgroundColor: 'var(--bg-surface)', padding: '2px 6px', borderRadius: '3px' }}>
                    {idx.region || 'Global'}
                  </span>
                </td>
                <td className="num-mono" style={{ padding: '12px 16px', textAlign: 'right', color: 'var(--ink-secondary)' }}>
                  {idx.symbol === 'MBX-50' ? '50' : idx.symbol === 'SPX' ? '503' : idx.symbol === 'NIFTY50' ? '50' : '100'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
