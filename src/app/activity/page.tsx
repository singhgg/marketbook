'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Activity, ExternalLink, Filter } from 'lucide-react';

interface ActivityItem {
  id: string;
  type: 'SALE' | 'LISTING' | 'OFFER' | 'TRANSFER' | 'MINT';
  assetSymbol?: string;
  nft?: {
    name: string;
    tokenId: string;
    contract: string;
    collection: { name: string };
  };
  fromAddress?: string;
  toAddress?: string;
  price?: number;
  txHash?: string;
  timestamp: string;
}

export default function ActivityFeedPage() {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadActivity() {
      try {
        const url = typeFilter === 'ALL' ? '/api/activity' : `/api/activity?type=${typeFilter}`;
        const res = await fetch(url);
        if (res.ok) {
          const data = await res.json();
          setActivities(data.activity || []);
        }
      } catch (err) {
        console.error('Failed to load activity:', err);
      } finally {
        setLoading(false);
      }
    }
    loadActivity();
  }, [typeFilter]);

  const eventTypes = ['ALL', 'SALE', 'LISTING', 'OFFER', 'TRANSFER', 'MINT'];

  const getTypeBadgeStyle = (type: string) => {
    switch (type) {
      case 'SALE':
        return { bg: 'rgba(5, 150, 105, 0.12)', color: 'var(--color-positive)' };
      case 'LISTING':
        return { bg: 'rgba(30, 64, 175, 0.12)', color: 'var(--accent-stocks)' };
      case 'OFFER':
        return { bg: 'rgba(217, 119, 6, 0.12)', color: 'var(--accent-anomaly)' };
      case 'MINT':
        return { bg: 'rgba(192, 38, 211, 0.12)', color: 'var(--accent-nft)' };
      default:
        return { bg: 'var(--bg-surface)', color: 'var(--ink-secondary)' };
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div className="paper-panel" style={{ padding: '24px 28px' }}>
        <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--accent-mbx50)', marginBottom: '4px' }}>
          VERIFIED ON-CHAIN MEMPOOL & BLOCKS
        </div>
        <h1 style={{ fontSize: '24px', fontWeight: 800, letterSpacing: '-0.02em', color: 'var(--ink-primary)' }}>
          On-Chain Activity & Event Stream
        </h1>
        <p style={{ color: 'var(--ink-secondary)', fontSize: '13px', marginTop: '4px' }}>
          Public ledger activity monitoring non-custodial sales, marketplace listings, minting transactions, and peer-to-peer transfers.
        </p>

        {/* Filter Pills */}
        <div style={{ display: 'flex', gap: '8px', marginTop: '20px', flexWrap: 'wrap' }}>
          {eventTypes.map((t) => (
            <button
              key={t}
              onClick={() => setTypeFilter(t)}
              style={{
                padding: '6px 14px',
                fontSize: '12px',
                fontWeight: 600,
                borderRadius: '3px',
                backgroundColor: typeFilter === t ? 'var(--ink-primary)' : 'var(--bg-surface)',
                color: typeFilter === t ? 'var(--bg-base)' : 'var(--ink-secondary)',
                border: typeFilter === t ? '1px solid var(--ink-primary)' : '1px solid var(--border-primary)',
              }}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Activity Table */}
      <div className="paper-panel" style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
          <thead>
            <tr style={{ backgroundColor: 'var(--bg-surface)', borderBottom: '1px solid var(--border-primary)', color: 'var(--ink-secondary)', fontSize: '11px', textTransform: 'uppercase' }}>
              <th style={{ padding: '12px 16px' }}>Event</th>
              <th style={{ padding: '12px 16px' }}>Asset / Item</th>
              <th style={{ padding: '12px 16px', textAlign: 'right' }}>Price</th>
              <th style={{ padding: '12px 16px' }}>From</th>
              <th style={{ padding: '12px 16px' }}>To</th>
              <th style={{ padding: '12px 16px', textAlign: 'right' }}>Time</th>
              <th style={{ padding: '12px 16px', textAlign: 'right' }}>Tx Hash</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={7} style={{ padding: '24px', textAlign: 'center', color: 'var(--ink-tertiary)' }}>
                  Streaming verified on-chain events...
                </td>
              </tr>
            )}

            {!loading && activities.length === 0 && (
              <tr>
                <td colSpan={7} style={{ padding: '24px', textAlign: 'center', color: 'var(--ink-tertiary)' }}>
                  No activity events matching filter.
                </td>
              </tr>
            )}

            {activities.map((act) => {
              const badge = getTypeBadgeStyle(act.type);
              return (
                <tr
                  key={act.id}
                  style={{ borderBottom: '1px solid var(--border-subtle)', transition: 'background-color 0.15s ease' }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--bg-surface)')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                >
                  <td style={{ padding: '12px 16px' }}>
                    <span
                      style={{
                        fontSize: '10px',
                        fontWeight: 800,
                        padding: '2px 8px',
                        borderRadius: '3px',
                        backgroundColor: badge.bg,
                        color: badge.color,
                      }}
                    >
                      {act.type}
                    </span>
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    {act.nft ? (
                      <Link href={`/nfts/${act.nft.contract}/${act.nft.tokenId}`} style={{ fontWeight: 600, color: 'var(--ink-primary)' }}>
                        {act.nft.name}
                      </Link>
                    ) : (
                      <span style={{ fontWeight: 600 }}>{act.assetSymbol || 'Network Transfer'}</span>
                    )}
                  </td>
                  <td className="num-mono" style={{ padding: '12px 16px', textAlign: 'right', fontWeight: 700 }}>
                    {act.price ? `${act.price} ETH` : '—'}
                  </td>
                  <td className="num-mono" style={{ padding: '12px 16px', color: 'var(--ink-secondary)', fontSize: '12px' }}>
                    {act.fromAddress ? `${act.fromAddress.slice(0, 6)}...${act.fromAddress.slice(-4)}` : '0x000...000'}
                  </td>
                  <td className="num-mono" style={{ padding: '12px 16px', color: 'var(--ink-secondary)', fontSize: '12px' }}>
                    {act.toAddress ? `${act.toAddress.slice(0, 6)}...${act.toAddress.slice(-4)}` : '—'}
                  </td>
                  <td style={{ padding: '12px 16px', textAlign: 'right', color: 'var(--ink-tertiary)', fontSize: '11px' }}>
                    {new Date(act.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </td>
                  <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                    {act.txHash ? (
                      <a
                        href={`https://etherscan.io/tx/${act.txHash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="num-mono"
                        style={{ fontSize: '11px', color: 'var(--accent-mbx50)', display: 'inline-flex', alignItems: 'center', gap: '3px' }}
                      >
                        {act.txHash.slice(0, 8)}... <ExternalLink size={10} />
                      </a>
                    ) : (
                      '—'
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
