'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Tag, Sparkles, Filter, ExternalLink, ArrowRight } from 'lucide-react';

export default function NFTsMarketplacePage() {
  const [nfts, setNfts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeChain, setActiveChain] = useState('ALL');

  useEffect(() => {
    async function loadNFTs() {
      try {
        const res = await fetch('/api/nfts');
        if (res.ok) {
          const data = await res.json();
          setNfts(data.nfts || []);
        }
      } catch (err) {
        console.error('Error fetching NFTs:', err);
      } finally {
        setLoading(false);
      }
    }
    loadNFTs();
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div className="paper-panel" style={{ padding: '24px 28px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--accent-nft)', marginBottom: '4px' }}>
              PROVENANCE & ON-CHAIN CULTURE
            </div>
            <h1 style={{ fontSize: '24px', fontWeight: 800, letterSpacing: '-0.02em', color: 'var(--ink-primary)' }}>
              NFT Marketplace & Digital Artifacts
            </h1>
            <p style={{ color: 'var(--ink-secondary)', fontSize: '13px', marginTop: '4px' }}>
              Explore curated generative artworks, historic digital collectibles, verified smart contract traits, and instant non-custodial listings.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <Link
              href="/collections"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 14px',
                backgroundColor: 'var(--bg-surface)',
                border: '1px solid var(--border-primary)',
                borderRadius: '4px',
                fontSize: '12px',
                fontWeight: 600,
              }}
            >
              <span>Collections Ranking</span>
            </Link>

            <Link
              href="/create"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 14px',
                backgroundColor: 'var(--ink-primary)',
                color: 'var(--bg-base)',
                borderRadius: '4px',
                fontSize: '12px',
                fontWeight: 600,
              }}
            >
              <span>+ Mint New Asset</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Grid of NFTs */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '20px',
        }}
      >
        {loading && (
          <div style={{ gridColumn: '1 / -1', padding: '40px', textAlign: 'center', color: 'var(--ink-tertiary)' }}>
            Loading marketplace assets...
          </div>
        )}

        {nfts.map((nft) => {
          const activeListing = nft.listings?.[0];
          return (
            <Link
              key={nft.id}
              href={`/nfts/${nft.contract}/${nft.tokenId}`}
              className="paper-panel"
              style={{
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.15s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-2px)')}
              onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
            >
              {/* Artwork Container */}
              <div
                style={{
                  position: 'relative',
                  width: '100%',
                  height: '260px',
                  backgroundColor: 'var(--bg-surface)',
                  overflow: 'hidden',
                }}
              >
                {/* Fallback image */}
                <img
                  src={nft.imageUrl}
                  alt={nft.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <div
                  style={{
                    position: 'absolute',
                    top: '10px',
                    left: '10px',
                    fontSize: '10px',
                    fontWeight: 700,
                    padding: '2px 8px',
                    borderRadius: '3px',
                    backgroundColor: 'rgba(25, 27, 29, 0.75)',
                    color: '#FFFFFF',
                  }}
                >
                  #{nft.tokenId}
                </div>
              </div>

              {/* Details */}
              <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <div style={{ fontSize: '11px', color: 'var(--ink-tertiary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  {nft.collection?.name || 'Curated Collection'}
                </div>
                <h3 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--ink-primary)' }}>
                  {nft.name}
                </h3>

                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'baseline',
                    marginTop: '8px',
                    paddingTop: '8px',
                    borderTop: '1px solid var(--border-subtle)',
                  }}
                >
                  <span style={{ fontSize: '11px', color: 'var(--ink-secondary)' }}>
                    {activeListing ? 'Listing Price' : 'Last Sale'}
                  </span>
                  <div className="num-mono" style={{ fontSize: '16px', fontWeight: 800, color: 'var(--ink-primary)' }}>
                    {activeListing ? `${activeListing.price} ETH` : `${nft.collection?.floorPrice || 0} ETH`}
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
