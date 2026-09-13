'use client';

import React, { useMemo } from 'react';
import Link from 'next/link';
import { Layers } from 'lucide-react';
import { useMarketStore } from '@/lib/store';
import { LivePrice } from '@/components/LivePrice';

export default function ETFsMarketPage() {
  const assets = useMarketStore((s) => s.assets);

  const etfs = useMemo(() => {
    return Object.values(assets).filter((a) => a.assetType === 'ETF');
  }, [assets]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div className="paper-panel" style={{ padding: '24px 28px' }}>
        <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--accent-mbx50)', marginBottom: '4px' }}>
          EXCHANGE-TRADED FUNDS
        </div>
        <h1 style={{ fontSize: '24px', fontWeight: 800, letterSpacing: '-0.02em', color: 'var(--ink-primary)' }}>
          ETF Baskets & Macro Liquid Proxies
        </h1>
        <p style={{ color: 'var(--ink-secondary)', fontSize: '13px', marginTop: '4px' }}>
          Track broad equity indices, precious metals, and digital asset spot trusts with fee ratios and top constituents.
        </p>
      </div>

      <div className="paper-panel" style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
          <thead>
            <tr style={{ backgroundColor: 'var(--bg-surface)', borderBottom: '1px solid var(--border-primary)', color: 'var(--ink-secondary)', fontSize: '11px', textTransform: 'uppercase' }}>
              <th style={{ padding: '12px 16px' }}>Ticker</th>
              <th style={{ padding: '12px 16px' }}>Fund Name</th>
              <th style={{ padding: '12px 16px', textAlign: 'right' }}>Price</th>
              <th style={{ padding: '12px 16px', textAlign: 'right' }}>24H Change</th>
              <th style={{ padding: '12px 16px', textAlign: 'right' }}>Volume</th>
              <th style={{ padding: '12px 16px', textAlign: 'right' }}>AUM</th>
              <th style={{ padding: '12px 16px' }}>Category</th>
              <th style={{ padding: '12px 16px', textAlign: 'right' }}>Expense Ratio</th>
            </tr>
          </thead>
          <tbody>
            {etfs.map((etf) => (
              <tr
                key={etf.symbol}
                style={{ borderBottom: '1px solid var(--border-subtle)', transition: 'background-color 0.15s ease' }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--bg-surface)')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
              >
                <td style={{ padding: '12px 16px' }}>
                  <Link href={`/asset/${etf.symbol}`} style={{ fontWeight: 800, color: 'var(--accent-stocks)' }}>
                    {etf.symbol}
                  </Link>
                </td>
                <td style={{ padding: '12px 16px' }}>
                  <div style={{ fontWeight: 600, color: 'var(--ink-primary)' }}>{etf.name}</div>
                </td>
                <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                  <LivePrice symbol={etf.symbol} fallbackPrice={etf.price} size="md" />
                </td>
                <td className="num-mono" style={{ padding: '12px 16px', textAlign: 'right', fontWeight: 600, color: etf.change24h >= 0 ? 'var(--color-positive)' : 'var(--color-negative)' }}>
                  {etf.change24h >= 0 ? '+' : ''}{etf.change24h.toFixed(2)}%
                </td>
                <td className="num-mono" style={{ padding: '12px 16px', textAlign: 'right' }}>
                  {(etf.volume24h / 1e6).toFixed(1)}M
                </td>
                <td className="num-mono" style={{ padding: '12px 16px', textAlign: 'right', fontWeight: 600 }}>
                  {etf.aum ? `$${(etf.aum / 1e9).toFixed(1)}B` : '—'}
                </td>
                <td style={{ padding: '12px 16px' }}>
                  <span style={{ fontSize: '11px', color: 'var(--ink-secondary)', backgroundColor: 'var(--bg-surface)', padding: '2px 6px', borderRadius: '3px' }}>
                    {etf.category || 'Large Blend'}
                  </span>
                </td>
                <td className="num-mono" style={{ padding: '12px 16px', textAlign: 'right', color: 'var(--ink-secondary)' }}>
                  {etf.expenseRatio ? `${(etf.expenseRatio).toFixed(2)}%` : '—'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
