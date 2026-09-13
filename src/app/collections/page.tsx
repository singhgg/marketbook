'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Layers, ArrowRight } from 'lucide-react';

export default function CollectionsPage() {
  const [collections, setCollections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCollections() {
      try {
        const res = await fetch('/api/collections');
        if (res.ok) {
          const data = await res.json();
          setCollections(data.collections || []);
        }
      } catch (err) {
        console.error('Error fetching collections:', err);
      } finally {
        setLoading(false);
      }
    }
    loadCollections();
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div className="paper-panel" style={{ padding: '24px 28px' }}>
        <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--accent-nft)', marginBottom: '4px' }}>
          VERIFIED SMART CONTRACT REPOSITORIES
        </div>
        <h1 style={{ fontSize: '24px', fontWeight: 800, letterSpacing: '-0.02em', color: 'var(--ink-primary)' }}>
          NFT Collections Ranking
        </h1>
        <p style={{ color: 'var(--ink-secondary)', fontSize: '13px', marginTop: '4px' }}>
          Track floor prices, 24-hour liquidity turnover, unique holder distribution, and verified creator provenance across leading NFT contracts.
        </p>
      </div>

      <div className="paper-panel" style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
          <thead>
            <tr style={{ backgroundColor: 'var(--bg-surface)', borderBottom: '1px solid var(--border-primary)', color: 'var(--ink-secondary)', fontSize: '11px', textTransform: 'uppercase' }}>
              <th style={{ padding: '12px 16px' }}>Collection</th>
              <th style={{ padding: '12px 16px', textAlign: 'right' }}>Floor Price</th>
              <th style={{ padding: '12px 16px', textAlign: 'right' }}>24H Volume</th>
              <th style={{ padding: '12px 16px', textAlign: 'right' }}>Total Volume</th>
              <th style={{ padding: '12px 16px', textAlign: 'right' }}>Owners</th>
              <th style={{ padding: '12px 16px', textAlign: 'right' }}>Items</th>
              <th style={{ padding: '12px 16px', textAlign: 'right' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={7} style={{ padding: '24px', textAlign: 'center', color: 'var(--ink-tertiary)' }}>
                  Loading collections...
                </td>
              </tr>
            )}

            {collections.map((col) => (
              <tr
                key={col.id}
                style={{ borderBottom: '1px solid var(--border-subtle)', transition: 'background-color 0.15s ease' }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--bg-surface)')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
              >
                <td style={{ padding: '12px 16px' }}>
                  <Link href={`/collections/${col.slug}`} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <img
                      src={col.avatarImage}
                      alt={col.name}
                      style={{ width: '32px', height: '32px', borderRadius: '4px', objectFit: 'cover' }}
                    />
                    <div>
                      <div style={{ fontWeight: 700, color: 'var(--ink-primary)' }}>{col.name}</div>
                      <div style={{ fontSize: '11px', color: 'var(--ink-tertiary)' }}>{col.chain}</div>
                    </div>
                  </Link>
                </td>
                <td className="num-mono" style={{ padding: '12px 16px', textAlign: 'right', fontWeight: 800 }}>
                  {col.floorPrice} ETH
                </td>
                <td className="num-mono" style={{ padding: '12px 16px', textAlign: 'right' }}>
                  {col.volume24h} ETH
                </td>
                <td className="num-mono" style={{ padding: '12px 16px', textAlign: 'right' }}>
                  {col.totalVolume.toLocaleString()} ETH
                </td>
                <td className="num-mono" style={{ padding: '12px 16px', textAlign: 'right', color: 'var(--ink-secondary)' }}>
                  {col.ownerCount.toLocaleString()}
                </td>
                <td className="num-mono" style={{ padding: '12px 16px', textAlign: 'right', color: 'var(--ink-secondary)' }}>
                  {col.itemCount.toLocaleString()}
                </td>
                <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                  <Link
                    href={`/collections/${col.slug}`}
                    style={{
                      fontSize: '11px',
                      color: 'var(--accent-mbx50)',
                      fontWeight: 600,
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}
                  >
                    <span>View</span>
                    <ArrowRight size={10} />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
