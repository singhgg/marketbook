'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  ShieldAlert,
  ShieldCheck,
  Search,
  Copy,
  Check,
  ExternalLink,
  Code,
  Binary,
  Layers,
  AlertTriangle,
  Info,
  Clock,
  ArrowRight,
  Database,
  Cpu,
  Key,
  Flame,
  PauseCircle,
  TrendingUp,
  RefreshCw,
} from 'lucide-react';
import { ContractAnalysisResult, ContractChain, RiskSeverity } from '@/lib/contracts/types';

const PRESETS = [
  {
    name: 'USDC (Proxy)',
    chain: 'ethereum' as ContractChain,
    address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
    tag: 'EIP-1967 Proxy',
  },
  {
    name: 'USDT (Tether)',
    chain: 'ethereum' as ContractChain,
    address: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
    tag: 'Verified Source',
  },
  {
    name: 'MarketBook NFT',
    chain: 'ethereum' as ContractChain,
    address: '0x1234567890123456789012345678901234567890',
    tag: 'Native ERC-721',
  },
  {
    name: 'MarketBook Marketplace',
    chain: 'ethereum' as ContractChain,
    address: '0x0987654321098765432109876543210987654321',
    tag: 'Native Exchange',
  },
];

function ContractIntelligenceContent() {
  const searchParams = useSearchParams();
  const urlAddress = searchParams.get('address') || '';
  const urlChain = (searchParams.get('chain') || 'ethereum').toLowerCase() as ContractChain;

  const [addressInput, setAddressInput] = useState(urlAddress || '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48');
  const [selectedChain, setSelectedChain] = useState<ContractChain>(urlChain);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<ContractAnalysisResult | null>(null);

  // View mode tab: 'SOURCE' | 'BYTECODE' | 'DECOMPILED'
  const [activeCodeTab, setActiveCodeTab] = useState<'SOURCE' | 'BYTECODE' | 'DECOMPILED'>('SOURCE');
  const [selectedSourceFileIndex, setSelectedSourceFileIndex] = useState(0);
  const [copied, setCopied] = useState<string | null>(null);

  const fetchAnalysis = async (chainToUse: ContractChain, addrToUse: string) => {
    if (!addrToUse.trim()) {
      setError('Please enter a contract address.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/contracts/analyze?chain=${chainToUse}&address=${encodeURIComponent(addrToUse.trim())}`);
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to inspect smart contract.');
      }

      setAnalysis(data.contract);
      // Automatically default to BYTECODE or DECOMPILED if source is unverified
      if (data.contract.overview.verificationStatus === 'UNVERIFIED') {
        setActiveCodeTab('DECOMPILED');
      } else {
        setActiveCodeTab('SOURCE');
      }
      setSelectedSourceFileIndex(0);
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred during contract analysis.');
      setAnalysis(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (urlAddress) {
      setAddressInput(urlAddress);
      setSelectedChain(urlChain);
      fetchAnalysis(urlChain, urlAddress);
    } else {
      // Default load preset
      fetchAnalysis(selectedChain, addressInput);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [urlAddress, urlChain]);

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(null), 1800);
  };

  const getSeverityBadge = (sev: RiskSeverity) => {
    switch (sev) {
      case 'HIGH':
        return { color: '#B91C1C', bg: '#FEE2E2', border: '#F87171', label: 'HIGH RISK' };
      case 'MEDIUM':
        return { color: '#C25E00', bg: '#FFEDD5', border: '#FDBA74', label: 'MEDIUM' };
      case 'LOW':
        return { color: '#B45309', bg: '#FEF3C7', border: '#FCD34D', label: 'LOW' };
      case 'INFO':
      default:
        return { color: '#1E40AF', bg: '#DBEAFE', border: '#93C5FD', label: 'INFORMATIONAL' };
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px', maxWidth: '1440px', margin: '0 auto' }}>
      {/* 1. Header Section */}
      <div
        style={{
          borderBottom: '1px solid var(--border-primary)',
          paddingBottom: '20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span
            style={{
              fontSize: '11px',
              fontWeight: 700,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: 'var(--accent-mbx50)',
              backgroundColor: '#E0F2F1',
              padding: '3px 8px',
              borderRadius: '3px',
              border: '1px solid #B2DFDB',
            }}
          >
            Terminal Research Suite
          </span>
          <span style={{ fontSize: '12px', color: 'var(--ink-muted)' }}>|</span>
          <span style={{ fontSize: '12px', color: 'var(--ink-secondary)', fontWeight: 600 }}>
            EVM Bytecode & Source Audit Intelligence
          </span>
        </div>
        <h1
          style={{
            fontFamily: 'var(--font-sans)',
            fontSize: '32px',
            fontWeight: 800,
            letterSpacing: '-0.02em',
            color: 'var(--ink-primary)',
          }}
        >
          Contract Intelligence
        </h1>
        <p style={{ fontSize: '15px', color: 'var(--ink-secondary)', maxWidth: '820px' }}>
          Inspect verified source, deployed runtime bytecode, upgradeable proxy storage slots, administrative
          privileges, and on-chain interactions. <em>Don’t just trust the badge—inspect what is actually deployed.</em>
        </p>
      </div>

      {/* 2. Contract Search Bar & Preset Quick-Select */}
      <div
        className="paper-panel"
        style={{
          padding: '20px',
          backgroundColor: 'var(--bg-card)',
          border: '1px solid var(--border-primary)',
          borderRadius: '6px',
          display: 'flex',
          flexDirection: 'column',
          gap: '14px',
        }}
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            fetchAnalysis(selectedChain, addressInput);
          }}
          style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}
        >
          {/* Network Selector */}
          <div style={{ minWidth: '160px' }}>
            <label
              style={{
                display: 'block',
                fontSize: '11px',
                fontWeight: 700,
                color: 'var(--ink-tertiary)',
                marginBottom: '4px',
                textTransform: 'uppercase',
              }}
            >
              Network
            </label>
            <select
              value={selectedChain}
              onChange={(e) => setSelectedChain(e.target.value as ContractChain)}
              style={{
                width: '100%',
                padding: '10px 12px',
                fontSize: '13px',
                backgroundColor: 'var(--bg-surface)',
                border: '1px solid var(--border-primary)',
                borderRadius: '4px',
                color: 'var(--ink-primary)',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              <option value="ethereum">Ethereum</option>
              <option value="base">Base</option>
              <option value="arbitrum">Arbitrum</option>
              <option value="optimism">Optimism</option>
              <option value="polygon">Polygon</option>
              <option value="bsc">BNB Chain</option>
            </select>
          </div>

          {/* Contract Address Input */}
          <div style={{ flex: 1, minWidth: '300px' }}>
            <label
              style={{
                display: 'block',
                fontSize: '11px',
                fontWeight: 700,
                color: 'var(--ink-tertiary)',
                marginBottom: '4px',
                textTransform: 'uppercase',
              }}
            >
              Contract Address
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                placeholder="Enter EVM contract address (0x...)"
                value={addressInput}
                onChange={(e) => setAddressInput(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '13px',
                  backgroundColor: 'var(--bg-secondary)',
                  border: '1px solid var(--border-primary)',
                  borderRadius: '4px',
                  color: 'var(--ink-primary)',
                }}
              />
            </div>
          </div>

          {/* Submit Button */}
          <div style={{ alignSelf: 'flex-end' }}>
            <button
              type="submit"
              disabled={loading}
              style={{
                padding: '10px 24px',
                backgroundColor: 'var(--ink-primary)',
                color: '#F6F1E8',
                border: 'none',
                borderRadius: '4px',
                fontSize: '13px',
                fontWeight: 700,
                letterSpacing: '0.04em',
                cursor: loading ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              {loading ? (
                <>
                  <RefreshCw size={15} className="animate-spin" /> ANALYZING...
                </>
              ) : (
                <>
                  <Search size={15} /> ANALYZE CONTRACT
                </>
              )}
            </button>
          </div>
        </form>

        {/* Preset Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', paddingTop: '6px' }}>
          <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--ink-tertiary)', textTransform: 'uppercase' }}>
            Inspect Presets:
          </span>
          {PRESETS.map((p) => (
            <button
              key={p.name}
              type="button"
              onClick={() => {
                setAddressInput(p.address);
                setSelectedChain(p.chain);
                fetchAnalysis(p.chain, p.address);
              }}
              style={{
                padding: '4px 10px',
                fontSize: '11px',
                fontWeight: 600,
                backgroundColor: addressInput.toLowerCase() === p.address.toLowerCase() ? 'var(--ink-primary)' : 'var(--bg-surface)',
                color: addressInput.toLowerCase() === p.address.toLowerCase() ? '#F6F1E8' : 'var(--ink-secondary)',
                border: '1px solid var(--border-primary)',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              {p.name} ({p.tag})
            </button>
          ))}
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <div
          style={{
            padding: '16px',
            backgroundColor: 'var(--color-negative-bg)',
            border: '1px solid var(--color-negative)',
            borderRadius: '6px',
            color: 'var(--color-negative)',
            fontSize: '13px',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '12px',
          }}
        >
          <ShieldAlert size={20} style={{ flexShrink: 0, marginTop: '2px' }} />
          <div>
            <div style={{ fontWeight: 700, marginBottom: '2px' }}>Validation / Network Error</div>
            <div>{error}</div>
          </div>
        </div>
      )}

      {/* Main Analysis Content */}
      {analysis && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* 3. Overview Card */}
          <div
            className="paper-panel"
            style={{
              padding: '24px',
              backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--border-primary)',
              borderRadius: '6px',
              display: 'flex',
              flexDirection: 'column',
              gap: '20px',
            }}
          >
            {/* Overview Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                  <h2 style={{ fontSize: '22px', fontWeight: 800, color: 'var(--ink-primary)' }}>
                    {analysis.overview.name}
                  </h2>
                  <span
                    style={{
                      fontSize: '11px',
                      fontWeight: 700,
                      padding: '2px 8px',
                      borderRadius: '3px',
                      textTransform: 'uppercase',
                      backgroundColor: 'var(--bg-surface)',
                      border: '1px solid var(--border-primary)',
                    }}
                  >
                    {analysis.overview.chain}
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <code style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', color: 'var(--ink-secondary)' }}>
                    {analysis.overview.address}
                  </code>
                  <button
                    onClick={() => handleCopy(analysis.overview.address, 'addr')}
                    style={{
                      border: 'none',
                      background: 'none',
                      cursor: 'pointer',
                      color: 'var(--ink-muted)',
                      padding: '2px',
                    }}
                    title="Copy Address"
                  >
                    {copied === 'addr' ? <Check size={14} color="var(--color-positive)" /> : <Copy size={14} />}
                  </button>
                  <a
                    href={`https://etherscan.io/address/${analysis.overview.address}`}
                    target="_blank"
                    rel="noreferrer"
                    style={{ color: 'var(--ink-muted)', display: 'inline-flex', alignItems: 'center' }}
                    title="View on Explorer"
                  >
                    <ExternalLink size={14} />
                  </a>
                </div>
              </div>

              {/* Status Badges */}
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {/* Verification Badge */}
                {analysis.overview.verificationStatus === 'VERIFIED' ? (
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '6px 12px',
                      borderRadius: '4px',
                      backgroundColor: 'var(--color-positive-bg)',
                      border: '1px solid var(--color-positive)',
                      color: 'var(--color-positive)',
                      fontSize: '12px',
                      fontWeight: 700,
                    }}
                  >
                    <ShieldCheck size={16} /> VERIFIED SOURCE
                  </div>
                ) : (
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '6px 12px',
                      borderRadius: '4px',
                      backgroundColor: 'var(--color-anomaly-bg)',
                      border: '1px solid var(--color-anomaly)',
                      color: 'var(--color-anomaly)',
                      fontSize: '12px',
                      fontWeight: 700,
                    }}
                  >
                    <AlertTriangle size={16} /> SOURCE NOT VERIFIED
                  </div>
                )}

                {/* Proxy Badge */}
                {analysis.overview.isProxy && (
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '6px 12px',
                      borderRadius: '4px',
                      backgroundColor: '#E0F2F1',
                      border: '1px solid #0E6251',
                      color: '#0E6251',
                      fontSize: '12px',
                      fontWeight: 700,
                    }}
                  >
                    <Layers size={16} /> {analysis.overview.proxyType || 'PROXY'} DETECTED
                  </div>
                )}
              </div>
            </div>

            {/* Quick Metrics Grid */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '16px',
                paddingTop: '16px',
                borderTop: '1px solid var(--border-subtle)',
              }}
            >
              <div>
                <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--ink-tertiary)', textTransform: 'uppercase' }}>
                  Bytecode Size
                </div>
                <div style={{ fontSize: '15px', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>
                  {analysis.overview.sizeBytes.toLocaleString()} bytes
                </div>
              </div>

              <div>
                <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--ink-tertiary)', textTransform: 'uppercase' }}>
                  Active Owner
                </div>
                <div style={{ fontSize: '13px', fontWeight: 600, fontFamily: 'var(--font-mono)' }}>
                  {analysis.permissions.owner !== 'NOT DETERMINED' ? (
                    <span title={analysis.permissions.owner}>
                      {analysis.permissions.owner.slice(0, 10)}...{analysis.permissions.owner.slice(-6)}
                    </span>
                  ) : (
                    <span style={{ color: 'var(--ink-muted)' }}>NOT DETERMINED</span>
                  )}
                </div>
              </div>

              <div>
                <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--ink-tertiary)', textTransform: 'uppercase' }}>
                  Proxy Implementation
                </div>
                <div style={{ fontSize: '13px', fontWeight: 600, fontFamily: 'var(--font-mono)' }}>
                  {analysis.overview.implementationAddress ? (
                    <span title={analysis.overview.implementationAddress} style={{ color: 'var(--accent-mbx50)' }}>
                      {analysis.overview.implementationAddress.slice(0, 10)}...{analysis.overview.implementationAddress.slice(-6)}
                    </span>
                  ) : (
                    <span style={{ color: 'var(--ink-muted)' }}>None / Direct</span>
                  )}
                </div>
              </div>

              <div>
                <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--ink-tertiary)', textTransform: 'uppercase' }}>
                  Analysis Time
                </div>
                <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--ink-secondary)' }}>
                  {new Date(analysis.meta.analyzedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                </div>
              </div>
            </div>

            {/* Standards Detected Row */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--ink-tertiary)', textTransform: 'uppercase' }}>
                Standards Detected:
              </span>
              {analysis.bytecode.detectedStandards.length > 0 ? (
                analysis.bytecode.detectedStandards.map((std) => (
                  <span
                    key={std}
                    style={{
                      fontSize: '11px',
                      fontWeight: 700,
                      backgroundColor: 'var(--bg-surface)',
                      border: '1px solid var(--border-primary)',
                      padding: '2px 8px',
                      borderRadius: '3px',
                      color: 'var(--ink-primary)',
                    }}
                  >
                    ✓ {std}
                  </span>
                ))
              ) : (
                <span style={{ fontSize: '12px', color: 'var(--ink-muted)' }}>Custom / Proprietary Dispatcher</span>
              )}
            </div>
          </div>

          {/* 4. Risk Signals Panel */}
          <div
            className="paper-panel"
            style={{
              padding: '24px',
              backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--border-primary)',
              borderRadius: '6px',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ShieldAlert size={20} color="var(--accent-mbx50)" />
                <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--ink-primary)' }}>Technical Risk Signals</h3>
              </div>
              <span style={{ fontSize: '12px', color: 'var(--ink-tertiary)' }}>
                Automated bytecode & permission heuristics. Not a substitute for formal audit.
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '14px' }}>
              {analysis.riskSignals.map((signal) => {
                const badge = getSeverityBadge(signal.severity);
                return (
                  <div
                    key={signal.id}
                    style={{
                      padding: '14px',
                      backgroundColor: 'var(--bg-secondary)',
                      border: `1px solid ${badge.border}`,
                      borderLeft: `4px solid ${badge.color}`,
                      borderRadius: '4px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '8px',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontWeight: 700, fontSize: '13px', color: 'var(--ink-primary)' }}>
                        {signal.title}
                      </span>
                      <span
                        style={{
                          fontSize: '10px',
                          fontWeight: 800,
                          padding: '2px 6px',
                          borderRadius: '3px',
                          backgroundColor: badge.bg,
                          color: badge.color,
                        }}
                      >
                        {badge.label}
                      </span>
                    </div>

                    <div style={{ fontSize: '12px', color: 'var(--ink-secondary)', lineHeight: 1.45 }}>
                      <strong>What was found:</strong> {signal.whatWeFound}
                    </div>

                    <div style={{ fontSize: '12px', color: 'var(--ink-secondary)', lineHeight: 1.45 }}>
                      <strong>Why it matters:</strong> {signal.whyItMatters}
                    </div>

                    <div
                      style={{
                        fontSize: '11px',
                        fontFamily: 'var(--font-mono)',
                        backgroundColor: 'var(--bg-surface)',
                        padding: '4px 8px',
                        borderRadius: '3px',
                        color: 'var(--ink-tertiary)',
                        wordBreak: 'break-all',
                      }}
                    >
                      Evidence: {signal.evidence}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 5. Tri-View Source / Bytecode / Decompiled Logic Viewer */}
          <div
            className="paper-panel"
            style={{
              backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--border-primary)',
              borderRadius: '6px',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {/* Tab Selector Header */}
            <div
              style={{
                display: 'flex',
                backgroundColor: 'var(--bg-surface)',
                borderBottom: '1px solid var(--border-primary)',
                padding: '0 16px',
              }}
            >
              <button
                type="button"
                onClick={() => setActiveCodeTab('SOURCE')}
                style={{
                  padding: '14px 20px',
                  fontSize: '13px',
                  fontWeight: 700,
                  border: 'none',
                  background: 'none',
                  borderBottom: activeCodeTab === 'SOURCE' ? '3px solid var(--accent-eth)' : '3px solid transparent',
                  color: activeCodeTab === 'SOURCE' ? 'var(--ink-primary)' : 'var(--ink-tertiary)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <Code size={16} /> VERIFIED SOURCE
                {analysis.verifiedSource?.isVerified && (
                  <span
                    style={{
                      fontSize: '10px',
                      backgroundColor: 'var(--color-positive-bg)',
                      color: 'var(--color-positive)',
                      padding: '1px 6px',
                      borderRadius: '3px',
                    }}
                  >
                    MATCHED
                  </span>
                )}
              </button>

              <button
                type="button"
                onClick={() => setActiveCodeTab('BYTECODE')}
                style={{
                  padding: '14px 20px',
                  fontSize: '13px',
                  fontWeight: 700,
                  border: 'none',
                  background: 'none',
                  borderBottom: activeCodeTab === 'BYTECODE' ? '3px solid var(--accent-btc)' : '3px solid transparent',
                  color: activeCodeTab === 'BYTECODE' ? 'var(--ink-primary)' : 'var(--ink-tertiary)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <Binary size={16} /> DEPLOYED BYTECODE
                <span
                  style={{
                    fontSize: '10px',
                    backgroundColor: 'var(--bg-secondary)',
                    color: 'var(--ink-secondary)',
                    padding: '1px 6px',
                    borderRadius: '3px',
                  }}
                >
                  {analysis.bytecode.length} bytes
                </span>
              </button>

              <button
                type="button"
                onClick={() => setActiveCodeTab('DECOMPILED')}
                style={{
                  padding: '14px 20px',
                  fontSize: '13px',
                  fontWeight: 700,
                  border: 'none',
                  background: 'none',
                  borderBottom: activeCodeTab === 'DECOMPILED' ? '3px solid var(--accent-mbx50)' : '3px solid transparent',
                  color: activeCodeTab === 'DECOMPILED' ? 'var(--ink-primary)' : 'var(--ink-tertiary)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <Cpu size={16} /> DECOMPILED LOGIC
                <span
                  style={{
                    fontSize: '10px',
                    backgroundColor: '#FEF3C7',
                    color: '#B45309',
                    padding: '1px 6px',
                    borderRadius: '3px',
                  }}
                >
                  APPROXIMATION
                </span>
              </button>
            </div>

            {/* TAB 1: VERIFIED SOURCE VIEW */}
            {activeCodeTab === 'SOURCE' && (
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                {analysis.verifiedSource && analysis.verifiedSource.isVerified ? (
                  <>
                    {/* Source Metadata Banner */}
                    <div
                      style={{
                        padding: '12px 20px',
                        backgroundColor: 'var(--bg-secondary)',
                        borderBottom: '1px solid var(--border-subtle)',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                        gap: '12px',
                        fontSize: '12px',
                        color: 'var(--ink-secondary)',
                      }}
                    >
                      <div style={{ display: 'flex', gap: '16px' }}>
                        <span>
                          <strong>Compiler:</strong> {analysis.verifiedSource.compilerVersion || 'Standard'}
                        </span>
                        <span>
                          <strong>Optimization:</strong>{' '}
                          {analysis.verifiedSource.optimizationEnabled
                            ? `Yes (${analysis.verifiedSource.optimizationRuns || 200} runs)`
                            : 'No'}
                        </span>
                        <span>
                          <strong>License:</strong> {analysis.verifiedSource.licenseType || 'None specified'}
                        </span>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ color: 'var(--color-positive)', fontWeight: 600 }}>
                          ✓ Source Match Confirmed
                        </span>
                        <button
                          onClick={() => {
                            const content = analysis.verifiedSource?.files[selectedSourceFileIndex]?.content || '';
                            handleCopy(content, 'source');
                          }}
                          style={{
                            padding: '4px 10px',
                            fontSize: '11px',
                            fontWeight: 600,
                            backgroundColor: 'var(--bg-surface)',
                            border: '1px solid var(--border-primary)',
                            borderRadius: '3px',
                            cursor: 'pointer',
                          }}
                        >
                          {copied === 'source' ? 'COPIED!' : 'COPY CODE'}
                        </button>
                      </div>
                    </div>

                    {/* File Tabs if multiple files */}
                    {analysis.verifiedSource.files.length > 1 && (
                      <div
                        style={{
                          display: 'flex',
                          backgroundColor: 'var(--bg-surface)',
                          borderBottom: '1px solid var(--border-subtle)',
                          overflowX: 'auto',
                          padding: '4px 16px 0',
                          gap: '6px',
                        }}
                      >
                        {analysis.verifiedSource.files.map((file, idx) => (
                          <button
                            key={file.name}
                            type="button"
                            onClick={() => setSelectedSourceFileIndex(idx)}
                            style={{
                              padding: '6px 12px',
                              fontSize: '12px',
                              fontWeight: selectedSourceFileIndex === idx ? 700 : 500,
                              backgroundColor: selectedSourceFileIndex === idx ? 'var(--terminal-bg)' : 'transparent',
                              color: selectedSourceFileIndex === idx ? '#F6F1E8' : 'var(--ink-secondary)',
                              border: 'none',
                              borderRadius: '4px 4px 0 0',
                              cursor: 'pointer',
                            }}
                          >
                            {file.name}
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Source Code Container */}
                    <div
                      style={{
                        backgroundColor: 'var(--terminal-bg)',
                        color: 'var(--terminal-text)',
                        padding: '20px',
                        maxHeight: '600px',
                        overflowY: 'auto',
                        fontFamily: 'var(--font-mono)',
                        fontSize: '12px',
                        lineHeight: 1.6,
                      }}
                    >
                      <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                        {analysis.verifiedSource.files[selectedSourceFileIndex]?.content || '// No source code content.'}
                      </pre>
                    </div>
                  </>
                ) : (
                  <div style={{ padding: '60px 20px', textAlign: 'center', color: 'var(--ink-secondary)' }}>
                    <AlertTriangle size={32} color="var(--color-anomaly)" style={{ marginBottom: '12px' }} />
                    <h4 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--ink-primary)', marginBottom: '6px' }}>
                      Verified Source Code Unavailable
                    </h4>
                    <p style={{ fontSize: '13px', maxWidth: '540px', margin: '0 auto 16px' }}>
                      The deployed contract on {analysis.overview.chain} does not have publicly published Solidity source code.
                      MarketBook performs direct bytecode analysis and decompiled logic reconstruction below.
                    </p>
                    <button
                      type="button"
                      onClick={() => setActiveCodeTab('DECOMPILED')}
                      style={{
                        padding: '8px 16px',
                        fontSize: '12px',
                        fontWeight: 700,
                        backgroundColor: 'var(--ink-primary)',
                        color: '#F6F1E8',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                      }}
                    >
                      View Decompiled Approximation &rarr;
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: DEPLOYED BYTECODE VIEW */}
            {activeCodeTab === 'BYTECODE' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
                  <div style={{ fontSize: '12px', color: 'var(--ink-secondary)' }}>
                    <strong>Bytecode SHA-256:</strong>{' '}
                    <code style={{ fontFamily: 'var(--font-mono)' }}>{analysis.bytecode.bytecodeHash}</code>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopy(analysis.bytecode.rawBytecode, 'bytecode')}
                    style={{
                      padding: '4px 10px',
                      fontSize: '11px',
                      fontWeight: 600,
                      backgroundColor: 'var(--bg-surface)',
                      border: '1px solid var(--border-primary)',
                      borderRadius: '3px',
                      cursor: 'pointer',
                    }}
                  >
                    {copied === 'bytecode' ? 'COPIED!' : 'COPY RAW HEX'}
                  </button>
                </div>

                {/* Raw Bytecode Hex Box */}
                <div
                  style={{
                    backgroundColor: 'var(--terminal-bg)',
                    color: '#34D399',
                    padding: '16px',
                    borderRadius: '4px',
                    maxHeight: '180px',
                    overflowY: 'auto',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '11px',
                    lineHeight: 1.5,
                    wordBreak: 'break-all',
                  }}
                >
                  {analysis.bytecode.rawBytecode}
                </div>

                {/* Disassembly Table */}
                <div>
                  <h4 style={{ fontSize: '14px', fontWeight: 800, color: 'var(--ink-primary)', marginBottom: '8px' }}>
                    EVM Opcode Disassembly (Sample)
                  </h4>
                  <div
                    style={{
                      maxHeight: '320px',
                      overflowY: 'auto',
                      border: '1px solid var(--border-primary)',
                      borderRadius: '4px',
                    }}
                  >
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px', textAlign: 'left' }}>
                      <thead style={{ backgroundColor: 'var(--bg-surface)', borderBottom: '1px solid var(--border-primary)' }}>
                        <tr>
                          <th style={{ padding: '8px 12px', fontWeight: 700 }}>PC (Offset)</th>
                          <th style={{ padding: '8px 12px', fontWeight: 700 }}>Instruction</th>
                          <th style={{ padding: '8px 12px', fontWeight: 700 }}>Operand Data</th>
                        </tr>
                      </thead>
                      <tbody>
                        {analysis.bytecode.disassemblySnippet.map((inst, idx) => (
                          <tr
                            key={idx}
                            style={{
                              borderBottom: '1px solid var(--border-subtle)',
                              backgroundColor: idx % 2 === 0 ? 'var(--bg-card)' : 'var(--bg-secondary)',
                              fontFamily: 'var(--font-mono)',
                            }}
                          >
                            <td style={{ padding: '6px 12px', color: 'var(--ink-muted)' }}>
                              0x{inst.pc.toString(16).padStart(4, '0')}
                            </td>
                            <td
                              style={{
                                padding: '6px 12px',
                                fontWeight: 700,
                                color:
                                  inst.opcode === 'DELEGATECALL' || inst.opcode === 'SELFDESTRUCT'
                                    ? 'var(--color-negative)'
                                    : 'var(--ink-primary)',
                              }}
                            >
                              {inst.opcode}
                            </td>
                            <td style={{ padding: '6px 12px', color: 'var(--accent-btc)' }}>
                              {inst.operand || '—'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: DECOMPILED LOGIC VIEW */}
            {activeCodeTab === 'DECOMPILED' && (
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                {/* Prominent Warning Disclaimer */}
                <div
                  style={{
                    padding: '12px 20px',
                    backgroundColor: '#FEF3C7',
                    borderBottom: '1px solid #FCD34D',
                    color: '#92400E',
                    fontSize: '12px',
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                  }}
                >
                  <AlertTriangle size={18} style={{ flexShrink: 0 }} />
                  <div>{analysis.decompiled.disclaimer}</div>
                </div>

                {/* Decompiled Approximate Solidity */}
                <div
                  style={{
                    backgroundColor: 'var(--terminal-bg)',
                    color: 'var(--terminal-text)',
                    padding: '20px',
                    maxHeight: '600px',
                    overflowY: 'auto',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '12px',
                    lineHeight: 1.6,
                  }}
                >
                  <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                    {analysis.decompiled.approximateSolidity}
                  </pre>
                </div>
              </div>
            )}
          </div>

          {/* 6. Permissions & Privileged Capabilities */}
          <div
            className="paper-panel"
            style={{
              padding: '24px',
              backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--border-primary)',
              borderRadius: '6px',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Key size={18} color="var(--accent-mbx50)" />
              <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--ink-primary)' }}>Contract Permissions Matrix</h3>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px' }}>
              <div style={{ padding: '12px', backgroundColor: 'var(--bg-secondary)', borderRadius: '4px', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--ink-tertiary)', textTransform: 'uppercase' }}>Owner</div>
                <div style={{ fontSize: '13px', fontWeight: 600, fontFamily: 'var(--font-mono)', marginTop: '4px' }}>
                  {analysis.permissions.owner}
                </div>
              </div>

              <div style={{ padding: '12px', backgroundColor: 'var(--bg-secondary)', borderRadius: '4px', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--ink-tertiary)', textTransform: 'uppercase' }}>Admin</div>
                <div style={{ fontSize: '13px', fontWeight: 600, fontFamily: 'var(--font-mono)', marginTop: '4px' }}>
                  {analysis.permissions.admin}
                </div>
              </div>

              <div style={{ padding: '12px', backgroundColor: 'var(--bg-secondary)', borderRadius: '4px', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--ink-tertiary)', textTransform: 'uppercase' }}>Upgrade Authority</div>
                <div style={{ fontSize: '13px', fontWeight: 600, fontFamily: 'var(--font-mono)', marginTop: '4px' }}>
                  {analysis.permissions.upgradeAuthority}
                </div>
              </div>

              <div style={{ padding: '12px', backgroundColor: 'var(--bg-secondary)', borderRadius: '4px', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--ink-tertiary)', textTransform: 'uppercase' }}>Mint Authority</div>
                <div style={{ fontSize: '13px', fontWeight: 600, fontFamily: 'var(--font-mono)', marginTop: '4px' }}>
                  {analysis.permissions.mintAuthority}
                </div>
              </div>

              <div style={{ padding: '12px', backgroundColor: 'var(--bg-secondary)', borderRadius: '4px', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--ink-tertiary)', textTransform: 'uppercase' }}>Pause Authority</div>
                <div style={{ fontSize: '13px', fontWeight: 600, fontFamily: 'var(--font-mono)', marginTop: '4px' }}>
                  {analysis.permissions.pauseAuthority}
                </div>
              </div>
            </div>
          </div>

          {/* 7. Contract Behavior Breakdown */}
          <div
            className="paper-panel"
            style={{
              padding: '24px',
              backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--border-primary)',
              borderRadius: '6px',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
            }}
          >
            <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--ink-primary)' }}>Contract Behavior & Operations</h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
              <div style={{ padding: '10px 14px', backgroundColor: 'var(--bg-surface)', borderRadius: '4px', border: '1px solid var(--border-subtle)' }}>
                <span style={{ fontSize: '12px', fontWeight: 600 }}>Supply Minting: </span>
                <span style={{ fontWeight: 700, color: analysis.behavior.canMint ? 'var(--color-anomaly)' : 'var(--ink-muted)' }}>
                  {analysis.behavior.canMint ? 'DETECTED' : 'NOT DETECTED'}
                </span>
              </div>

              <div style={{ padding: '10px 14px', backgroundColor: 'var(--bg-surface)', borderRadius: '4px', border: '1px solid var(--border-subtle)' }}>
                <span style={{ fontSize: '12px', fontWeight: 600 }}>Token Burning: </span>
                <span style={{ fontWeight: 700, color: analysis.behavior.canBurn ? 'var(--ink-primary)' : 'var(--ink-muted)' }}>
                  {analysis.behavior.canBurn ? 'DETECTED' : 'NOT DETECTED'}
                </span>
              </div>

              <div style={{ padding: '10px 14px', backgroundColor: 'var(--bg-surface)', borderRadius: '4px', border: '1px solid var(--border-subtle)' }}>
                <span style={{ fontSize: '12px', fontWeight: 600 }}>Pause Freeze: </span>
                <span style={{ fontWeight: 700, color: analysis.behavior.canPause ? 'var(--color-negative)' : 'var(--ink-muted)' }}>
                  {analysis.behavior.canPause ? 'DETECTED' : 'NOT DETECTED'}
                </span>
              </div>

              <div style={{ padding: '10px 14px', backgroundColor: 'var(--bg-surface)', borderRadius: '4px', border: '1px solid var(--border-subtle)' }}>
                <span style={{ fontSize: '12px', fontWeight: 600 }}>Code Upgrades: </span>
                <span style={{ fontWeight: 700, color: analysis.behavior.canUpgrade ? 'var(--accent-mbx50)' : 'var(--ink-muted)' }}>
                  {analysis.behavior.canUpgrade ? 'DETECTED' : 'NOT DETECTED'}
                </span>
              </div>

              <div style={{ padding: '10px 14px', backgroundColor: 'var(--bg-surface)', borderRadius: '4px', border: '1px solid var(--border-subtle)' }}>
                <span style={{ fontSize: '12px', fontWeight: 600 }}>Fee Collection: </span>
                <span style={{ fontWeight: 700, color: analysis.behavior.collectsFees ? 'var(--accent-ipo)' : 'var(--ink-muted)' }}>
                  {analysis.behavior.collectsFees ? 'DETECTED' : 'NOT DETECTED'}
                </span>
              </div>

              <div style={{ padding: '10px 14px', backgroundColor: 'var(--bg-surface)', borderRadius: '4px', border: '1px solid var(--border-subtle)' }}>
                <span style={{ fontSize: '12px', fontWeight: 600 }}>Royalty Support: </span>
                <span style={{ fontWeight: 700, color: analysis.behavior.hasRoyalties ? 'var(--accent-nft)' : 'var(--ink-muted)' }}>
                  {analysis.behavior.hasRoyalties ? 'DETECTED' : 'NOT DETECTED'}
                </span>
              </div>
            </div>
          </div>

          {/* 8. Recent On-Chain Activity */}
          <div
            className="paper-panel"
            style={{
              padding: '24px',
              backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--border-primary)',
              borderRadius: '6px',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--ink-primary)' }}>
                Recent On-Chain Activity
              </h3>
              <span style={{ fontSize: '12px', color: 'var(--ink-tertiary)' }}>
                Real-time verified transactions
              </span>
            </div>

            {analysis.recentActivity.length > 0 ? (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px', textAlign: 'left' }}>
                  <thead style={{ backgroundColor: 'var(--bg-surface)', borderBottom: '1px solid var(--border-primary)' }}>
                    <tr>
                      <th style={{ padding: '10px 12px', fontWeight: 700 }}>Transaction Hash</th>
                      <th style={{ padding: '10px 12px', fontWeight: 700 }}>Method</th>
                      <th style={{ padding: '10px 12px', fontWeight: 700 }}>From</th>
                      <th style={{ padding: '10px 12px', fontWeight: 700 }}>To</th>
                      <th style={{ padding: '10px 12px', fontWeight: 700 }}>Value</th>
                      <th style={{ padding: '10px 12px', fontWeight: 700 }}>Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {analysis.recentActivity.map((tx) => (
                      <tr
                        key={tx.hash}
                        style={{
                          borderBottom: '1px solid var(--border-subtle)',
                          fontFamily: 'var(--font-mono)',
                        }}
                      >
                        <td style={{ padding: '8px 12px' }}>
                          <a
                            href={`https://etherscan.io/tx/${tx.hash}`}
                            target="_blank"
                            rel="noreferrer"
                            style={{ color: 'var(--accent-eth)', textDecoration: 'none' }}
                          >
                            {tx.hash.slice(0, 10)}...{tx.hash.slice(-6)}
                          </a>
                        </td>
                        <td style={{ padding: '8px 12px', fontWeight: 600, color: 'var(--ink-primary)' }}>
                          {tx.method}
                        </td>
                        <td style={{ padding: '8px 12px', color: 'var(--ink-secondary)' }}>
                          {tx.from.slice(0, 6)}...{tx.from.slice(-4)}
                        </td>
                        <td style={{ padding: '8px 12px', color: 'var(--ink-secondary)' }}>
                          {tx.to.slice(0, 6)}...{tx.to.slice(-4)}
                        </td>
                        <td style={{ padding: '8px 12px', color: 'var(--ink-primary)' }}>
                          {tx.value}
                        </td>
                        <td style={{ padding: '8px 12px', color: 'var(--ink-muted)' }}>
                          {new Date(tx.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div style={{ padding: '24px', textAlign: 'center', color: 'var(--ink-muted)', fontSize: '13px' }}>
                No recent transaction history returned for this contract.
              </div>
            )}
          </div>

          {/* 9. Analysis Disclaimer & Metadata Footer */}
          <div
            style={{
              padding: '16px 20px',
              backgroundColor: 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '6px',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px',
              fontSize: '12px',
              color: 'var(--ink-secondary)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
              <span>
                <strong>Data Sources:</strong> {analysis.meta.dataSource}
              </span>
              <span>
                <strong>Timestamp:</strong> {new Date(analysis.meta.analyzedAt).toLocaleString()}
              </span>
            </div>
            <p style={{ fontStyle: 'italic', color: 'var(--ink-muted)', marginTop: '4px' }}>
              MarketBook Contract Intelligence provides automated technical analysis based on publicly available
              blockchain data. It is not a professional smart-contract security audit and cannot guarantee contract
              safety or absence of vulnerabilities.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ContractIntelligencePage() {
  return (
    <Suspense
      fallback={
        <div style={{ padding: '60px 20px', textAlign: 'center', color: 'var(--ink-secondary)' }}>
          Loading Contract Intelligence Terminal...
        </div>
      }
    >
      <ContractIntelligenceContent />
    </Suspense>
  );
}
