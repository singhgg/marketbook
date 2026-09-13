'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ExternalLink, Tag } from 'lucide-react';

export default function CollectionDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;

  const [collection, setCollection] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCollection() {
      try {
        const res = await fetch(`/api/collections/${slug}`);
        if (res.ok) {
          const data = await res.json();
          setCollection(data.collection);
        }
      } catch (err) {
        console.error('Failed to load collection:', err);
      } finally {
        setLoading(false);
      }
    }
    if (slug) {
      loadCollection();
    }
  }, [slug]);

  if (loading) {
    return <div style={{ padding: '60px', textAlign: 'center', color: 'var(--ink-tertiary)' }}>Loading collection...</div>;
  }

  if (!collection) {
    return <div style={{ padding: '60px', textAlign: 'center' }}>Collection not found.</div>;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Banner */}
      <div
        style={{
          width: '100%',
          height: '180px',
          borderRadius: '6px',
          overflow: 'hidden',
          backgroundColor: 'var(--bg-surface)',
        }}
      >
        <img
          src={collection.bannerImage}
          alt={collection.name}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </div>

      {/* Collection Header Stats */}
      <div className="paper-panel" style={{ padding: '24px', marginTop: '-40px', position: 'relative', zIndex: 10 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <img
              src={collection.avatarImage}
              alt={collection.name}
              style={{ width: '64px', height: '64px', borderRadius: '6px', border: '3px solid var(--bg-secondary)', objectFit: 'cover' }}
            />
            <div>
              <h1 style={{ fontSize: '22px', fontWeight: 800 }}>{collection.name}</h1>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '3px' }}>
                <a
                  href={`https://etherscan.io/address/${collection.contract}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="num-mono"
                  style={{ fontSize: '11px', color: 'var(--ink-secondary)', display: 'inline-flex', alignItems: 'center', gap: '3px' }}
                >
                  {collection.contract.slice(0, 6)}...{collection.contract.slice(-4)} <ExternalLink size={10} />
                </a>
                <Link
                  href={`/contract-intelligence/ethereum/${collection.contract}`}
                  style={{
                    fontSize: '10px',
                    fontWeight: 700,
                    padding: '2px 8px',
                    borderRadius: '3px',
                    backgroundColor: '#E0F2F1',
                    color: '#0E6251',
                    border: '1px solid #B2DFDB',
                    textDecoration: 'none',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  Contract Intel &rarr;
                </Link>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '16px' }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '10px', color: 'var(--ink-tertiary)', textTransform: 'uppercase' }}>Floor Price</div>
              <div className="num-mono" style={{ fontSize: '18px', fontWeight: 800, color: 'var(--ink-primary)' }}>
                {collection.floorPrice} ETH
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '10px', color: 'var(--ink-tertiary)', textTransform: 'uppercase' }}>24H Turnover</div>
              <div className="num-mono" style={{ fontSize: '18px', fontWeight: 800, color: 'var(--ink-primary)' }}>
                {collection.volume24h} ETH
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '10px', color: 'var(--ink-tertiary)', textTransform: 'uppercase' }}>Unique Owners</div>
              <div className="num-mono" style={{ fontSize: '18px', fontWeight: 800, color: 'var(--ink-primary)' }}>
                {collection.ownerCount.toLocaleString()}
              </div>
            </div>
          </div>
        </div>

        <p style={{ fontSize: '13px', color: 'var(--ink-secondary)', marginTop: '14px', lineHeight: 1.5, maxWidth: '800px' }}>
          {collection.description}
        </p>
      </div>

      {/* Items in Collection */}
      <div>
        <h2 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '16px' }}>
          Verified Artifacts ({collection.nfts?.length || 0})
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '16px' }}>
          {collection.nfts?.map((nft: any) => (
            <Link
              key={nft.id}
              href={`/nfts/${nft.contract}/${nft.tokenId}`}
              className="paper-panel"
              style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }}
            >
              <div style={{ width: '100%', height: '220px', backgroundColor: 'var(--bg-surface)' }}>
                <img src={nft.imageUrl} alt={nft.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div style={{ padding: '14px' }}>
                <div style={{ fontSize: '10px', color: 'var(--ink-tertiary)' }}>#{nft.tokenId}</div>
                <div style={{ fontWeight: 700, fontSize: '14px', marginTop: '2px' }}>{nft.name}</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px' }}>
                  <span style={{ fontSize: '11px', color: 'var(--ink-secondary)' }}>Price</span>
                  <span className="num-mono" style={{ fontWeight: 800 }}>
                    {nft.listings?.[0] ? `${nft.listings[0].price} ETH` : `${collection.floorPrice} ETH`}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
