'use client';

import React from 'react';
import Link from 'next/link';
import { useMarketStore } from '@/lib/store';
import { LivePrice } from './LivePrice';

const TICKER_SYMBOLS = [
  { symbol: 'BTC', label: 'Bitcoin', tag: 'CRYPTO' },
  { symbol: 'ETH', label: 'Ethereum', tag: 'CRYPTO' },
  { symbol: 'SOL', label: 'Solana', tag: 'CRYPTO' },
  { symbol: 'MBX-50', label: 'MBX-50', tag: 'INDEX' },
  { symbol: 'NVDA', label: 'NVIDIA', tag: 'STOCK' },
  { symbol: 'SPY', label: 'S&P 500 ETF', tag: 'ETF' },
  { symbol: 'QQQ', label: 'NASDAQ QQQ', tag: 'ETF' },
  { symbol: 'GLD', label: 'Gold Trust', tag: 'COMMODITY' },
  { symbol: 'NEAR', label: 'NEAR Protocol', tag: 'CRYPTO' },
];

export function TickerTape() {
  const assets = useMarketStore((s) => s.assets);

  return (
    <div
      style={{
        backgroundColor: 'var(--terminal-bg)',
        color: 'var(--terminal-text)',
        borderBottom: '1px solid var(--terminal-border)',
        height: '36px',
        display: 'flex',
        alignItems: 'center',
        overflowX: 'auto',
        whiteSpace: 'nowrap',
        scrollbarWidth: 'none',
        msOverflowStyle: 'none',
        fontSize: '12px',
        padding: '0 16px',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '10px',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            color: 'var(--terminal-muted)',
            fontWeight: 700,
            borderRight: '1px solid var(--terminal-border)',
            paddingRight: '14px',
          }}
        >
          <span>CROSS-MARKET TAPE</span>
        </div>

        {TICKER_SYMBOLS.map((item) => {
          const asset = assets[item.symbol];
          return (
            <Link
              key={item.symbol}
              href={`/asset/${item.symbol}`}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '2px 8px',
                borderRadius: '3px',
                textDecoration: 'none',
                color: 'var(--terminal-text)',
                transition: 'background-color 0.15s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--terminal-surface)')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
            >
              <span style={{ fontWeight: 600, fontSize: '11px', color: '#EFE9DD' }}>
                {item.symbol}
              </span>
              <LivePrice
                symbol={item.symbol}
                fallbackPrice={asset?.price ?? 0}
                showChange={true}
                size="sm"
              />
            </Link>
          );
        })}
      </div>
    </div>
  );
}
