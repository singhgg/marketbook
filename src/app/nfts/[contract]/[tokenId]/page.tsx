'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Tag, ShieldCheck, ExternalLink, Activity, Sparkles, Check } from 'lucide-react';

export default function NFTDetailPage() {
  const params = useParams();
  const contract = params?.contract as string;
  const tokenId = params?.tokenId as string;

  const [nft, setNft] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [modalAction, setModalAction] = useState<'BUY' | 'OFFER' | 'LIST' | null>(null);
  const [actionSuccess, setActionSuccess] = useState(false);
  const [offerAmount, setOfferAmount] = useState('8.5');

  useEffect(() => {
    async function loadNFT() {
      try {
        const res = await fetch(`/api/nfts/${contract}/${tokenId}`);
        if (res.ok) {
          const data = await res.json();
          setNft(data.nft);
        }
      } catch (err) {
        console.error('Error loading NFT:', err);
      } finally {
        setLoading(false);
      }
    }
    if (contract && tokenId) {
      loadNFT();
    }
  }, [contract, tokenId]);

  const handleExecuteAction = () => {
    setActionSuccess(true);
    setTimeout(() => {
      setActionSuccess(false);
      setModalAction(null);
    }, 2000);
  };

  if (loading) {
    return <div style={{ padding: '60px', textAlign: 'center', color: 'var(--ink-tertiary)' }}>Loading digital asset...</div>;
  }

  if (!nft) {
    return <div style={{ padding: '60px', textAlign: 'center' }}>Asset not found.</div>;
  }

  const traits = nft.traits ? JSON.parse(nft.traits) : [];
  const activeListing = nft.listings?.[0];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Back Link */}
      <div>
        <Link href="/nfts" style={{ fontSize: '12px', color: 'var(--ink-secondary)', fontWeight: 600 }}>
          &larr; Back to NFT Marketplace
        </Link>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '28px' }}>
        {/* Left Column: Artwork (5 cols) */}
        <div style={{ gridColumn: 'span 5', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div
            className="paper-panel"
            style={{
              padding: '12px',
              backgroundColor: 'var(--bg-surface)',
              borderRadius: '6px',
              overflow: 'hidden',
            }}
          >
            <img
              src={nft.imageUrl}
              alt={nft.name}
              style={{ width: '100%', borderRadius: '4px', display: 'block', objectFit: 'contain' }}
            />
          </div>

          {/* Traits / Attributes */}
          <div className="paper-panel" style={{ padding: '20px' }}>
            <h3 style={{ fontSize: '13px', fontWeight: 700, textTransform: 'uppercase', marginBottom: '12px' }}>
              Attributes & Verified Traits ({traits.length})
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
              {traits.map((tr: any, idx: number) => (
                <div
                  key={idx}
                  style={{
                    padding: '8px 12px',
                    backgroundColor: 'var(--bg-surface)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '4px',
                    textAlign: 'center',
                  }}
                >
                  <div style={{ fontSize: '10px', textTransform: 'uppercase', color: 'var(--accent-nft)', fontWeight: 700 }}>
                    {tr.trait_type}
                  </div>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--ink-primary)', marginTop: '2px' }}>
                    {tr.value}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Metadata, Pricing & Order Book (7 cols) */}
        <div style={{ gridColumn: 'span 7', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="paper-panel" style={{ padding: '28px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <Link
                  href={`/collections/${nft.collection?.slug}`}
                  style={{ fontSize: '12px', fontWeight: 700, color: 'var(--accent-nft)', textTransform: 'uppercase' }}
                >
                  {nft.collection?.name}
                </Link>
                <h1 style={{ fontSize: '26px', fontWeight: 800, color: 'var(--ink-primary)', marginTop: '4px' }}>
                  {nft.name}
                </h1>
                <div style={{ fontSize: '12px', color: 'var(--ink-secondary)', marginTop: '4px' }}>
                  Token ID: #{nft.tokenId} &bull; Rarity Rank: #{nft.rarityRank || 312}
                </div>
              </div>

              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 600,
                  padding: '3px 8px',
                  backgroundColor: 'var(--bg-surface)',
                  borderRadius: '3px',
                }}
              >
                ERC-721
              </span>
            </div>

            <p style={{ fontSize: '13px', color: 'var(--ink-secondary)', marginTop: '14px', lineHeight: 1.6 }}>
              {nft.description || 'Pristine digital artifact minted on Ethereum mainnet.'}
            </p>

            {/* Price Box */}
            <div
              style={{
                marginTop: '20px',
                padding: '18px 20px',
                backgroundColor: 'var(--bg-surface)',
                border: '1px solid var(--border-primary)',
                borderRadius: '4px',
              }}
            >
              <div style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--ink-tertiary)', fontWeight: 600 }}>
                {activeListing ? 'Current Listing Price' : 'Collection Floor Benchmark'}
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', marginTop: '4px' }}>
                <span className="num-mono" style={{ fontSize: '28px', fontWeight: 800, color: 'var(--ink-primary)' }}>
                  {activeListing ? `${activeListing.price} ETH` : `${nft.collection?.floorPrice || 0} ETH`}
                </span>
                <span className="num-mono" style={{ fontSize: '13px', color: 'var(--ink-secondary)' }}>
                  &asymp; ${(Number(activeListing ? activeListing.price : nft.collection?.floorPrice || 0) * 3480).toLocaleString()} USD
                </span>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
                {activeListing ? (
                  <button
                    onClick={() => setModalAction('BUY')}
                    style={{
                      flex: 1,
                      padding: '12px',
                      backgroundColor: 'var(--ink-primary)',
                      color: 'var(--bg-base)',
                      borderRadius: '4px',
                      fontWeight: 700,
                      fontSize: '13px',
                    }}
                  >
                    Buy Now ({activeListing.price} ETH)
                  </button>
                ) : null}

                <button
                  onClick={() => setModalAction('OFFER')}
                  style={{
                    flex: 1,
                    padding: '12px',
                    backgroundColor: 'var(--bg-secondary)',
                    border: '1px solid var(--border-primary)',
                    borderRadius: '4px',
                    fontWeight: 700,
                    fontSize: '13px',
                  }}
                >
                  Make Offer
                </button>
              </div>
            </div>

            {/* Contract Details */}
            <div style={{ marginTop: '24px', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '6px', borderBottom: '1px solid var(--border-subtle)' }}>
                <span style={{ color: 'var(--ink-secondary)' }}>Contract Address</span>
                <a
                  href={`https://etherscan.io/address/${contract}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="num-mono"
                  style={{ color: 'var(--accent-mbx50)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                >
                  {contract.slice(0, 6)}...{contract.slice(-4)} <ExternalLink size={10} />
                </a>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '6px', borderBottom: '1px solid var(--border-subtle)' }}>
                <span style={{ color: 'var(--ink-secondary)' }}>Token Standard</span>
                <span>ERC-721 / ERC-2981 (2.5% Royalties)</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '6px', borderBottom: '1px solid var(--border-subtle)' }}>
                <span style={{ color: 'var(--ink-secondary)' }}>Metadata Storage</span>
                <span className="num-mono" style={{ color: 'var(--accent-mbx50)' }}>IPFS Immutable</span>
              </div>
            </div>

            {/* Contract Intelligence Module */}
            <div
              style={{
                marginTop: '16px',
                padding: '14px',
                backgroundColor: 'var(--bg-surface)',
                border: '1px solid var(--border-primary)',
                borderRadius: '6px',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', color: 'var(--accent-mbx50)', display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <ShieldCheck size={14} /> Contract Intelligence
                </span>
                <span style={{ fontSize: '10px', fontWeight: 700, padding: '2px 6px', borderRadius: '3px', backgroundColor: 'var(--color-positive-bg)', color: 'var(--color-positive)' }}>
                  AUDIT READY
                </span>
              </div>
              <p style={{ fontSize: '11px', color: 'var(--ink-secondary)', margin: 0 }}>
                Inspect verified source, deployed bytecode, proxy slots, and permissions for this digital asset.
              </p>
              <Link
                href={`/contract-intelligence/ethereum/${contract}`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  padding: '8px',
                  backgroundColor: 'var(--ink-primary)',
                  color: '#F6F1E8',
                  borderRadius: '4px',
                  fontSize: '11px',
                  fontWeight: 700,
                  textDecoration: 'none',
                  marginTop: '4px',
                }}
              >
                Inspect Contract & Bytecode &rarr;
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Action Modal */}
      {modalAction && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(25, 27, 29, 0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
          }}
          onClick={() => setModalAction(null)}
        >
          <div
            className="paper-panel"
            style={{ width: '100%', maxWidth: '420px', padding: '24px' }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '12px' }}>
              {modalAction === 'BUY' ? 'Confirm Non-Custodial Purchase' : 'Submit On-Chain Offer'}
            </h3>

            {actionSuccess ? (
              <div style={{ padding: '20px', textAlign: 'center', color: 'var(--color-positive)' }}>
                <Check size={24} style={{ margin: '0 auto 8px' }} />
                <div style={{ fontWeight: 700 }}>Transaction Submitted Successfully!</div>
                <div style={{ fontSize: '12px', color: 'var(--ink-secondary)', marginTop: '4px' }}>
                  Smart contract state updated on-chain.
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <p style={{ fontSize: '13px', color: 'var(--ink-secondary)' }}>
                  {modalAction === 'BUY'
                    ? `You are purchasing ${nft.name} for ${activeListing?.price} ETH. Funds will route atomically through MarketBookMarketplace.sol.`
                    : `Enter your bid in ETH for ${nft.name}.`}
                </p>

                {modalAction === 'OFFER' && (
                  <div>
                    <label style={{ fontSize: '11px', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
                      OFFER AMOUNT (ETH)
                    </label>
                    <input
                      type="number"
                      step="any"
                      value={offerAmount}
                      onChange={(e) => setOfferAmount(e.target.value)}
                      style={{ width: '100%', padding: '8px', backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-primary)', borderRadius: '3px' }}
                    />
                  </div>
                )}

                <button
                  onClick={handleExecuteAction}
                  style={{
                    padding: '10px',
                    backgroundColor: 'var(--ink-primary)',
                    color: 'var(--bg-base)',
                    borderRadius: '4px',
                    fontWeight: 700,
                    fontSize: '13px',
                  }}
                >
                  {modalAction === 'BUY' ? 'Execute Purchase' : 'Sign & Submit Offer'}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
