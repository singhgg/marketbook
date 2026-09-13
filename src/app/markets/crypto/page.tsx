'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Search, ArrowUpDown, Filter, TrendingUp, TrendingDown } from 'lucide-react';
import { useMarketStore } from '@/lib/store';
import { LivePrice } from '@/components/LivePrice';

export default function CryptoMarketPage() {
  const assets = useMarketStore((s) => s.assets);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'ALL' | 'GAINERS' | 'LOSERS'>('ALL');
  const [sortBy, setSortBy] = useState<'rank' | 'price' | 'change24h' | 'volume24h' | 'marketCap'>('rank');
  const [sortAsc, setSortAsc] = useState(true);

  const cryptoAssets = useMemo(() => {
    return Object.values(assets).filter((a) => a.assetType === 'CRYPTO');
  }, [assets]);

  const filteredAssets = useMemo(() => {
    let list = cryptoAssets.filter(
      (a) =>
        a.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (activeTab === 'GAINERS') {
      list = list.filter((a) => a.change24h > 0);
    } else if (activeTab === 'LOSERS') {
      list = list.filter((a) => a.change24h < 0);
    }

    return list.sort((a, b) => {
      let valA: any = a[sortBy] ?? 0;
      let valB: any = b[sortBy] ?? 0;
      if (sortBy === 'rank') {
        valA = a.rank ?? 999;
        valB = b.rank ?? 999;
      }
      return sortAsc ? (valA > valB ? 1 : -1) : valA < valB ? 1 : -1;
    });
  }, [cryptoAssets, searchQuery, activeTab, sortBy, sortAsc]);

  const toggleSort = (field: typeof sortBy) => {
    if (sortBy === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortBy(field);
      setSortAsc(false);
    }
  };

  const renderSparkline = (points?: number[], change24h: number = 0) => {
    if (!points || points.length === 0) return <span style={{ color: 'var(--ink-muted)' }}>—</span>;
    const min = Math.min(...points);
    const max = Math.max(...points);
    const range = max - min || 1;
    const width = 80;
    const height = 24;
    const coords = points
      .map((p, idx) => {
        const x = (idx / (points.length - 1)) * width;
        const y = height - ((p - min) / range) * (height - 4) - 2;
        return `${x},${y}`;
      })
      .join(' ');

    const strokeColor = change24h >= 0 ? 'var(--color-positive)' : 'var(--color-negative)';

    return (
      <svg width={width} height={height} style={{ overflow: 'visible' }}>
        <polyline fill="none" stroke={strokeColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" points={coords} />
      </svg>
    );
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Page Header */}
      <div className="paper-panel" style={{ padding: '24px 28px' }}>
        <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--accent-btc)', marginBottom: '4px' }}>
          DECENTRALIZED ASSET UNIVERSE
        </div>
        <h1 style={{ fontSize: '24px', fontWeight: 800, letterSpacing: '-0.02em', color: 'var(--ink-primary)' }}>
          Cryptocurrency Market Terminal
        </h1>
        <p style={{ color: 'var(--ink-secondary)', fontSize: '13px', marginTop: '4px' }}>
          Live tick-by-tick order-book updates, 24/7 global liquidity feeds, circulating supply dynamics, and short-to-long term momentum metrics.
        </p>

        {/* Filter and Search Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 12px',
                backgroundColor: 'var(--bg-surface)',
                border: '1px solid var(--border-primary)',
                borderRadius: '4px',
                minWidth: '220px',
              }}
            >
              <Search size={14} color="var(--ink-tertiary)" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Filter crypto by symbol or name..."
                style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: '12px', width: '100%' }}
              />
            </div>

            {/* Quick Segment Tabs */}
            <div style={{ display: 'flex', backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-primary)', borderRadius: '4px', padding: '2px' }}>
              {(['ALL', 'GAINERS', 'LOSERS'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  style={{
                    padding: '4px 10px',
                    fontSize: '11px',
                    fontWeight: 600,
                    borderRadius: '3px',
                    backgroundColor: activeTab === tab ? 'var(--bg-secondary)' : 'transparent',
                    color: activeTab === tab ? 'var(--ink-primary)' : 'var(--ink-tertiary)',
                  }}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <div style={{ fontSize: '12px', color: 'var(--ink-secondary)' }}>
            Showing <strong>{filteredAssets.length}</strong> live crypto assets
          </div>
        </div>
      </div>

      {/* Main Table */}
      <div className="paper-panel" style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
          <thead>
            <tr style={{ backgroundColor: 'var(--bg-surface)', borderBottom: '1px solid var(--border-primary)', color: 'var(--ink-secondary)', fontSize: '11px', textTransform: 'uppercase' }}>
              <th style={{ padding: '12px 16px', cursor: 'pointer', width: '60px' }} onClick={() => toggleSort('rank')}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}># <ArrowUpDown size={12} /></div>
              </th>
              <th style={{ padding: '12px 16px' }}>Asset</th>
              <th style={{ padding: '12px 16px', textAlign: 'right', cursor: 'pointer' }} onClick={() => toggleSort('price')}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '4px' }}>Price <ArrowUpDown size={12} /></div>
              </th>
              <th style={{ padding: '12px 16px', textAlign: 'right', cursor: 'pointer' }} onClick={() => toggleSort('change24h')}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '4px' }}>24H <ArrowUpDown size={12} /></div>
              </th>
              <th style={{ padding: '12px 16px', textAlign: 'right' }}>7D</th>
              <th style={{ padding: '12px 16px', textAlign: 'right' }}>30D</th>
              <th style={{ padding: '12px 16px', textAlign: 'right', cursor: 'pointer' }} onClick={() => toggleSort('volume24h')}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '4px' }}>24H Volume <ArrowUpDown size={12} /></div>
              </th>
              <th style={{ padding: '12px 16px', textAlign: 'right', cursor: 'pointer' }} onClick={() => toggleSort('marketCap')}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '4px' }}>Market Cap <ArrowUpDown size={12} /></div>
              </th>
              <th style={{ padding: '12px 16px', textAlign: 'right' }}>Circulating Supply</th>
              <th style={{ padding: '12px 16px', textAlign: 'center' }}>Last 7 Days</th>
            </tr>
          </thead>
          <tbody>
            {filteredAssets.map((asset) => (
              <tr
                key={asset.symbol}
                style={{
                  borderBottom: '1px solid var(--border-subtle)',
                  transition: 'background-color 0.15s ease',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--bg-surface)')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
              >
                <td className="num-mono" style={{ padding: '12px 16px', color: 'var(--ink-tertiary)' }}>
                  {asset.rank ?? '—'}
                </td>
                <td style={{ padding: '12px 16px' }}>
                  <Link href={`/asset/${asset.symbol}`} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontWeight: 700, color: 'var(--ink-primary)' }}>{asset.symbol}</span>
                    <span style={{ fontSize: '12px', color: 'var(--ink-secondary)' }}>{asset.name}</span>
                  </Link>
                </td>
                <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                  <LivePrice symbol={asset.symbol} fallbackPrice={asset.price} size="md" />
                </td>
                <td className="num-mono" style={{ padding: '12px 16px', textAlign: 'right', fontWeight: 600, color: asset.change24h >= 0 ? 'var(--color-positive)' : 'var(--color-negative)' }}>
                  {asset.change24h >= 0 ? '+' : ''}{asset.change24h.toFixed(2)}%
                </td>
                <td className="num-mono" style={{ padding: '12px 16px', textAlign: 'right', color: (asset.change7d ?? 0) >= 0 ? 'var(--color-positive)' : 'var(--color-negative)' }}>
                  {asset.change7d !== undefined && asset.change7d !== null ? `${asset.change7d >= 0 ? '+' : ''}${asset.change7d.toFixed(1)}%` : '—'}
                </td>
                <td className="num-mono" style={{ padding: '12px 16px', textAlign: 'right', color: (asset.change30d ?? 0) >= 0 ? 'var(--color-positive)' : 'var(--color-negative)' }}>
                  {asset.change30d !== undefined && asset.change30d !== null ? `${asset.change30d >= 0 ? '+' : ''}${asset.change30d.toFixed(1)}%` : '—'}
                </td>
                <td className="num-mono" style={{ padding: '12px 16px', textAlign: 'right' }}>
                  ${(asset.volume24h / 1e6).toLocaleString(undefined, { maximumFractionDigits: 1 })}M
                </td>
                <td className="num-mono" style={{ padding: '12px 16px', textAlign: 'right', fontWeight: 600 }}>
                  {asset.marketCap ? `$${(asset.marketCap / 1e9).toLocaleString(undefined, { maximumFractionDigits: 2 })}B` : '—'}
                </td>
                <td className="num-mono" style={{ padding: '12px 16px', textAlign: 'right', color: 'var(--ink-secondary)', fontSize: '12px' }}>
                  {asset.circulatingSupply ? `${(asset.circulatingSupply / 1e6).toFixed(1)}M ${asset.symbol}` : '—'}
                </td>
                <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                  {renderSparkline(asset.sparkline, asset.change24h)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
