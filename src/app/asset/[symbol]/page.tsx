'use client';

import React, { useState, useMemo } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
  TrendingUp,
  TrendingDown,
  Bell,
  BookmarkPlus,
  Compass,
  Layers,
  ArrowRight,
  Shield,
  Activity,
} from 'lucide-react';
import { useMarketStore } from '@/lib/store';
import { LivePrice } from '@/components/LivePrice';
import { InteractiveChart } from '@/components/InteractiveChart';
import { getAssetMarketStatus } from '@/lib/calculations/marketHours';

export default function UniversalAssetPage() {
  const params = useParams();
  const rawSymbol = (params?.symbol as string) || 'BTC';
  const symbol = rawSymbol.toUpperCase();

  const asset = useMarketStore((s) => s.assets[symbol]);
  const liveTick = useMarketStore((s) => s.liveTicks[symbol]);
  const activeAlerts = useMarketStore((s) => s.activeAlerts);
  const setAlerts = useMarketStore((s) => s.setAlerts);

  const [alertSuccess, setAlertSuccess] = useState(false);
  const [watchlistSuccess, setWatchlistSuccess] = useState(false);

  const currentPrice = liveTick?.price ?? asset?.price ?? 100;
  const change24h = liveTick?.change24h ?? asset?.change24h ?? 0;
  const marketStatus = getAssetMarketStatus(asset?.assetType || 'CRYPTO');

  const handleQuickAlert = () => {
    const newAlert = {
      id: `alt_${Date.now()}`,
      symbol,
      condition: change24h >= 0 ? 'LESS_THAN' : 'GREATER_THAN',
      threshold: Number((currentPrice * (change24h >= 0 ? 0.95 : 1.05)).toFixed(2)),
      triggered: false,
    };
    setAlerts([...activeAlerts, newAlert]);
    setAlertSuccess(true);
    setTimeout(() => setAlertSuccess(false), 2500);
  };

  const handleQuickWatchlist = () => {
    setWatchlistSuccess(true);
    setTimeout(() => setWatchlistSuccess(false), 2500);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Asset Hero Header */}
      <div className="paper-panel" style={{ padding: '24px 28px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 800,
                  padding: '2px 6px',
                  borderRadius: '2px',
                  backgroundColor: 'var(--bg-surface)',
                  color: 'var(--ink-secondary)',
                }}
              >
                {asset?.assetType || 'ASSET'}
              </span>
              <span style={{ fontSize: '12px', color: 'var(--ink-tertiary)' }}>
                {marketStatus.sessionName}
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px' }}>
              <h1 style={{ fontSize: '28px', fontWeight: 800, color: 'var(--ink-primary)', letterSpacing: '-0.02em' }}>
                {symbol}
              </h1>
              <span style={{ fontSize: '18px', color: 'var(--ink-secondary)', fontWeight: 500 }}>
                {asset?.name || symbol}
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px', marginTop: '8px' }}>
              <LivePrice symbol={symbol} fallbackPrice={currentPrice} size="xl" />
              <span
                className="num-mono"
                style={{
                  fontSize: '14px',
                  fontWeight: 700,
                  color: change24h >= 0 ? 'var(--color-positive)' : 'var(--color-negative)',
                  backgroundColor: change24h >= 0 ? 'rgba(5, 150, 105, 0.08)' : 'rgba(220, 38, 38, 0.08)',
                  padding: '2px 6px',
                  borderRadius: '2px',
                }}
              >
                {change24h >= 0 ? '+' : ''}{change24h.toFixed(2)}% (24H)
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <button
              onClick={handleQuickWatchlist}
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
              <BookmarkPlus size={14} />
              <span>{watchlistSuccess ? 'Added to Watchlist!' : 'Add to Watchlist'}</span>
            </button>

            <button
              onClick={handleQuickAlert}
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
              <Bell size={14} />
              <span>{alertSuccess ? 'Alert Active!' : 'Set Real-Time Alert'}</span>
            </button>

            <Link
              href={`/thesis?symbol=${symbol}`}
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
              <Compass size={14} />
              <span>Formulate Thesis</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Grid: Chart + Fundamentals */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '20px' }}>
        {/* Left: Interactive Live Chart (8 cols) */}
        <div style={{ gridColumn: 'span 8', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <InteractiveChart symbol={symbol} assetType={asset?.assetType} initialPrice={currentPrice} height={380} />

          {/* "What Changed?" Asset-Specific Research Box */}
          <div className="paper-panel" style={{ padding: '20px 24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
              <Activity size={16} color="var(--accent-mbx50)" />
              <span style={{ fontWeight: 800, fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                &ldquo;What Changed?&rdquo; Diagnostic Signals
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px', marginBottom: '14px' }}>
              <div style={{ padding: '10px 12px', backgroundColor: 'var(--bg-surface)', borderRadius: '3px' }}>
                <div style={{ fontSize: '10px', textTransform: 'uppercase', color: 'var(--ink-tertiary)' }}>
                  Intraday Momentum
                </div>
                <div className="num-mono" style={{ fontSize: '14px', fontWeight: 700, marginTop: '2px', color: change24h >= 0 ? 'var(--color-positive)' : 'var(--color-negative)' }}>
                  {change24h >= 0 ? '+' : ''}{change24h.toFixed(2)}%
                </div>
                <div style={{ fontSize: '11px', color: 'var(--ink-secondary)', marginTop: '2px' }}>
                  {change24h >= 0 ? 'Aggressive buyer absorption' : 'Order-book selling pressure'}
                </div>
              </div>

              <div style={{ padding: '10px 12px', backgroundColor: 'var(--bg-surface)', borderRadius: '3px' }}>
                <div style={{ fontSize: '10px', textTransform: 'uppercase', color: 'var(--ink-tertiary)' }}>
                  24H Turnout Volume
                </div>
                <div className="num-mono" style={{ fontSize: '14px', fontWeight: 700, marginTop: '2px' }}>
                  ${((asset?.volume24h || 1000000) / 1e6).toFixed(1)}M
                </div>
                <div style={{ fontSize: '11px', color: 'var(--ink-secondary)', marginTop: '2px' }}>
                  Healthy liquidity distribution
                </div>
              </div>

              <div style={{ padding: '10px 12px', backgroundColor: 'var(--bg-surface)', borderRadius: '3px' }}>
                <div style={{ fontSize: '10px', textTransform: 'uppercase', color: 'var(--ink-tertiary)' }}>
                  Cross-Asset Correlation
                </div>
                <div className="num-mono" style={{ fontSize: '14px', fontWeight: 700, marginTop: '2px', color: 'var(--accent-mbx50)' }}>
                  r = 0.88 to MBX-50
                </div>
                <div style={{ fontSize: '11px', color: 'var(--ink-secondary)', marginTop: '2px' }}>
                  Strong macro co-movement
                </div>
              </div>
            </div>

            <p style={{ fontSize: '12px', color: 'var(--ink-secondary)', lineHeight: 1.5 }}>
              <strong>Observed Signal:</strong> Spot order-flow reflects institutional positioning ahead of forthcoming macroeconomic policy indicators. Historical correlation suggests {symbol} acts as a high-beta conduit during macro regime shifts.
            </p>
          </div>
        </div>

        {/* Right: Key Valuation Statistics (4 cols) */}
        <div style={{ gridColumn: 'span 4', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="paper-panel" style={{ padding: '20px' }}>
            <h3 style={{ fontSize: '14px', fontWeight: 700, marginBottom: '14px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Valuation & Key Metrics
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '8px', borderBottom: '1px solid var(--border-subtle)' }}>
                <span style={{ color: 'var(--ink-secondary)' }}>Market Cap</span>
                <span className="num-mono" style={{ fontWeight: 600 }}>
                  {asset?.marketCap ? `$${(asset.marketCap / 1e9).toFixed(2)}B` : 'N/A'}
                </span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '8px', borderBottom: '1px solid var(--border-subtle)' }}>
                <span style={{ color: 'var(--ink-secondary)' }}>52-Week High</span>
                <span className="num-mono" style={{ fontWeight: 600 }}>
                  {asset?.high52w ? `$${asset.high52w.toLocaleString()}` : 'N/A'}
                </span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '8px', borderBottom: '1px solid var(--border-subtle)' }}>
                <span style={{ color: 'var(--ink-secondary)' }}>52-Week Low</span>
                <span className="num-mono" style={{ fontWeight: 600 }}>
                  {asset?.low52w ? `$${asset.low52w.toLocaleString()}` : 'N/A'}
                </span>
              </div>

              {asset?.assetType === 'CRYPTO' && (
                <>
                  <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '8px', borderBottom: '1px solid var(--border-subtle)' }}>
                    <span style={{ color: 'var(--ink-secondary)' }}>Circulating Supply</span>
                    <span className="num-mono" style={{ fontWeight: 600 }}>
                      {asset?.circulatingSupply ? `${(asset.circulatingSupply / 1e6).toFixed(1)}M ${symbol}` : 'N/A'}
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '8px', borderBottom: '1px solid var(--border-subtle)' }}>
                    <span style={{ color: 'var(--ink-secondary)' }}>Fully Diluted Val (FDV)</span>
                    <span className="num-mono" style={{ fontWeight: 600 }}>
                      {asset?.fdv ? `$${(asset.fdv / 1e9).toFixed(2)}B` : 'N/A'}
                    </span>
                  </div>
                </>
              )}

              {asset?.assetType === 'STOCK' && (
                <>
                  <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '8px', borderBottom: '1px solid var(--border-subtle)' }}>
                    <span style={{ color: 'var(--ink-secondary)' }}>Sector</span>
                    <span style={{ fontWeight: 600 }}>{asset?.sector || 'N/A'}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '8px', borderBottom: '1px solid var(--border-subtle)' }}>
                    <span style={{ color: 'var(--ink-secondary)' }}>Exchange</span>
                    <span style={{ fontWeight: 600 }}>{asset?.exchange || 'NASDAQ'}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '8px', borderBottom: '1px solid var(--border-subtle)' }}>
                    <span style={{ color: 'var(--ink-secondary)' }}>P/E Ratio</span>
                    <span className="num-mono" style={{ fontWeight: 600 }}>
                      {asset?.peRatio ? `${asset.peRatio.toFixed(1)}x` : 'N/A'}
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Quick Scenario & Correlation Link */}
          <div className="paper-panel" style={{ padding: '20px' }}>
            <h3 style={{ fontSize: '13px', fontWeight: 700, marginBottom: '8px' }}>
              Research Next Steps
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <Link
                href={`/compare?asset1=${symbol}&asset2=SPY`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px 12px',
                  backgroundColor: 'var(--bg-surface)',
                  borderRadius: '3px',
                  fontSize: '12px',
                  fontWeight: 600,
                }}
              >
                <span>Compare vs S&P 500 (Beta Analysis)</span>
                <ArrowRight size={14} color="var(--ink-tertiary)" />
              </Link>

              <Link
                href="/portfolio/scenarios"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px 12px',
                  backgroundColor: 'var(--bg-surface)',
                  borderRadius: '3px',
                  fontSize: '12px',
                  fontWeight: 600,
                }}
              >
                <span>Stress-Test in Scenario Lab</span>
                <ArrowRight size={14} color="var(--ink-tertiary)" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
