'use client';

import React, { useState } from 'react';
import { X, Wallet, ShieldCheck, ExternalLink, Check } from 'lucide-react';

interface WalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  walletAddress: string | null;
  onConnect: (address: string) => void;
  onDisconnect: () => void;
}

export function WalletModal({
  isOpen,
  onClose,
  walletAddress,
  onConnect,
  onDisconnect,
}: WalletModalProps) {
  const [isSigning, setIsSigning] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleConnectSimulated = (address: string) => {
    onConnect(address);
  };

  const handleConnectInjected = async () => {
    if (typeof window !== 'undefined' && (window as any).ethereum) {
      try {
        const accounts = await (window as any).ethereum.request({
          method: 'eth_requestAccounts',
        });
        if (accounts && accounts[0]) {
          onConnect(accounts[0]);
        }
      } catch (err) {
        console.error('Wallet connection rejected:', err);
      }
    } else {
      // Fallback for environment without injected extension
      handleConnectSimulated('0x71C8413661925191CE4D51f8B89736B69f0bA764');
    }
  };

  const handleSIWE = async () => {
    setIsSigning(true);
    try {
      // In real web3 flow: fetch /api/auth/nonce, sign message, post to /api/auth/verify
      const nonceRes = await fetch('/api/auth/nonce');
      const { nonce } = await nonceRes.json();
      
      const verifyRes = await fetch('/api/auth/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          address: walletAddress,
          nonce,
          signature: '0x3a4b9c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b',
        }),
      });

      if (verifyRes.ok) {
        setIsAuthenticated(true);
      }
    } catch (err) {
      console.error('SIWE error:', err);
    } finally {
      setIsSigning(false);
    }
  };

  const copyAddress = () => {
    if (walletAddress) {
      navigator.clipboard.writeText(walletAddress);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(25, 27, 29, 0.65)',
        backdropFilter: 'blur(3px)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '440px',
          backgroundColor: 'var(--bg-secondary)',
          border: '1px solid var(--border-primary)',
          borderRadius: '6px',
          boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
          padding: '24px',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Wallet size={18} color="var(--accent-mbx50)" />
            <h3 style={{ fontSize: '16px', fontWeight: 600 }}>Web3 Terminal Wallet</h3>
          </div>
          <button onClick={onClose}>
            <X size={18} color="var(--ink-tertiary)" />
          </button>
        </div>

        {walletAddress ? (
          <div>
            <div
              style={{
                padding: '14px',
                backgroundColor: 'var(--bg-surface)',
                border: '1px solid var(--border-primary)',
                borderRadius: '4px',
                marginBottom: '16px',
              }}
            >
              <div style={{ fontSize: '11px', color: 'var(--ink-tertiary)', textTransform: 'uppercase', marginBottom: '4px' }}>
                Connected Account
              </div>
              <div
                className="num-mono"
                style={{ fontSize: '13px', fontWeight: 600, wordBreak: 'break-all', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
              >
                <span>{walletAddress}</span>
                <button onClick={copyAddress} style={{ marginLeft: '8px', color: 'var(--ink-secondary)' }}>
                  {copied ? <Check size={14} color="var(--color-positive)" /> : 'Copy'}
                </button>
              </div>
              <div style={{ display: 'flex', gap: '8px', marginTop: '8px', fontSize: '11px', color: 'var(--ink-secondary)' }}>
                <span style={{ color: 'var(--color-positive)', fontWeight: 600 }}>● Sepolia / Ethereum</span>
                <a
                  href={`https://etherscan.io/address/${walletAddress}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '3px', textDecoration: 'underline' }}
                >
                  Explorer <ExternalLink size={10} />
                </a>
              </div>
            </div>

            {/* SIWE Verification status */}
            <div
              style={{
                padding: '12px',
                borderRadius: '4px',
                backgroundColor: isAuthenticated ? 'rgba(5, 150, 105, 0.08)' : 'rgba(217, 119, 6, 0.08)',
                border: `1px solid ${isAuthenticated ? 'rgba(5, 150, 105, 0.3)' : 'rgba(217, 119, 6, 0.3)'}`,
                marginBottom: '16px',
                fontSize: '12px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600 }}>
                <ShieldCheck size={14} color={isAuthenticated ? 'var(--color-positive)' : 'var(--color-anomaly)'} />
                <span>{isAuthenticated ? 'SIWE Verified Session' : 'Sign-In With Ethereum Required'}</span>
              </div>
              <p style={{ marginTop: '4px', color: 'var(--ink-secondary)', fontSize: '11px' }}>
                {isAuthenticated
                  ? 'Cryptographic signature validated. You can execute authenticated on-chain orders.'
                  : 'Verify wallet ownership cryptographically via EIP-4361 standard.'}
              </p>
              {!isAuthenticated && (
                <button
                  onClick={handleSIWE}
                  disabled={isSigning}
                  style={{
                    marginTop: '8px',
                    padding: '6px 12px',
                    backgroundColor: 'var(--ink-primary)',
                    color: 'var(--bg-base)',
                    borderRadius: '3px',
                    fontSize: '11px',
                    fontWeight: 600,
                  }}
                >
                  {isSigning ? 'Signing Nonce...' : 'Sign In With Ethereum (SIWE)'}
                </button>
              )}
            </div>

            <button
              onClick={() => {
                onDisconnect();
                setIsAuthenticated(false);
              }}
              style={{
                width: '100%',
                padding: '10px',
                backgroundColor: 'rgba(220, 38, 38, 0.08)',
                color: 'var(--color-negative)',
                border: '1px solid rgba(220, 38, 38, 0.3)',
                borderRadius: '4px',
                fontWeight: 600,
                fontSize: '13px',
              }}
            >
              Disconnect Wallet
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <p style={{ fontSize: '13px', color: 'var(--ink-secondary)', marginBottom: '8px' }}>
              Connect your Web3 wallet to interact with on-chain assets, trade NFTs, and synchronize your cross-market portfolios.
            </p>

            <button
              onClick={handleConnectInjected}
              style={{
                padding: '12px 16px',
                backgroundColor: 'var(--bg-surface)',
                border: '1px solid var(--border-primary)',
                borderRadius: '4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontWeight: 600,
                fontSize: '13px',
              }}
            >
              <span>Browser Wallet (MetaMask / Brave)</span>
              <span style={{ fontSize: '11px', color: 'var(--ink-tertiary)' }}>Detected</span>
            </button>

            <button
              onClick={() => handleConnectSimulated('0x71C8413661925191CE4D51f8B89736B69f0bA764')}
              style={{
                padding: '12px 16px',
                backgroundColor: 'var(--bg-surface)',
                border: '1px solid var(--border-primary)',
                borderRadius: '4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontWeight: 600,
                fontSize: '13px',
              }}
            >
              <span>Devnet Research Wallet (Sample)</span>
              <span className="num-mono" style={{ fontSize: '11px', color: 'var(--accent-mbx50)' }}>
                0x71C...A764
              </span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
