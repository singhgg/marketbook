'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { Wallet, TrendingUp, TrendingDown, Plus, Layers, ArrowRight, ShieldCheck } from 'lucide-react';
import { useMarketStore } from '@/lib/store';
import { LivePrice } from '@/components/LivePrice';
import { computePortfolioValuation, PortfolioHoldingInput } from '@/lib/calculations/portfolio';

export default function PortfolioPage() {
  const assets = useMarketStore((s) => s.assets);
  const liveTicks = useMarketStore((s) => s.liveTicks);

  // Local persistent holdings representation joined with live market ticks
  const [initialHoldings, setInitialHoldings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [newSymbol, setNewSymbol] = useState('SOL');
  const [newQty, setNewQty] = useState('25');
  const [newCost, setNewCost] = useState('140');

  useEffect(() => {
    async function loadPortfolio() {
      try {
        const res = await fetch('/api/portfolio');
        if (res.ok) {
          const data = await res.json();
          setInitialHoldings(data.portfolio?.valuation?.holdings || []);
        }
      } catch (err) {
        console.error('Failed to load portfolio:', err);
      } finally {
        setLoading(false);
      }
    }
    loadPortfolio();
  }, []);

  // Compute live portfolio valuation dynamically as ticks update in Zustand store!
  const liveValuation = useMemo(() => {
    if (initialHoldings.length === 0) return null;

    const liveInputs: PortfolioHoldingInput[] = initialHoldings.map((h) => {
      const livePrice = liveTicks[h.symbol]?.price ?? assets[h.symbol]?.price ?? h.currentPrice;
      const liveChange = liveTicks[h.symbol]?.change24h ?? assets[h.symbol]?.change24h ?? h.change24h;

      return {
        id: h.id,
        assetId: h.assetId || h.id,
        symbol: h.symbol,
        name: h.name,
        assetType: h.assetType,
        quantity: h.quantity,
        averageCost: h.averageCost,
        currentPrice: livePrice,
        change24h: liveChange,
      };
    });

    return computePortfolioValuation(liveInputs);
  }, [initialHoldings, liveTicks, assets]);

  const handleAddHolding = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/portfolio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          symbol: newSymbol,
          quantity: newQty,
          averageCost: newCost,
        }),
      });
      if (res.ok) {
        setIsAdding(false);
        // Refresh
        const refresh = await fetch('/api/portfolio');
        const data = await refresh.json();
        setInitialHoldings(data.portfolio?.valuation?.holdings || []);
      }
    } catch (err) {
      console.error('Error adding holding:', err);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <div className="paper-panel" style={{ padding: '24px 28px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--accent-mbx50)', marginBottom: '4px' }}>
              CROSS-MARKET HOLDINGS
            </div>
            <h1 style={{ fontSize: '24px', fontWeight: 800, letterSpacing: '-0.02em', color: 'var(--ink-primary)' }}>
              Master Portfolio & Live Valuation
            </h1>
            <p style={{ color: 'var(--ink-secondary)', fontSize: '13px', marginTop: '4px' }}>
              Real-time portfolio recalculation engine reacting continuously to live incoming ticks across crypto and equities without page reload.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={() => setIsAdding(!isAdding)}
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
              <Plus size={14} />
              <span>Add Position</span>
            </button>

            <Link
              href="/portfolio/scenarios"
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
              <span>Simulate Scenarios &rarr;</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Add Holding Form */}
      {isAdding && (
        <form onSubmit={handleAddHolding} className="paper-panel" style={{ padding: '20px', display: 'flex', gap: '12px', alignItems: 'flex-end', flexWrap: 'wrap' }}>
          <div>
            <label style={{ fontSize: '11px', fontWeight: 700, display: 'block', marginBottom: '4px' }}>SYMBOL</label>
            <input
              type="text"
              value={newSymbol}
              onChange={(e) => setNewSymbol(e.target.value)}
              style={{ padding: '6px 10px', backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-primary)', borderRadius: '3px', width: '100px' }}
              required
            />
          </div>
          <div>
            <label style={{ fontSize: '11px', fontWeight: 700, display: 'block', marginBottom: '4px' }}>QUANTITY</label>
            <input
              type="number"
              step="any"
              value={newQty}
              onChange={(e) => setNewQty(e.target.value)}
              style={{ padding: '6px 10px', backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-primary)', borderRadius: '3px', width: '120px' }}
              required
            />
          </div>
          <div>
            <label style={{ fontSize: '11px', fontWeight: 700, display: 'block', marginBottom: '4px' }}>AVG COST ($)</label>
            <input
              type="number"
              step="any"
              value={newCost}
              onChange={(e) => setNewCost(e.target.value)}
              style={{ padding: '6px 10px', backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-primary)', borderRadius: '3px', width: '120px' }}
              required
            />
          </div>
          <button
            type="submit"
            style={{ padding: '8px 16px', backgroundColor: 'var(--accent-mbx50)', color: '#FFFFFF', borderRadius: '3px', fontWeight: 700, fontSize: '12px' }}
          >
            Save Position
          </button>
        </form>
      )}

      {/* Real-Time Valuation Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
        {/* Total Value */}
        <div className="paper-panel" style={{ padding: '20px' }}>
          <div style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--ink-tertiary)', fontWeight: 600 }}>
            Total Portfolio Value
          </div>
          <div className="num-mono" style={{ fontSize: '26px', fontWeight: 800, color: 'var(--ink-primary)', marginTop: '4px' }}>
            ${liveValuation ? liveValuation.totalValue.toLocaleString(undefined, { minimumFractionDigits: 2 }) : '—'}
          </div>
          <div style={{ fontSize: '11px', color: 'var(--ink-tertiary)', marginTop: '4px' }}>
            Live tick stream linked
          </div>
        </div>

        {/* 24H Change */}
        <div className="paper-panel" style={{ padding: '20px' }}>
          <div style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--ink-tertiary)', fontWeight: 600 }}>
            24H Portfolio Movement
          </div>
          <div
            className="num-mono"
            style={{
              fontSize: '26px',
              fontWeight: 800,
              color: (liveValuation?.change24hValue ?? 0) >= 0 ? 'var(--color-positive)' : 'var(--color-negative)',
              marginTop: '4px',
            }}
          >
            {(liveValuation?.change24hValue ?? 0) >= 0 ? '+' : ''}$
            {liveValuation ? Math.abs(liveValuation.change24hValue).toLocaleString(undefined, { minimumFractionDigits: 2 }) : '0.00'}
          </div>
          <div className="num-mono" style={{ fontSize: '11px', fontWeight: 600, color: (liveValuation?.change24hPct ?? 0) >= 0 ? 'var(--color-positive)' : 'var(--color-negative)' }}>
            {(liveValuation?.change24hPct ?? 0) >= 0 ? '+' : ''}{liveValuation?.change24hPct.toFixed(2)}%
          </div>
        </div>

        {/* Unrealized P&L */}
        <div className="paper-panel" style={{ padding: '20px' }}>
          <div style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--ink-tertiary)', fontWeight: 600 }}>
            Total Unrealized P&L
          </div>
          <div
            className="num-mono"
            style={{
              fontSize: '26px',
              fontWeight: 800,
              color: (liveValuation?.unrealizedPnL ?? 0) >= 0 ? 'var(--color-positive)' : 'var(--color-negative)',
              marginTop: '4px',
            }}
          >
            {(liveValuation?.unrealizedPnL ?? 0) >= 0 ? '+' : ''}$
            {liveValuation ? Math.abs(liveValuation.unrealizedPnL).toLocaleString(undefined, { minimumFractionDigits: 2 }) : '0.00'}
          </div>
          <div className="num-mono" style={{ fontSize: '11px', fontWeight: 600, color: (liveValuation?.unrealizedPnLPct ?? 0) >= 0 ? 'var(--color-positive)' : 'var(--color-negative)' }}>
            {(liveValuation?.unrealizedPnLPct ?? 0) >= 0 ? '+' : ''}{liveValuation?.unrealizedPnLPct.toFixed(2)}% on cost basis
          </div>
        </div>

        {/* Category Exposure */}
        <div className="paper-panel" style={{ padding: '20px' }}>
          <div style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--ink-tertiary)', fontWeight: 600, marginBottom: '6px' }}>
            Asset Class Distribution
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '11px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--accent-btc)', fontWeight: 600 }}>Crypto</span>
              <span className="num-mono">${(liveValuation?.cryptoValue || 0).toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--accent-stocks)', fontWeight: 600 }}>Equities</span>
              <span className="num-mono">${(liveValuation?.stockValue || 0).toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--accent-mbx50)', fontWeight: 600 }}>ETFs</span>
              <span className="num-mono">${(liveValuation?.etfValue || 0).toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Holdings Table */}
      <div className="paper-panel" style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
          <thead>
            <tr style={{ backgroundColor: 'var(--bg-surface)', borderBottom: '1px solid var(--border-primary)', color: 'var(--ink-secondary)', fontSize: '11px', textTransform: 'uppercase' }}>
              <th style={{ padding: '12px 16px' }}>Asset</th>
              <th style={{ padding: '12px 16px', textAlign: 'right' }}>Quantity</th>
              <th style={{ padding: '12px 16px', textAlign: 'right' }}>Avg Cost</th>
              <th style={{ padding: '12px 16px', textAlign: 'right' }}>Live Market Price</th>
              <th style={{ padding: '12px 16px', textAlign: 'right' }}>Current Value</th>
              <th style={{ padding: '12px 16px', textAlign: 'right' }}>Unrealized P&L</th>
              <th style={{ padding: '12px 16px', textAlign: 'right' }}>Portfolio Weight</th>
            </tr>
          </thead>
          <tbody>
            {liveValuation?.holdings.map((h) => (
              <tr
                key={h.symbol}
                style={{ borderBottom: '1px solid var(--border-subtle)', transition: 'background-color 0.15s ease' }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--bg-surface)')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
              >
                <td style={{ padding: '12px 16px' }}>
                  <Link href={`/asset/${h.symbol}`} style={{ fontWeight: 800, color: 'var(--ink-primary)' }}>
                    {h.symbol}
                  </Link>
                  <span style={{ fontSize: '11px', color: 'var(--ink-secondary)', marginLeft: '6px' }}>{h.name}</span>
                </td>
                <td className="num-mono" style={{ padding: '12px 16px', textAlign: 'right' }}>
                  {h.quantity.toLocaleString()}
                </td>
                <td className="num-mono" style={{ padding: '12px 16px', textAlign: 'right' }}>
                  ${h.averageCost.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </td>
                <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                  <LivePrice symbol={h.symbol} fallbackPrice={h.currentPrice} showChange={true} size="sm" />
                </td>
                <td className="num-mono" style={{ padding: '12px 16px', textAlign: 'right', fontWeight: 700 }}>
                  ${h.currentValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </td>
                <td
                  className="num-mono"
                  style={{
                    padding: '12px 16px',
                    textAlign: 'right',
                    fontWeight: 700,
                    color: h.unrealizedPnL >= 0 ? 'var(--color-positive)' : 'var(--color-negative)',
                  }}
                >
                  {h.unrealizedPnL >= 0 ? '+' : ''}${h.unrealizedPnL.toLocaleString(undefined, { minimumFractionDigits: 2 })} ({h.unrealizedPnLPct >= 0 ? '+' : ''}{h.unrealizedPnLPct.toFixed(1)}%)
                </td>
                <td className="num-mono" style={{ padding: '12px 16px', textAlign: 'right', color: 'var(--ink-secondary)' }}>
                  {h.weightPct}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
