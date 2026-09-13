'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Newspaper, ExternalLink, Tag } from 'lucide-react';
import { MarketNewsItem } from '@/lib/types/market';

export default function NewsPage() {
  const [news, setNews] = useState<MarketNewsItem[]>([]);
  const [category, setCategory] = useState<string>('ALL');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadNews() {
      try {
        const url = category === 'ALL' ? '/api/news' : `/api/news?category=${category}`;
        const res = await fetch(url);
        if (res.ok) {
          const data = await res.json();
          setNews(data.news || []);
        }
      } catch (err) {
        console.error('Error fetching news:', err);
      } finally {
        setLoading(false);
      }
    }
    loadNews();
  }, [category]);

  const categories = ['ALL', 'CRYPTO', 'STOCKS', 'MACRO', 'IPOS', 'NFTS'];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div className="paper-panel" style={{ padding: '24px 28px' }}>
        <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--accent-eth)', marginBottom: '4px' }}>
          VERIFIED MARKET JOURNALISM
        </div>
        <h1 style={{ fontSize: '24px', fontWeight: 800, letterSpacing: '-0.02em', color: 'var(--ink-primary)' }}>
          Provider-Backed Financial & Crypto News
        </h1>
        <p style={{ color: 'var(--ink-secondary)', fontSize: '13px', marginTop: '4px' }}>
          Curated financial dispatches, regulatory disclosures, corporate filings, and on-chain protocol updates.
        </p>

        {/* Categories */}
        <div style={{ display: 'flex', gap: '8px', marginTop: '20px', flexWrap: 'wrap' }}>
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              style={{
                padding: '6px 14px',
                fontSize: '12px',
                fontWeight: 600,
                borderRadius: '3px',
                backgroundColor: category === c ? 'var(--ink-primary)' : 'var(--bg-surface)',
                color: category === c ? 'var(--bg-base)' : 'var(--ink-secondary)',
                border: category === c ? '1px solid var(--ink-primary)' : '1px solid var(--border-primary)',
              }}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* News Feed */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {loading && (
          <div className="paper-panel" style={{ padding: '32px', textAlign: 'center', color: 'var(--ink-tertiary)' }}>
            Fetching verified market news...
          </div>
        )}

        {!loading && news.length === 0 && (
          <div className="paper-panel" style={{ padding: '32px', textAlign: 'center', color: 'var(--ink-tertiary)' }}>
            No headlines matching selected filter.
          </div>
        )}

        {news.map((item) => (
          <div key={item.id} className="paper-panel" style={{ padding: '20px 24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span
                  style={{
                    fontSize: '10px',
                    fontWeight: 700,
                    padding: '2px 6px',
                    borderRadius: '2px',
                    backgroundColor: 'var(--bg-surface)',
                    color: 'var(--ink-secondary)',
                  }}
                >
                  {item.category}
                </span>
                <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--accent-stocks)' }}>
                  {item.source}
                </span>
                <span style={{ fontSize: '11px', color: 'var(--ink-tertiary)' }}>
                  &bull; {new Date(item.publishedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>

              <div style={{ display: 'flex', gap: '6px' }}>
                {item.relatedSymbols.map((sym) => (
                  <Link
                    key={sym}
                    href={`/asset/${sym}`}
                    style={{
                      fontSize: '10px',
                      fontWeight: 700,
                      padding: '1px 5px',
                      borderRadius: '2px',
                      backgroundColor: 'rgba(14, 98, 81, 0.1)',
                      color: 'var(--accent-mbx50)',
                    }}
                  >
                    ${sym}
                  </Link>
                ))}
              </div>
            </div>

            <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--ink-primary)', marginBottom: '6px', lineHeight: 1.4 }}>
              {item.title}
            </h3>

            <p style={{ fontSize: '13px', color: 'var(--ink-secondary)', lineHeight: 1.5 }}>
              {item.summary}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
