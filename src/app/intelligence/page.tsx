'use client';

import React, { useMemo } from 'react';
import Link from 'next/link';
import { Activity, Shield, AlertTriangle, GitPullRequest, ArrowRight, Zap, Info } from 'lucide-react';
import { useMarketStore } from '@/lib/store';
import { LivePrice } from '@/components/LivePrice';

export default function IntelligencePage() {
  const assets = useMarketStore((s) => s.assets);

  const intelligenceCards = useMemo(() => {
    return [
      {
        symbol: 'ETH',
        name: 'Ethereum Network',
        assetType: 'CRYPTO',
        priceMetric: 'ETH/BTC & Layer-2 Settlement Fee Compression',
        delta: '-1.15%',
        volumeMetric: '+28.4% 24H Volume Acceleration',
        whatChanged:
          'Ethereum recorded an intraday divergence against Bitcoin alongside a noticeable 28.4% uptick in turnover volume across centralized spot desks.',
        possibleDrivers: [
          'Increased rollup blob submission volume following Layer-2 transaction spikes.',
          'Institutional hedging flow rebalancing liquidity between spot ETF products and native staking yields.',
          'Sector rotation toward high-beta alternative Layer-1 ecosystems.',
        ],
        observedSignals: [
          'ETH/BTC ratio softened to 0.0542.',
          'DEX volume market share stable at 44.1%.',
          '30-day exchange reserve balances continued their multi-week outflow trend (-1.8%).',
        ],
        whyItMayMatter:
          'Divergence between spot price action and long-term staking accumulation historically precedes compression in implied volatility, potentially indicating a consolidating range rather than structural trend breakdown.',
      },
      {
        symbol: 'NVDA',
        name: 'NVIDIA Corporation',
        assetType: 'STOCK',
        priceMetric: 'AI Hyperscaler Capex & Hardware Lead Time',
        delta: '+3.12%',
        volumeMetric: '+18.2% Institutional Block Volume',
        whatChanged:
          'Enterprise semiconductor leadership accelerated after hours following upward capex guidance revisions from major hyperscale cloud customers.',
        possibleDrivers: [
          'Anticipated datacenter architectural transitions requiring higher silicon packaging density.',
          'Supply chain verification of advanced packaging capacity expansions.',
        ],
        observedSignals: [
          'High positive correlation (r = 0.89) to QQQ tech index.',
          'Implied skew tilted moderately toward out-of-the-money upside calls.',
        ],
        whyItMayMatter:
          'As the primary weight in tech benchmark funds and the MBX-50 composite equity bucket, sustained momentum supports broad risk asset sentiment across both equity and digital asset risk appetites.',
      },
      {
        symbol: 'BTC',
        name: 'Bitcoin',
        assetType: 'CRYPTO',
        priceMetric: 'Macro Liquidity & Exchange Reserves',
        delta: '+2.34%',
        volumeMetric: 'Consistent Order-Book Depth Above $64K',
        whatChanged:
          'Bitcoin established upward structural impulse, cleanly reclaiming short-term exponential moving averages on firm institutional custody inflows.',
        possibleDrivers: [
          'Global M2 liquidity expansion signals and currency stabilization flows.',
          'Net cumulative spot ETF inflows exceeding $220M in single-day reporting.',
        ],
        observedSignals: [
          'Perpetual funding rates remain neutral (0.008%), indicating spot-driven rather than leveraged retail expansion.',
          'Gold/BTC relative strength turning in favor of digital store-of-value.',
        ],
        whyItMayMatter:
          'Spot-driven breakouts accompanied by neutral funding rates have historically shown greater durability than leverage-fueled expansions, anchoring positive cross-market beta.',
      },
    ];
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header Banner */}
      <div className="paper-panel" style={{ padding: '24px 28px' }}>
        <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--accent-mbx50)', marginBottom: '4px' }}>
          MARKETBOOK INTELLIGENCE CORE
        </div>
        <h1 style={{ fontSize: '24px', fontWeight: 800, letterSpacing: '-0.02em', color: 'var(--ink-primary)' }}>
          &ldquo;What Changed?&rdquo; Diagnostic Intelligence
        </h1>
        <p style={{ color: 'var(--ink-secondary)', fontSize: '13px', marginTop: '4px', maxWidth: '800px' }}>
          Real-time synthesis of cross-market price action, order-flow divergence, and macro structural shifts. Designed to answer not just what moved, but what observed signals are driving the displacement.
        </p>

        {/* Disclaimer alert */}
        <div
          style={{
            marginTop: '16px',
            padding: '10px 14px',
            backgroundColor: 'var(--bg-surface)',
            border: '1px solid var(--border-primary)',
            borderRadius: '4px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '11px',
            color: 'var(--ink-secondary)',
          }}
        >
          <Info size={14} color="var(--ink-tertiary)" />
          <span>
            <strong>Analytical Transparency:</strong> The signals below reflect observed statistical co-movements and order-book telemetry. MarketBook does not present financial advice or predictive certainties.
          </span>
        </div>
      </div>

      {/* Intelligence Sub-Navigation Modules */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
        <Link
          href="/intelligence/regime"
          className="paper-panel"
          style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '6px' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Shield size={16} color="var(--accent-mbx50)" />
            <span style={{ fontWeight: 700, fontSize: '13px' }}>Market Regime</span>
          </div>
          <div style={{ fontSize: '11px', color: 'var(--ink-secondary)' }}>
            Macro Risk-On / Risk-Off classification and confidence metrics.
          </div>
        </Link>

        <Link
          href="/intelligence/anomalies"
          className="paper-panel"
          style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '6px' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <AlertTriangle size={16} color="var(--accent-anomaly)" />
            <span style={{ fontWeight: 700, fontSize: '13px' }}>Anomaly Engine</span>
          </div>
          <div style={{ fontSize: '11px', color: 'var(--ink-secondary)' }}>
            Detect volume outliers, volatility spikes, and liquidity divergences.
          </div>
        </Link>

        <Link
          href="/intelligence/impact"
          className="paper-panel"
          style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '6px' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <GitPullRequest size={16} color="var(--accent-stocks)" />
            <span style={{ fontWeight: 700, fontSize: '13px' }}>Impact Graph</span>
          </div>
          <div style={{ fontSize: '11px', color: 'var(--ink-secondary)' }}>
            Interactive cross-market relationship and correlation graph.
          </div>
        </Link>

        <Link
          href="/indices/mbx-50"
          className="paper-panel"
          style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '6px' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Zap size={16} color="var(--accent-mbx50)" />
            <span style={{ fontWeight: 700, fontSize: '13px' }}>MBX-50 Composite</span>
          </div>
          <div style={{ fontSize: '11px', color: 'var(--ink-secondary)' }}>
            Attribution of top contributors and detractors in the benchmark index.
          </div>
        </Link>
      </div>

      {/* "What Changed?" Diagnostic Feed */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {intelligenceCards.map((card) => (
          <div
            key={card.symbol}
            className="paper-panel"
            style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}
          >
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span
                  style={{
                    fontSize: '11px',
                    fontWeight: 800,
                    padding: '2px 8px',
                    borderRadius: '3px',
                    backgroundColor: 'var(--bg-surface)',
                    color: 'var(--ink-primary)',
                  }}
                >
                  {card.symbol}
                </span>
                <span style={{ fontWeight: 700, fontSize: '16px', color: 'var(--ink-primary)' }}>
                  {card.name}
                </span>
                <span style={{ fontSize: '12px', color: 'var(--ink-tertiary)' }}>
                  &bull; {card.priceMetric}
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <LivePrice symbol={card.symbol} showChange={true} size="md" />
                <Link
                  href={`/asset/${card.symbol}`}
                  style={{
                    fontSize: '11px',
                    fontWeight: 600,
                    padding: '4px 10px',
                    backgroundColor: 'var(--bg-surface)',
                    border: '1px solid var(--border-primary)',
                    borderRadius: '3px',
                  }}
                >
                  Asset Details &rarr;
                </Link>
              </div>
            </div>

            {/* 4-Step Analytical Sequence */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginTop: '6px' }}>
              {/* 1. What Changed? */}
              <div style={{ padding: '14px', backgroundColor: 'var(--bg-surface)', borderRadius: '4px', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '11px', fontWeight: 800, color: 'var(--accent-mbx50)', textTransform: 'uppercase', marginBottom: '6px' }}>
                  1. WHAT CHANGED?
                </div>
                <p style={{ fontSize: '12px', color: 'var(--ink-primary)', lineHeight: 1.5 }}>
                  {card.whatChanged}
                </p>
              </div>

              {/* 2. Possible Drivers */}
              <div style={{ padding: '14px', backgroundColor: 'var(--bg-surface)', borderRadius: '4px', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '11px', fontWeight: 800, color: 'var(--accent-btc)', textTransform: 'uppercase', marginBottom: '6px' }}>
                  2. POSSIBLE DRIVERS
                </div>
                <ul style={{ paddingLeft: '16px', fontSize: '11px', color: 'var(--ink-secondary)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  {card.possibleDrivers.map((driver, idx) => (
                    <li key={idx}>{driver}</li>
                  ))}
                </ul>
              </div>

              {/* 3. Observed Signals */}
              <div style={{ padding: '14px', backgroundColor: 'var(--bg-surface)', borderRadius: '4px', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '11px', fontWeight: 800, color: 'var(--accent-stocks)', textTransform: 'uppercase', marginBottom: '6px' }}>
                  3. OBSERVED SIGNALS
                </div>
                <ul style={{ paddingLeft: '16px', fontSize: '11px', color: 'var(--ink-secondary)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  {card.observedSignals.map((sig, idx) => (
                    <li key={idx}>{sig}</li>
                  ))}
                </ul>
              </div>

              {/* 4. Why It May Matter */}
              <div style={{ padding: '14px', backgroundColor: 'var(--bg-surface)', borderRadius: '4px', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '11px', fontWeight: 800, color: 'var(--accent-nft)', textTransform: 'uppercase', marginBottom: '6px' }}>
                  4. WHY IT MAY MATTER
                </div>
                <p style={{ fontSize: '12px', color: 'var(--ink-primary)', lineHeight: 1.5 }}>
                  {card.whyItMayMatter}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
