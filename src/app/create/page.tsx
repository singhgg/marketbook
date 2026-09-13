'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Upload, CheckCircle2, Clock, ShieldCheck, Sparkles, Plus, Trash2, ArrowRight } from 'lucide-react';

export default function CreateNFTPage() {
  const [step, setStep] = useState(1);

  // Form states
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [royaltyBps, setRoyaltyBps] = useState('250'); // 2.5%
  const [traits, setTraits] = useState<{ trait_type: string; value: string }[]>([
    { trait_type: 'Edition', value: 'Genesis 1/1' },
  ]);

  // Minting transaction lifecycle
  const [txState, setTxState] = useState<'IDLE' | 'PREPARING' | 'WAITING_SIGNATURE' | 'SUBMITTED' | 'CONFIRMING' | 'CONFIRMED'>('IDLE');
  const [txHash, setTxHash] = useState<string>('');
  const [mintedTokenId, setMintedTokenId] = useState<string>('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selected = e.target.files[0];
      setFile(selected);
      setPreviewUrl(URL.createObjectURL(selected));
    }
  };

  const handleAddTrait = () => {
    setTraits([...traits, { trait_type: '', value: '' }]);
  };

  const handleTraitChange = (index: number, key: 'trait_type' | 'value', val: string) => {
    const updated = [...traits];
    updated[index][key] = val;
    setTraits(updated);
  };

  const handleRemoveTrait = (index: number) => {
    setTraits(traits.filter((_, i) => i !== index));
  };

  const handleExecuteMint = async () => {
    setTxState('PREPARING');

    try {
      // 1. Upload to IPFS route
      const formData = new FormData();
      formData.append('name', name);
      formData.append('description', description);
      formData.append('traits', JSON.stringify(traits));
      if (file) formData.append('file', file);

      const ipfsRes = await fetch('/api/ipfs/upload', {
        method: 'POST',
        body: formData,
      });

      if (!ipfsRes.ok) throw new Error('IPFS upload failed');
      const ipfsData = await ipfsRes.json();

      // 2. Waiting for signature
      setTxState('WAITING_SIGNATURE');
      await new Promise((r) => setTimeout(r, 1200));

      // 3. Submitted
      setTxState('SUBMITTED');
      const mockHash = '0x' + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
      setTxHash(mockHash);

      // 4. Confirming
      setTxState('CONFIRMING');
      await new Promise((r) => setTimeout(r, 1800));

      // 5. Confirmed
      setTxState('CONFIRMED');
      const newTokenId = Math.floor(1000 + Math.random() * 9000).toString();
      setMintedTokenId(newTokenId);
    } catch (err) {
      console.error('Minting error:', err);
      setTxState('IDLE');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '900px', margin: '0 auto' }}>
      <div className="paper-panel" style={{ padding: '24px 28px' }}>
        <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--accent-nft)', marginBottom: '4px' }}>
          NON-FUNGIBLE DIGITAL ASSET STUDIO
        </div>
        <h1 style={{ fontSize: '24px', fontWeight: 800, letterSpacing: '-0.02em', color: 'var(--ink-primary)' }}>
          NFT Minting & IPFS Deployment Wizard
        </h1>
        <p style={{ color: 'var(--ink-secondary)', fontSize: '13px', marginTop: '4px' }}>
          5-step cryptographic pipeline deploying ERC-721 digital artifacts with ERC-2981 royalty standards and IPFS content addressing.
        </p>

        {/* Wizard Stepper */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '24px', borderTop: '1px solid var(--border-subtle)', paddingTop: '16px' }}>
          {[
            { num: 1, label: 'Artwork' },
            { num: 2, label: 'Details' },
            { num: 3, label: 'Attributes' },
            { num: 4, label: 'Preview' },
            { num: 5, label: 'Mint & Deploy' },
          ].map((s) => (
            <div
              key={s.num}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                color: step >= s.num ? 'var(--ink-primary)' : 'var(--ink-tertiary)',
                fontWeight: step === s.num ? 800 : 500,
                fontSize: '12px',
              }}
            >
              <span
                style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  backgroundColor: step >= s.num ? 'var(--accent-mbx50)' : 'var(--bg-surface)',
                  color: step >= s.num ? '#FFFFFF' : 'var(--ink-tertiary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '11px',
                  fontWeight: 700,
                }}
              >
                {s.num}
              </span>
              <span>{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Step 1: Upload */}
      {step === 1 && (
        <div className="paper-panel" style={{ padding: '32px', textAlign: 'center' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '8px' }}>Step 1: Upload Artwork or Media</h2>
          <p style={{ fontSize: '13px', color: 'var(--ink-secondary)', marginBottom: '24px' }}>
            Supported formats: PNG, JPG, GIF, SVG, WEBP (Max 50MB)
          </p>

          <label
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '40px',
              border: '2px dashed var(--border-primary)',
              borderRadius: '6px',
              cursor: 'pointer',
              backgroundColor: 'var(--bg-surface)',
            }}
          >
            {previewUrl ? (
              <img src={previewUrl} alt="Preview" style={{ maxHeight: '240px', borderRadius: '4px' }} />
            ) : (
              <>
                <Upload size={32} color="var(--ink-tertiary)" style={{ marginBottom: '12px' }} />
                <span style={{ fontWeight: 600, fontSize: '14px' }}>Click or drag file to upload</span>
                <span style={{ fontSize: '11px', color: 'var(--ink-tertiary)', marginTop: '4px' }}>File will be hashed for IPFS pinning</span>
              </>
            )}
            <input type="file" accept="image/*" onChange={handleFileChange} style={{ display: 'none' }} />
          </label>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '24px' }}>
            <button
              onClick={() => setStep(2)}
              disabled={!file && !previewUrl}
              style={{
                padding: '10px 20px',
                backgroundColor: file || previewUrl ? 'var(--ink-primary)' : 'var(--bg-surface)',
                color: file || previewUrl ? 'var(--bg-base)' : 'var(--ink-tertiary)',
                borderRadius: '4px',
                fontWeight: 700,
                fontSize: '13px',
              }}
            >
              Next: Asset Details &rarr;
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Details */}
      {step === 2 && (
        <div className="paper-panel" style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 700 }}>Step 2: Metadata & Royalties</h2>

          <div>
            <label style={{ fontSize: '11px', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
              ITEM NAME
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Sovereign Algorithm #402"
              style={{ width: '100%', padding: '10px', backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-primary)', borderRadius: '3px' }}
              required
            />
          </div>

          <div>
            <label style={{ fontSize: '11px', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
              DESCRIPTION
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              placeholder="Detailed artwork background, artistic intent, and provenance..."
              style={{ width: '100%', padding: '10px', backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-primary)', borderRadius: '3px', fontFamily: 'inherit' }}
            />
          </div>

          <div>
            <label style={{ fontSize: '11px', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
              CREATOR ROYALTY (ERC-2981 BASIS POINTS)
            </label>
            <input
              type="number"
              value={royaltyBps}
              onChange={(e) => setRoyaltyBps(e.target.value)}
              placeholder="250 = 2.5%"
              style={{ width: '200px', padding: '10px', backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-primary)', borderRadius: '3px' }}
            />
            <span style={{ fontSize: '11px', color: 'var(--ink-tertiary)', marginLeft: '10px' }}>
              (e.g., 250 = 2.5% secondary sale royalty)
            </span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '24px' }}>
            <button onClick={() => setStep(1)} style={{ padding: '8px 16px', color: 'var(--ink-secondary)', fontWeight: 600 }}>
              &larr; Back
            </button>
            <button
              onClick={() => setStep(3)}
              disabled={!name}
              style={{ padding: '10px 20px', backgroundColor: name ? 'var(--ink-primary)' : 'var(--bg-surface)', color: name ? 'var(--bg-base)' : 'var(--ink-tertiary)', borderRadius: '4px', fontWeight: 700 }}
            >
              Next: Attributes &rarr;
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Attributes */}
      {step === 3 && (
        <div className="paper-panel" style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h2 style={{ fontSize: '18px', fontWeight: 700 }}>Step 3: Traits & Attributes</h2>
              <p style={{ fontSize: '12px', color: 'var(--ink-secondary)', marginTop: '2px' }}>
                On-chain metadata properties parsed by marketplaces and collectors.
              </p>
            </div>
            <button
              onClick={handleAddTrait}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '6px 12px', backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-primary)', borderRadius: '3px', fontSize: '12px', fontWeight: 600 }}
            >
              <Plus size={12} /> Add Trait
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {traits.map((t, idx) => (
              <div key={idx} style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <input
                  type="text"
                  value={t.trait_type}
                  onChange={(e) => handleTraitChange(idx, 'trait_type', e.target.value)}
                  placeholder="Trait Type (e.g. Background)"
                  style={{ flex: 1, padding: '8px 10px', backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-primary)', borderRadius: '3px' }}
                />
                <input
                  type="text"
                  value={t.value}
                  onChange={(e) => handleTraitChange(idx, 'value', e.target.value)}
                  placeholder="Value (e.g. Obsidian Gold)"
                  style={{ flex: 1, padding: '8px 10px', backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-primary)', borderRadius: '3px' }}
                />
                <button onClick={() => handleRemoveTrait(idx)} style={{ color: 'var(--ink-tertiary)' }}>
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '24px' }}>
            <button onClick={() => setStep(2)} style={{ padding: '8px 16px', color: 'var(--ink-secondary)', fontWeight: 600 }}>
              &larr; Back
            </button>
            <button
              onClick={() => setStep(4)}
              style={{ padding: '10px 20px', backgroundColor: 'var(--ink-primary)', color: 'var(--bg-base)', borderRadius: '4px', fontWeight: 700 }}
            >
              Next: Preview Metadata &rarr;
            </button>
          </div>
        </div>
      )}

      {/* Step 4: Preview */}
      {step === 4 && (
        <div className="paper-panel" style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 700 }}>Step 4: Review Asset Before Minting</h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '24px' }}>
            <div style={{ backgroundColor: 'var(--bg-surface)', padding: '12px', borderRadius: '4px', textAlign: 'center' }}>
              {previewUrl && (
                <img src={previewUrl} alt={name} style={{ maxHeight: '260px', margin: '0 auto', borderRadius: '4px' }} />
              )}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px' }}>
              <div><strong>Name:</strong> {name}</div>
              <div><strong>Description:</strong> {description || 'No description provided.'}</div>
              <div><strong>Royalty:</strong> {parseInt(royaltyBps) / 100}%</div>
              <div>
                <strong>Attributes:</strong>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '4px' }}>
                  {traits.map((tr, i) => (
                    <span key={i} style={{ fontSize: '10px', padding: '2px 6px', backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-primary)', borderRadius: '2px' }}>
                      {tr.trait_type}: {tr.value}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '16px' }}>
            <button onClick={() => setStep(3)} style={{ padding: '8px 16px', color: 'var(--ink-secondary)', fontWeight: 600 }}>
              &larr; Back
            </button>
            <button
              onClick={() => {
                setStep(5);
                handleExecuteMint();
              }}
              style={{ padding: '10px 24px', backgroundColor: 'var(--accent-mbx50)', color: '#FFFFFF', borderRadius: '4px', fontWeight: 700 }}
            >
              Proceed to IPFS & Mint &rarr;
            </button>
          </div>
        </div>
      )}

      {/* Step 5: IPFS + Minting Lifecycle */}
      {step === 5 && (
        <div className="paper-panel" style={{ padding: '40px', textAlign: 'center' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 800, marginBottom: '12px' }}>
            Step 5: Smart Contract Execution Lifecycle
          </h2>

          <div style={{ maxWidth: '500px', margin: '24px auto', display: 'flex', flexDirection: 'column', gap: '14px', textAlign: 'left' }}>
            {[
              { id: 'PREPARING', label: '1. Preparing & Pinning IPFS Metadata' },
              { id: 'WAITING_SIGNATURE', label: '2. Waiting for EIP-712 / Transaction Signature' },
              { id: 'SUBMITTED', label: '3. Transaction Broadcasted to Network Mempool' },
              { id: 'CONFIRMING', label: '4. Awaiting Block Inclusion & Finality' },
              { id: 'CONFIRMED', label: '5. Asset Minted on Ethereum Sepolia Contract' },
            ].map((stateItem, idx) => {
              const order = ['PREPARING', 'WAITING_SIGNATURE', 'SUBMITTED', 'CONFIRMING', 'CONFIRMED'];
              const currentIndex = order.indexOf(txState);
              const isPast = currentIndex > idx;
              const isCurrent = currentIndex === idx;

              return (
                <div
                  key={stateItem.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '12px 16px',
                    backgroundColor: isCurrent ? 'var(--bg-surface)' : 'transparent',
                    border: isCurrent ? '1px solid var(--accent-mbx50)' : '1px solid var(--border-subtle)',
                    borderRadius: '4px',
                  }}
                >
                  {isPast ? (
                    <CheckCircle2 size={18} color="var(--color-positive)" />
                  ) : isCurrent ? (
                    <Clock size={18} color="var(--accent-mbx50)" />
                  ) : (
                    <span style={{ width: '18px', height: '18px', borderRadius: '50%', border: '1px solid var(--ink-tertiary)' }} />
                  )}
                  <span style={{ fontSize: '13px', fontWeight: isCurrent ? 700 : 500 }}>
                    {stateItem.label}
                  </span>
                </div>
              );
            })}
          </div>

          {txState === 'CONFIRMED' && (
            <div style={{ marginTop: '24px', padding: '16px', backgroundColor: 'rgba(5, 150, 105, 0.08)', borderRadius: '4px' }}>
              <div style={{ fontWeight: 800, color: 'var(--color-positive)', fontSize: '16px' }}>
                Artifact Successfully Minted!
              </div>
              <div className="num-mono" style={{ fontSize: '12px', color: 'var(--ink-secondary)', marginTop: '4px' }}>
                Tx Hash: {txHash.slice(0, 16)}...{txHash.slice(-8)}
              </div>
              <div style={{ marginTop: '16px' }}>
                <Link
                  href="/nfts"
                  style={{
                    padding: '8px 18px',
                    backgroundColor: 'var(--ink-primary)',
                    color: 'var(--bg-base)',
                    borderRadius: '4px',
                    fontWeight: 700,
                    fontSize: '12px',
                  }}
                >
                  View in Marketplace &rarr;
                </Link>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
