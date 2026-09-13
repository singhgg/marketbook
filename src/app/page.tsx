'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  TrendingUp,
  TrendingDown,
  Activity,
  AlertTriangle,
  ArrowRight,
  Shield,
  Layers,
  Compass,
  Zap,
} from 'lucide-react';
import { useMarketStore } from '@/lib/store';
import { LivePrice } from '@/components/LivePrice';
import { InteractiveChart } from '@/components/InteractiveChart';
import { StatusBadge } from '@/components/StatusBadge';
import { evaluateMarketRegime, MarketRegimeState } from '@/lib/calculations/regime';
import { detectMarketAnomalies, MarketAnomaly } from '@/lib/calculations/anomalies';

export default function HomePage() {
  const assets = useMarketStore((s) => s.assets);
  const getMBX50Data = useMarketStore((s) => s.getMBX50Data);
  const mbxData = getMBX50Data();

  const [regime, setRegime] = useState<MarketRegimeState | null>(null);
  const [anomalies, setAnomalies] = useState<MarketAnomaly[]>([]);

  useEffect(() => {
    const assetList = Object.values(assets);
    if (assetList.length > 0) {
      const cryptoAssets = assetList.filter((a) => a.assetType === 'CRYPTO');
      const stockAssets = assetList.filter((a) => a.assetType === 'STOCK');
      const gld = assetList.find((a) => a.symbol === 'GLD');

      const cryptoAvg = cryptoAssets.reduce((sum, a) => sum + a.change24h, 0) / (cryptoAssets.length || 1);
      const stockAvg = stockAssets.reduce((sum, a) => sum + a.change24h, 0) / (stockAssets.length || 1);
      const goldChange = gld?.change24h ?? 0.4;

      const evalRegime = evaluateMarketRegime({
        cryptoAvgChange: cryptoAvg,
        equityAvgChange: stockAvg,
        goldChange,
        volatilityIndex: 16.2,
      });
      setRegime(evalRegime);

      const detected = detectMarketAnomalies(
        assetList.map((a) => ({
          symbol: a.symbol,
          name: a.name,
          assetType: a.assetType as any,
          price: a.price,
          change24h: a.change24h,
          volume24h: a.volume24h,
          avgVolume30d: a.volume24h * 0.45,
        }))
      );
      setAnomalies(detected.slice(0, 3));
    }
  }, [assets]);

  // Compute top gainers and losers
  const assetArray = Object.values(assets);
  const topGainers = [...assetArray].sort((a, b) => b.change24h - a.change24h).slice(0, 4);
  const topLosers = [...assetArray].sort((a, b) => a.change24h - b.change24h).slice(0, 4);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Editorial Header Banner */}
      <div
        className="paper-panel"
        style={{
          padding: '24px 28px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
        }}
      >
        <div>
          <div
            style={{
              fontSize: '11px',
              fontWeight: 700,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: 'var(--accent-mbx50)',
              marginBottom: '6px',
            }}
          >
            CROSS-MARKET RESEARCH TERMINAL
          </div>
          <h1 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--ink-primary)', letterSpacing: '-0.02em' }}>
            Macro Liquidity, Equities & Digital Assets
          </h1>
          <p style={{ color: 'var(--ink-secondary)', fontSize: '13px', marginTop: '4px', maxWidth: '620px' }}>
            Real-time multi-asset intelligence connecting price action, volume shifts, statistical anomalies, and research theses across traditional and decentralized markets.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div
            style={{
              padding: '12px 16px',
              backgroundColor: 'var(--bg-surface)',
              border: '1px solid var(--border-primary)',
              borderRadius: '4px',
              textAlign: 'right',
            }}
          >
            <div style={{ fontSize: '10px', textTransform: 'uppercase', color: 'var(--ink-tertiary)', fontWeight: 600 }}>
              MBX-50 Composite
            </div>
            <div className="num-mono" style={{ fontSize: '20px', fontWeight: 800, color: 'var(--accent-mbx50)' }}>
              {mbxData.indexValue.toFixed(2)}
            </div>
            <div
              className="num-mono"
              style={{
                fontSize: '11px',
                fontWeight: 600,
                color: mbxData.change24h >= 0 ? 'var(--color-positive)' : 'var(--color-negative)',
              }}
            >
              {mbxData.change24h >= 0 ? '+' : ''}
              {mbxData.change24h.toFixed(2)}% (24H)
            </div>
          </div>
        </div>
      </div>

      {/* Primary Grid: Chart + Market Regime & Anomaly Alerts */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '20px' }}>
        {/* Left Column: Live Chart & Workflow Summary (8 cols) */}
        <div style={{ gridColumn: 'span 8', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <InteractiveChart symbol="BTC" initialPrice={assets['BTC']?.price ?? 64250} />

          {/* Research Workflow Bar */}
          <div
            className="paper-panel"
            style={{
              padding: '16px 20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              backgroundColor: 'var(--bg-secondary)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Compass size={20} color="var(--accent-mbx50)" />
              <div>
                <div style={{ fontWeight: 700, fontSize: '13px' }}>The MarketBook Research Sequence</div>
                <div style={{ fontSize: '11px', color: 'var(--ink-secondary)' }}>
                  Discover Asset &rarr; Observe What Changed &rarr; Check Anomaly &rarr; Model Scenario &rarr; Track Thesis
                </div>
              </div>
            </div>

            <Link
              href="/intelligence"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 12px',
                backgroundColor: 'var(--ink-primary)',
                color: 'var(--bg-base)',
                borderRadius: '3px',
                fontSize: '12px',
                fontWeight: 600,
              }}
            >
              <span>Explore Intelligence</span>
              <ArrowRight size={12} />
            </Link>
          </div>
        </div>

        {/* Right Column: Market Regime + Real-time Anomalies (4 cols) */}
        <div style={{ gridColumn: 'span 4', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Market Regime Card */}
          <div className="paper-panel" style={{ padding: '18px 20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Shield size={16} color="var(--accent-mbx50)" />
                <span style={{ fontWeight: 700, fontSize: '12px', textTransform: 'uppercase' }}>
                  Market Regime
                </span>
              </div>
              <Link href="/intelligence/regime" style={{ fontSize: '11px', color: 'var(--accent-mbx50)', fontWeight: 600 }}>
                Details &rarr;
              </Link>
            </div>

            <div
              style={{
                padding: '10px 14px',
                backgroundColor: 'var(--bg-surface)',
                border: '1px solid var(--border-primary)',
                borderRadius: '4px',
                marginBottom: '12px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span
                  style={{
                    fontSize: '14px',
                    fontWeight: 800,
                    color:
                      regime?.regime === 'RISK-ON'
                        ? 'var(--color-positive)'
                        : regime?.regime === 'RISK-OFF'
                        ? 'var(--color-negative)'
                        : 'var(--accent-anomaly)',
                  }}
                >
                  {regime?.regime || 'EVALUATING...'}
                </span>
                <span className="num-mono" style={{ fontSize: '12px', fontWeight: 600, color: 'var(--ink-secondary)' }}>
                  Strength: {regime?.signalStrength || 0}/100
                </span>
              </div>
              <p style={{ fontSize: '11px', color: 'var(--ink-secondary)', marginTop: '4px', lineHeight: 1.4 }}>
                {regime?.summary || 'Analyzing cross-market tick streams...'}
              </p>
            </div>

            {/* Supporting Indicators */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {regime?.supportingIndicators.slice(0, 3).map((ind, i) => (
                <div
                  key={i}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: '11px',
                    borderBottom: '1px solid var(--border-subtle)',
                    paddingBottom: '4px',
                  }}
                >
                  <span style={{ color: 'var(--ink-secondary)' }}>{ind.name}</span>
                  <span
                    className="num-mono"
                    style={{
                      fontWeight: 600,
                      color:
                        ind.impact === 'BULLISH'
                          ? 'var(--color-positive)'
                          : ind.impact === 'BEARISH'
                          ? 'var(--color-negative)'
                          : 'var(--ink-primary)',
                    }}
                  >
                    {ind.value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Anomaly Alerts Stream Card */}
          <div className="paper-panel" style={{ padding: '18px 20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <AlertTriangle size={16} color="var(--accent-anomaly)" />
                <span style={{ fontWeight: 700, fontSize: '12px', textTransform: 'uppercase' }}>
                  Live Anomaly Engine
                </span>
              </div>
              <Link href="/intelligence/anomalies" style={{ fontSize: '11px', color: 'var(--accent-anomaly)', fontWeight: 600 }}>
                All ({anomalies.length}) &rarr;
              </Link>
            </div>

            {anomalies.length === 0 ? (
              <div style={{ fontSize: '12px', color: 'var(--ink-tertiary)', padding: '16px 0', textAlign: 'center' }}>
                Scanning live ticks for statistical outliers...
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {anomalies.map((anom) => (
                  <div
                    key={anom.id}
                    style={{
                      padding: '8px 10px',
                      backgroundColor: 'var(--bg-surface)',
                      border: '1px solid var(--border-primary)',
                      borderRadius: '3px',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontWeight: 700, fontSize: '12px' }}>{anom.assetSymbol}</span>
                      <span
                        style={{
                          fontSize: '9px',
                          fontWeight: 700,
                          padding: '1px 5px',
                          borderRadius: '2px',
                          backgroundColor:
                            anom.severity === 'CRITICAL'
                              ? 'var(--color-negative-bg)'
                              : 'var(--color-anomaly-bg)',
                          color:
                            anom.severity === 'CRITICAL'
                              ? 'var(--color-negative)'
                              : 'var(--color-anomaly)',
                        }}
                      >
                        {anom.severity}
                      </span>
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--ink-primary)', marginTop: '2px', fontWeight: 500 }}>
                      {anom.condition}
                    </div>
                    <div style={{ fontSize: '10px', color: 'var(--ink-secondary)', marginTop: '2px' }}>
                      {anom.supportingMetrics}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Cross-Market Movers: Gainers & Losers */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
        {/* Top Gainers */}
        <div className="paper-panel" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
            <TrendingUp size={16} color="var(--color-positive)" />
            <span style={{ fontWeight: 700, fontSize: '13px', textTransform: 'uppercase' }}>
              Top Movers (Positive Momentum)
            </span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {topGainers.map((asset) => (
              <Link
                key={asset.symbol}
                href={`/asset/${asset.symbol}`}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '10px 14px',
                  backgroundColor: 'var(--bg-surface)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '3px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span
                    style={{
                      fontSize: '10px',
                      fontWeight: 700,
                      padding: '2px 5px',
                      borderRadius: '2px',
                      backgroundColor: 'var(--bg-secondary)',
                      color: 'var(--ink-secondary)',
                    }}
                  >
                    {asset.assetType}
                  </span>
                  <div>
                    <span style={{ fontWeight: 700, fontSize: '13px' }}>{asset.symbol}</span>
                    <span style={{ fontSize: '11px', color: 'var(--ink-secondary)', marginLeft: '6px' }}>
                      {asset.name}
                    </span>
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <LivePrice symbol={asset.symbol} fallbackPrice={asset.price} showChange={true} size="sm" />
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Top Losers */}
        <div className="paper-panel" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
            <TrendingDown size={16} color="var(--color-negative)" />
            <span style={{ fontWeight: 700, fontSize: '13px', textTransform: 'uppercase' }}>
              Top Movers (Drawdown & Pullback)
            </span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {topLosers.map((asset) => (
              <Link
                key={asset.symbol}
                href={`/asset/${asset.symbol}`}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '10px 14px',
                  backgroundColor: 'var(--bg-surface)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '3px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span
                    style={{
                      fontSize: '10px',
                      fontWeight: 700,
                      padding: '2px 5px',
                      borderRadius: '2px',
                      backgroundColor: 'var(--bg-secondary)',
                      color: 'var(--ink-secondary)',
                    }}
                  >
                    {asset.assetType}
                  </span>
                  <div>
                    <span style={{ fontWeight: 700, fontSize: '13px' }}>{asset.symbol}</span>
                    <span style={{ fontSize: '11px', color: 'var(--ink-secondary)', marginLeft: '6px' }}>
                      {asset.name}
                    </span>
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <LivePrice symbol={asset.symbol} fallbackPrice={asset.price} showChange={true} size="sm" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
