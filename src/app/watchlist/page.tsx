'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Bookmark, Plus, Bell, Trash2, ArrowRight } from 'lucide-react';
import { useMarketStore } from '@/lib/store';
import { LivePrice } from '@/components/LivePrice';

export default function WatchlistPage() {
  const assets = useMarketStore((s) => s.assets);
  const [watchlists, setWatchlists] = useState<any[]>([]);
  const [activeWatchlistId, setActiveWatchlistId] = useState<string>('');
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [newSymbol, setNewSymbol] = useState('SOL');
  const [newNotes, setNewNotes] = useState('Watching 4H breakout');

  const loadWatchlists = async () => {
    try {
      const res = await fetch('/api/watchlists');
      if (res.ok) {
        const data = await res.json();
        setWatchlists(data.watchlists || []);
        if (data.watchlists?.[0] && !activeWatchlistId) {
          setActiveWatchlistId(data.watchlists[0].id);
        }
      }
    } catch (err) {
      console.error('Error loading watchlists:', err);
    }
  };

  useEffect(() => {
    loadWatchlists();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const activeWatchlist = watchlists.find((w) => w.id === activeWatchlistId) || watchlists[0];

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeWatchlistId) return;

    try {
      const res = await fetch('/api/watchlists', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          watchlistId: activeWatchlistId,
          symbol: newSymbol,
          notes: newNotes,
        }),
      });

      if (res.ok) {
        setIsAddingItem(false);
        setNewNotes('');
        loadWatchlists();
      }
    } catch (err) {
      console.error('Error adding item:', err);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div className="paper-panel" style={{ padding: '24px 28px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--accent-mbx50)', marginBottom: '4px' }}>
              PERSONAL RESEARCH WORKSPACE
            </div>
            <h1 style={{ fontSize: '24px', fontWeight: 800, letterSpacing: '-0.02em', color: 'var(--ink-primary)' }}>
              Cross-Market Watchlists
            </h1>
            <p style={{ color: 'var(--ink-secondary)', fontSize: '13px', marginTop: '4px' }}>
              Organize digital assets, equities, and ETF baskets into specialized thematic tracking views with notes and real-time live price streams.
            </p>
          </div>

          <button
            onClick={() => setIsAddingItem(!isAddingItem)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 16px',
              backgroundColor: 'var(--ink-primary)',
              color: 'var(--bg-base)',
              borderRadius: '4px',
              fontSize: '12px',
              fontWeight: 600,
            }}
          >
            <Plus size={14} />
            <span>Add Asset to List</span>
          </button>
        </div>

        {/* Watchlist Tabs */}
        <div style={{ display: 'flex', gap: '8px', marginTop: '20px', flexWrap: 'wrap' }}>
          {watchlists.map((w) => (
            <button
              key={w.id}
              onClick={() => setActiveWatchlistId(w.id)}
              style={{
                padding: '6px 14px',
                fontSize: '12px',
                fontWeight: 600,
                borderRadius: '4px',
                backgroundColor: activeWatchlistId === w.id ? 'var(--bg-surface)' : 'transparent',
                color: activeWatchlistId === w.id ? 'var(--ink-primary)' : 'var(--ink-secondary)',
                border: activeWatchlistId === w.id ? '1px solid var(--border-primary)' : '1px solid transparent',
              }}
            >
              {w.name} ({w.items?.length || 0})
            </button>
          ))}
        </div>
      </div>

      {/* Add Item Form */}
      {isAddingItem && (
        <form onSubmit={handleAddItem} className="paper-panel" style={{ padding: '20px', display: 'flex', gap: '12px', alignItems: 'flex-end', flexWrap: 'wrap' }}>
          <div>
            <label style={{ fontSize: '11px', fontWeight: 700, display: 'block', marginBottom: '4px' }}>ASSET SYMBOL</label>
            <input
              type="text"
              value={newSymbol}
              onChange={(e) => setNewSymbol(e.target.value)}
              placeholder="e.g. SOL, AAPL"
              style={{ padding: '6px 10px', backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-primary)', borderRadius: '3px', width: '120px' }}
              required
            />
          </div>
          <div style={{ flex: 1, minWidth: '200px' }}>
            <label style={{ fontSize: '11px', fontWeight: 700, display: 'block', marginBottom: '4px' }}>RESEARCH NOTES</label>
            <input
              type="text"
              value={newNotes}
              onChange={(e) => setNewNotes(e.target.value)}
              placeholder="Observing breakout, support zone, earnings reaction..."
              style={{ padding: '6px 10px', backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-primary)', borderRadius: '3px', width: '100%' }}
            />
          </div>
          <button
            type="submit"
            style={{ padding: '8px 16px', backgroundColor: 'var(--accent-mbx50)', color: '#FFFFFF', borderRadius: '3px', fontWeight: 700, fontSize: '12px' }}
          >
            Add to Watchlist
          </button>
        </form>
      )}

      {/* Watchlist Table */}
      <div className="paper-panel" style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
          <thead>
            <tr style={{ backgroundColor: 'var(--bg-surface)', borderBottom: '1px solid var(--border-primary)', color: 'var(--ink-secondary)', fontSize: '11px', textTransform: 'uppercase' }}>
              <th style={{ padding: '12px 16px' }}>Asset</th>
              <th style={{ padding: '12px 16px', textAlign: 'right' }}>Live Price</th>
              <th style={{ padding: '12px 16px', textAlign: 'right' }}>24H Change</th>
              <th style={{ padding: '12px 16px' }}>Research Notes</th>
              <th style={{ padding: '12px 16px', textAlign: 'right' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {activeWatchlist?.items?.map((item: any) => (
              <tr
                key={item.id}
                style={{ borderBottom: '1px solid var(--border-subtle)', transition: 'background-color 0.15s ease' }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--bg-surface)')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
              >
                <td style={{ padding: '12px 16px' }}>
                  <Link href={`/asset/${item.asset?.symbol}`} style={{ fontWeight: 800, color: 'var(--ink-primary)' }}>
                    {item.asset?.symbol}
                  </Link>
                  <span style={{ fontSize: '11px', color: 'var(--ink-secondary)', marginLeft: '6px' }}>
                    {item.asset?.name}
                  </span>
                </td>
                <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                  <LivePrice symbol={item.asset?.symbol} fallbackPrice={item.asset?.price} size="md" />
                </td>
                <td
                  className="num-mono"
                  style={{
                    padding: '12px 16px',
                    textAlign: 'right',
                    fontWeight: 600,
                    color: (item.asset?.change24h || 0) >= 0 ? 'var(--color-positive)' : 'var(--color-negative)',
                  }}
                >
                  {(item.asset?.change24h || 0) >= 0 ? '+' : ''}{(item.asset?.change24h || 0).toFixed(2)}%
                </td>
                <td style={{ padding: '12px 16px', color: 'var(--ink-secondary)', fontSize: '12px' }}>
                  {item.notes || '—'}
                </td>
                <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                  <Link
                    href={`/asset/${item.asset?.symbol}`}
                    style={{
                      fontSize: '11px',
                      color: 'var(--accent-mbx50)',
                      fontWeight: 600,
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}
                  >
                    <span>Terminal</span>
                    <ArrowRight size={10} />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
