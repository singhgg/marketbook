'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Search, X, ArrowRight, CornerDownLeft } from 'lucide-react';
import { SearchResultItem } from '@/lib/providers/marketDataProvider';

export function SearchModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResultItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setQuery('');
      setResults([]);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/market/search?q=${encodeURIComponent(query)}`);
        if (res.ok) {
          const data = await res.json();
          setResults(data.results || []);
          setSelectedIndex(0);
        }
      } catch (err) {
        console.error('Search error:', err);
      } finally {
        setLoading(false);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [query]);

  const handleSelect = (url: string) => {
    onClose();
    router.push(url);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % (results.length || 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + results.length) % (results.length || 1));
    } else if (e.key === 'Enter' && results[selectedIndex]) {
      e.preventDefault();
      handleSelect(results[selectedIndex].url);
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  if (!isOpen) return null;

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
        alignItems: 'flex-start',
        justifyContent: 'center',
        paddingTop: '80px',
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '580px',
          backgroundColor: 'var(--bg-secondary)',
          border: '1px solid var(--border-primary)',
          borderRadius: '6px',
          boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
          overflow: 'hidden',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Input Bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            padding: '12px 16px',
            borderBottom: '1px solid var(--border-primary)',
            gap: '10px',
          }}
        >
          <Search size={18} color="var(--ink-secondary)" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search crypto, stocks, ETFs, indices, IPOs, NFTs, 0x wallet..."
            style={{
              width: '100%',
              border: 'none',
              background: 'transparent',
              fontSize: '15px',
              fontFamily: 'var(--font-sans)',
              color: 'var(--ink-primary)',
              outline: 'none',
            }}
          />
          {query && (
            <button onClick={() => setQuery('')}>
              <X size={16} color="var(--ink-tertiary)" />
            </button>
          )}
          <span
            style={{
              fontSize: '11px',
              color: 'var(--ink-tertiary)',
              backgroundColor: 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)',
              padding: '2px 5px',
              borderRadius: '3px',
            }}
          >
            ESC
          </span>
        </div>

        {/* Results List */}
        <div style={{ maxHeight: '360px', overflowY: 'auto', padding: '6px' }}>
          {loading && (
            <div style={{ padding: '16px', textAlign: 'center', color: 'var(--ink-tertiary)' }}>
              Searching across market universes...
            </div>
          )}

          {!loading && query && results.length === 0 && (
            <div style={{ padding: '20px', textAlign: 'center', color: 'var(--ink-tertiary)' }}>
              No matches found for &quot;{query}&quot;
            </div>
          )}

          {!loading && !query && (
            <div style={{ padding: '14px 16px', fontSize: '12px', color: 'var(--ink-tertiary)' }}>
              Try searching &ldquo;BTC&rdquo;, &ldquo;NVIDIA&rdquo;, &ldquo;SPY&rdquo;, &ldquo;Squiggle&rdquo;, or an Ethereum address.
            </div>
          )}

          {results.map((item, index) => {
            const isSelected = index === selectedIndex;
            return (
              <div
                key={item.id}
                onClick={() => handleSelect(item.url)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px 12px',
                  borderRadius: '4px',
                  backgroundColor: isSelected ? 'var(--bg-surface)' : 'transparent',
                  border: isSelected ? '1px solid var(--border-primary)' : '1px solid transparent',
                  cursor: 'pointer',
                }}
                onMouseEnter={() => setSelectedIndex(index)}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span
                    style={{
                      fontSize: '10px',
                      fontWeight: 700,
                      padding: '2px 6px',
                      borderRadius: '2px',
                      backgroundColor:
                        item.type === 'CRYPTO'
                          ? 'rgba(194, 94, 0, 0.12)'
                          : item.type === 'STOCK'
                          ? 'rgba(30, 64, 175, 0.12)'
                          : item.type === 'NFT' || item.type === 'COLLECTION'
                          ? 'rgba(192, 38, 211, 0.12)'
                          : item.type === 'CONTRACT'
                          ? '#E0F2F1'
                          : 'rgba(14, 98, 81, 0.12)',
                      color:
                        item.type === 'CRYPTO'
                          ? 'var(--accent-btc)'
                          : item.type === 'STOCK'
                          ? 'var(--accent-stocks)'
                          : item.type === 'NFT' || item.type === 'COLLECTION'
                          ? 'var(--accent-nft)'
                          : item.type === 'CONTRACT'
                          ? '#0E6251'
                          : 'var(--accent-mbx50)',
                      border: item.type === 'CONTRACT' ? '1px solid #B2DFDB' : 'none',
                    }}
                  >
                    {item.type}
                  </span>
                  <div>
                    <div style={{ fontWeight: item.type === 'CONTRACT' ? 700 : 600, fontSize: '13px', color: item.type === 'CONTRACT' ? '#0E6251' : 'var(--ink-primary)' }}>
                      {item.symbol}
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--ink-secondary)' }}>
                      {item.name}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {item.price !== undefined && (
                    <span className="num-mono" style={{ fontSize: '13px', fontWeight: 600 }}>
                      ${item.price.toLocaleString()}
                    </span>
                  )}
                  {isSelected && <CornerDownLeft size={14} color="var(--ink-tertiary)" />}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
