'use client';

import React, { useEffect, useState } from 'react';
import { useMarketStore } from '@/lib/store';

export function StatusBadge() {
  const connectionStatus = useMarketStore((s) => s.connectionStatus);
  const lastUpdated = useMarketStore((s) => s.lastUpdated);
  const [secondsAgo, setSecondsAgo] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      const diff = Math.floor((Date.now() - lastUpdated) / 1000);
      setSecondsAgo(Math.max(0, diff));
    }, 1000);
    return () => clearInterval(interval);
  }, [lastUpdated]);

  if (connectionStatus === 'LIVE') {
    return (
      <div
        className="status-badge live"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          padding: '3px 8px',
          borderRadius: '3px',
          backgroundColor: 'rgba(5, 150, 105, 0.1)',
          border: '1px solid rgba(5, 150, 105, 0.3)',
          fontSize: '11px',
          fontWeight: 600,
          color: '#059669',
        }}
      >
        <span
          style={{
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            backgroundColor: '#059669',
            boxShadow: '0 0 6px rgba(5, 150, 105, 0.6)',
          }}
        />
        <span>LIVE</span>
        <span style={{ color: '#525861', fontWeight: 400, marginLeft: '2px' }}>
          {secondsAgo === 0 ? 'just now' : `${secondsAgo}s ago`}
        </span>
      </div>
    );
  }

  if (connectionStatus === 'MARKET CLOSED') {
    return (
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          padding: '3px 8px',
          borderRadius: '3px',
          backgroundColor: 'rgba(107, 114, 128, 0.12)',
          border: '1px solid rgba(107, 114, 128, 0.3)',
          fontSize: '11px',
          fontWeight: 600,
          color: '#4B5563',
        }}
      >
        <span
          style={{
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            backgroundColor: '#6B7280',
          }}
        />
        <span>MARKET CLOSED</span>
      </div>
    );
  }

  if (connectionStatus === 'DEMO') {
    return (
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          padding: '3px 8px',
          borderRadius: '3px',
          backgroundColor: 'rgba(217, 119, 6, 0.12)',
          border: '1px solid rgba(217, 119, 6, 0.4)',
          fontSize: '11px',
          fontWeight: 600,
          color: '#B45309',
        }}
      >
        <span
          style={{
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            backgroundColor: '#D97706',
          }}
        />
        <span>DEMO DATA</span>
      </div>
    );
  }

  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        padding: '3px 8px',
        borderRadius: '3px',
        backgroundColor: 'rgba(126, 133, 142, 0.1)',
        border: '1px solid var(--border-primary)',
        fontSize: '11px',
        fontWeight: 500,
        color: 'var(--ink-secondary)',
      }}
    >
      <span
        style={{
          width: '6px',
          height: '6px',
          borderRadius: '50%',
          backgroundColor: '#A1A7B0',
        }}
      />
      <span>{connectionStatus}</span>
    </div>
  );
}
