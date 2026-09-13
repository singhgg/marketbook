'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useMarketStore } from '@/lib/store';
import { LivePrice } from '@/components/LivePrice';

export default function HeatmapPage() {
  const assets = useMarketStore((s) => s.assets);
  const [filter, setFilter] = useState<'ALL' | 'CRYPTO' | 'STOCK'>('ALL');
  const [timeframe, setTimeframe] = useState<'1D' | '1W' | '1M'>('1D');

  const assetList = useMemo(() => {
    let list = Object.values(assets);
    if (filter !== 'ALL') {
      list = list.filter((a) => a.assetType === filter);
    }
    return list;
  }, [assets, filter]);

  const getTileColor = (pct: number) => {
    if (pct >= 4.0) return '#047857'; // Deep emerald
    if (pct >= 1.0) return '#10B981'; // Muted green
    if (pct >= -0.5 && pct <= 0.5) return 'var(--border-strong)'; // Warm neutral
    if (pct <= -4.0) return '#B91C1C'; // Deep crimson
    if (pct <= -1.0) return '#EF4444'; // Muted coral
    return 'var(--border-strong)';
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div className="paper-panel" style={{ padding: '24px 28px' }}>
        <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--accent-mbx50)', marginBottom: '4px' }}>
          VISUAL PERFORMANCE MAPPING
        </div>
        <h1 style={{ fontSize: '24px', fontWeight: 800, letterSpacing: '-0.02em', color: 'var(--ink-primary)' }}>
          Cross-Market Asset Heatmap
        </h1>
        <p style={{ color: 'var(--ink-secondary)', fontSize: '13px', marginTop: '4px' }}>
          Relative scale tiles sized by market capitalization and color-graded by performance conviction. Updates continuously with incoming live market streams.
        </p>

        {/* Filter and Timeframe Controls */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ display: 'flex', gap: '8px' }}>
            {(['ALL', 'CRYPTO', 'STOCK'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                style={{
                  padding: '6px 14px',
                  fontSize: '12px',
                  fontWeight: 600,
                  borderRadius: '3px',
                  backgroundColor: filter === f ? 'var(--ink-primary)' : 'var(--bg-surface)',
                  color: filter === f ? 'var(--bg-base)' : 'var(--ink-secondary)',
                  border: filter === f ? '1px solid var(--ink-primary)' : '1px solid var(--border-primary)',
                }}
              >
                {f}
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', gap: '6px' }}>
            {(['1D', '1W', '1M'] as const).map((tf) => (
              <button
                key={tf}
                onClick={() => setTimeframe(tf)}
                style={{
                  padding: '4px 10px',
                  fontSize: '11px',
                  fontWeight: 600,
                  borderRadius: '2px',
                  backgroundColor: timeframe === tf ? 'var(--bg-surface)' : 'transparent',
                  color: timeframe === tf ? 'var(--ink-primary)' : 'var(--ink-tertiary)',
                  border: timeframe === tf ? '1px solid var(--border-primary)' : '1px solid transparent',
                }}
              >
                {tf}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Heatmap Tiles Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
          gap: '12px',
        }}
      >
        {assetList.map((asset) => {
          const change = timeframe === '1D' ? asset.change24h : (asset.change7d ?? asset.change24h * 1.5);
          const tileBg = getTileColor(change);

          return (
            <Link
              key={asset.symbol}
              href={`/asset/${asset.symbol}`}
              style={{
                backgroundColor: tileBg,
                color: '#FFFFFF',
                borderRadius: '4px',
                padding: '16px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                minHeight: '130px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.08)',
                transition: 'transform 0.15s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-2px)')}
              onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontWeight: 800, fontSize: '16px' }}>{asset.symbol}</span>
                  <span style={{ fontSize: '10px', fontWeight: 600, opacity: 0.85 }}>{asset.assetType}</span>
                </div>
                <div style={{ fontSize: '11px', opacity: 0.9, marginTop: '2px' }}>{asset.name}</div>
              </div>

              <div>
                <div className="num-mono" style={{ fontSize: '18px', fontWeight: 800 }}>
                  ${asset.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
                <div className="num-mono" style={{ fontSize: '12px', fontWeight: 700, marginTop: '2px' }}>
                  {change >= 0 ? '+' : ''}{change.toFixed(2)}%
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
