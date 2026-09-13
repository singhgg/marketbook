'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Search, Clock, ArrowUpDown, Building } from 'lucide-react';
import { useMarketStore } from '@/lib/store';
import { LivePrice } from '@/components/LivePrice';
import { getUSEquityMarketStatus } from '@/lib/calculations/marketHours';

export default function StocksMarketPage() {
  const assets = useMarketStore((s) => s.assets);
  const [searchQuery, setSearchQuery] = useState('');
  const [sectorFilter, setSectorFilter] = useState('ALL');
  const marketStatus = getUSEquityMarketStatus();

  const stockAssets = useMemo(() => {
    return Object.values(assets).filter((a) => a.assetType === 'STOCK');
  }, [assets]);

  const sectors = useMemo(() => {
    const set = new Set<string>();
    stockAssets.forEach((s) => {
      if (s.sector) set.add(s.sector);
    });
    return ['ALL', ...Array.from(set)];
  }, [stockAssets]);

  const filteredStocks = useMemo(() => {
    return stockAssets.filter((s) => {
      const matchesSearch =
        s.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesSector = sectorFilter === 'ALL' || s.sector === sectorFilter;
      return matchesSearch && matchesSector;
    });
  }, [stockAssets, searchQuery, sectorFilter]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header Banner */}
      <div className="paper-panel" style={{ padding: '24px 28px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--accent-stocks)', marginBottom: '4px' }}>
              GLOBAL EQUITIES UNIVERSE
            </div>
            <h1 style={{ fontSize: '24px', fontWeight: 800, letterSpacing: '-0.02em', color: 'var(--ink-primary)' }}>
              Equities & Enterprise Fundamentals
            </h1>
            <p style={{ color: 'var(--ink-secondary)', fontSize: '13px', marginTop: '4px' }}>
              Institutional tracking of public equity tickers across NYSE, NASDAQ, and global exchanges with official session hours enforcement.
            </p>
          </div>

          {/* Session Verification Status Box */}
          <div
            style={{
              padding: '10px 14px',
              backgroundColor: 'var(--bg-surface)',
              border: '1px solid var(--border-primary)',
              borderRadius: '4px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
            }}
          >
            <Clock size={16} color={marketStatus.isOpen ? 'var(--color-positive)' : 'var(--ink-tertiary)'} />
            <div>
              <div style={{ fontSize: '10px', textTransform: 'uppercase', color: 'var(--ink-tertiary)', fontWeight: 600 }}>
                US Equity Session (NYSE / NASDAQ)
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span
                  style={{
                    fontSize: '12px',
                    fontWeight: 700,
                    color: marketStatus.isOpen ? 'var(--color-positive)' : 'var(--ink-secondary)',
                  }}
                >
                  {marketStatus.statusText}
                </span>
                <span style={{ fontSize: '11px', color: 'var(--ink-tertiary)' }}>
                  ({marketStatus.sessionName})
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
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
                placeholder="Search stocks by ticker or name..."
                style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: '12px', width: '100%' }}
              />
            </div>

            {/* Sector filter */}
            <select
              value={sectorFilter}
              onChange={(e) => setSectorFilter(e.target.value)}
              style={{
                padding: '6px 12px',
                backgroundColor: 'var(--bg-surface)',
                border: '1px solid var(--border-primary)',
                borderRadius: '4px',
                fontSize: '12px',
                color: 'var(--ink-primary)',
                outline: 'none',
              }}
            >
              {sectors.map((s) => (
                <option key={s} value={s}>
                  Sector: {s}
                </option>
              ))}
            </select>
          </div>

          <div style={{ fontSize: '12px', color: 'var(--ink-secondary)' }}>
            Showing <strong>{filteredStocks.length}</strong> equities
          </div>
        </div>
      </div>

      {/* Main Stock Table */}
      <div className="paper-panel" style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
          <thead>
            <tr style={{ backgroundColor: 'var(--bg-surface)', borderBottom: '1px solid var(--border-primary)', color: 'var(--ink-secondary)', fontSize: '11px', textTransform: 'uppercase' }}>
              <th style={{ padding: '12px 16px' }}>Ticker</th>
              <th style={{ padding: '12px 16px' }}>Company</th>
              <th style={{ padding: '12px 16px', textAlign: 'right' }}>Price</th>
              <th style={{ padding: '12px 16px', textAlign: 'right' }}>24H Change</th>
              <th style={{ padding: '12px 16px', textAlign: 'right' }}>Volume</th>
              <th style={{ padding: '12px 16px', textAlign: 'right' }}>Market Cap</th>
              <th style={{ padding: '12px 16px', textAlign: 'right' }}>52W Range</th>
              <th style={{ padding: '12px 16px' }}>Sector / Exchange</th>
              <th style={{ padding: '12px 16px', textAlign: 'right' }}>P/E Ratio</th>
            </tr>
          </thead>
          <tbody>
            {filteredStocks.map((stock) => (
              <tr
                key={stock.symbol}
                style={{
                  borderBottom: '1px solid var(--border-subtle)',
                  transition: 'background-color 0.15s ease',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--bg-surface)')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
              >
                <td style={{ padding: '12px 16px' }}>
                  <Link href={`/asset/${stock.symbol}`} style={{ fontWeight: 800, color: 'var(--accent-stocks)' }}>
                    {stock.symbol}
                  </Link>
                </td>
                <td style={{ padding: '12px 16px' }}>
                  <div style={{ fontWeight: 600, color: 'var(--ink-primary)' }}>{stock.name}</div>
                  <div style={{ fontSize: '11px', color: 'var(--ink-tertiary)' }}>{stock.industry || '—'}</div>
                </td>
                <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                  <LivePrice symbol={stock.symbol} fallbackPrice={stock.price} size="md" />
                </td>
                <td className="num-mono" style={{ padding: '12px 16px', textAlign: 'right', fontWeight: 600, color: stock.change24h >= 0 ? 'var(--color-positive)' : 'var(--color-negative)' }}>
                  {stock.change24h >= 0 ? '+' : ''}{stock.change24h.toFixed(2)}%
                </td>
                <td className="num-mono" style={{ padding: '12px 16px', textAlign: 'right' }}>
                  {(stock.volume24h / 1e6).toFixed(1)}M
                </td>
                <td className="num-mono" style={{ padding: '12px 16px', textAlign: 'right', fontWeight: 600 }}>
                  {stock.marketCap ? `$${(stock.marketCap / 1e9).toFixed(1)}B` : '—'}
                </td>
                <td className="num-mono" style={{ padding: '12px 16px', textAlign: 'right', fontSize: '12px', color: 'var(--ink-secondary)' }}>
                  ${stock.low52w?.toFixed(1) || '—'} - ${stock.high52w?.toFixed(1) || '—'}
                </td>
                <td style={{ padding: '12px 16px' }}>
                  <div style={{ fontSize: '12px', color: 'var(--ink-primary)' }}>{stock.sector}</div>
                  <span style={{ fontSize: '10px', color: 'var(--ink-tertiary)', backgroundColor: 'var(--bg-surface)', padding: '1px 4px', borderRadius: '2px' }}>
                    {stock.exchange || 'NASDAQ'}
                  </span>
                </td>
                <td className="num-mono" style={{ padding: '12px 16px', textAlign: 'right', color: 'var(--ink-secondary)' }}>
                  {stock.peRatio ? `${stock.peRatio.toFixed(1)}x` : 'N/A'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
