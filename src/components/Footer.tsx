import React from 'react';
import Link from 'next/link';

export function Footer() {
  return (
    <footer
      style={{
        marginTop: '60px',
        backgroundColor: 'var(--bg-secondary)',
        borderTop: '1px solid var(--border-primary)',
        padding: '32px 20px 48px',
        fontSize: '12px',
        color: 'var(--ink-secondary)',
      }}
    >
      <div
        style={{
          maxWidth: '1600px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '32px',
          marginBottom: '28px',
        }}
      >
        <div>
          <div style={{ fontWeight: 800, fontSize: '15px', color: 'var(--ink-primary)', marginBottom: '6px' }}>
            MARKETBOOK
          </div>
          <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--ink-tertiary)', marginBottom: '12px' }}>
            Trade. Collect. Own.
          </div>
          <p style={{ lineHeight: 1.6, color: 'var(--ink-secondary)' }}>
            Cross-market financial research and digital-asset platform connecting cryptocurrencies, equities, ETFs, indices, IPOs, NFTs, and on-chain intelligence into one cohesive workflow.
          </p>
        </div>

        <div>
          <div style={{ fontWeight: 600, color: 'var(--ink-primary)', marginBottom: '12px' }}>
            MARKETS & ASSETS
          </div>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <li><Link href="/markets/crypto">Crypto Terminal</Link></li>
            <li><Link href="/markets/stocks">Equities Universe</Link></li>
            <li><Link href="/markets/etfs">Exchange-Traded Funds</Link></li>
            <li><Link href="/markets/indices">Global Indices</Link></li>
            <li><Link href="/ipos">IPO Pipeline</Link></li>
            <li><Link href="/indices/mbx-50">MBX-50 Composite</Link></li>
          </ul>
        </div>

        <div>
          <div style={{ fontWeight: 600, color: 'var(--ink-primary)', marginBottom: '12px' }}>
            INTELLIGENCE & LABS
          </div>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <li><Link href="/intelligence">What Changed?</Link></li>
            <li><Link href="/intelligence/regime">Market Regime</Link></li>
            <li><Link href="/intelligence/anomalies">Anomaly Engine</Link></li>
            <li><Link href="/intelligence/impact">Cross-Market Impact Graph</Link></li>
            <li><Link href="/compare">Correlation Lab</Link></li>
            <li><Link href="/portfolio/scenarios">Scenario Lab</Link></li>
          </ul>
        </div>

        <div>
          <div style={{ fontWeight: 600, color: 'var(--ink-primary)', marginBottom: '12px' }}>
            WEB3 & DIGITAL ASSETS
          </div>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <li><Link href="/nfts">NFT Marketplace</Link></li>
            <li><Link href="/collections">Collections Ranking</Link></li>
            <li><Link href="/create">Minting Studio (5-Step)</Link></li>
            <li><Link href="/activity">Live On-Chain Activity</Link></li>
            <li><Link href="/portfolio">Portfolio Analytics</Link></li>
            <li><Link href="/thesis">Thesis Builder</Link></li>
          </ul>
        </div>
      </div>

      <div
        style={{
          maxWidth: '1600px',
          margin: '0 auto',
          paddingTop: '20px',
          borderTop: '1px solid var(--border-subtle)',
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '12px',
          fontSize: '11px',
          color: 'var(--ink-tertiary)',
        }}
      >
        <div>
          &copy; {new Date().getFullYear()} MarketBook Inc. All rights reserved. Correlation does not imply causation.
        </div>
        <div style={{ maxWidth: '680px', textAlign: 'right' }}>
          Market data provided for personal research and analysis only. Real-time streaming provided via direct exchange WebSocket feeds. Never financial advice.
        </div>
      </div>
    </footer>
  );
}
