'use client';

import React from 'react';
import { useMarketStore } from '@/lib/store';

interface LivePriceProps {
  symbol: string;
  fallbackPrice?: number;
  showChange?: boolean;
  prefix?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export function LivePrice({
  symbol,
  fallbackPrice = 0,
  showChange = false,
  prefix = '$',
  size = 'md',
  className = '',
}: LivePriceProps) {
  const tick = useMarketStore((s) => s.liveTicks[symbol]);
  const asset = useMarketStore((s) => s.assets[symbol]);
  const direction = useMarketStore((s) => s.tickDirections[symbol] || 'NONE');

  const price = tick?.price ?? asset?.price ?? fallbackPrice;
  const change24h = tick?.change24h ?? asset?.change24h ?? 0;

  const fontSizes = {
    sm: '12px',
    md: '14px',
    lg: '18px',
    xl: '26px',
  };

  const flashClass =
    direction === 'UP' ? 'tick-flash-up' : direction === 'DOWN' ? 'tick-flash-down' : '';

  const formatPrice = (val: number) => {
    if (val >= 1000) {
      return val.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    } else if (val >= 1) {
      return val.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 4 });
    } else {
      return val.toLocaleString('en-US', { minimumFractionDigits: 4, maximumFractionDigits: 6 });
    }
  };

  return (
    <span
      className={`num-mono ${flashClass} ${className}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        fontSize: fontSizes[size],
        fontWeight: size === 'xl' ? 700 : 600,
        padding: '1px 3px',
        borderRadius: '2px',
        transition: 'background-color 0.4s ease',
      }}
    >
      <span>
        {prefix}
        {formatPrice(price)}
      </span>

      {showChange && (
        <span
          style={{
            fontSize: size === 'sm' ? '10px' : '12px',
            fontWeight: 500,
            color: change24h >= 0 ? 'var(--color-positive)' : 'var(--color-negative)',
            backgroundColor:
              change24h >= 0 ? 'rgba(5, 150, 105, 0.08)' : 'rgba(220, 38, 38, 0.08)',
            padding: '1px 4px',
            borderRadius: '2px',
          }}
        >
          {change24h >= 0 ? '+' : ''}
          {change24h.toFixed(2)}%
        </span>
      )}
    </span>
  );
}
