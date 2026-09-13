'use client';

import React, { useState, useEffect } from 'react';
import { Calendar, Building, Tag } from 'lucide-react';

interface IPOItem {
  id: string;
  company: string;
  ticker: string;
  exchange: string;
  expectedDate: string;
  priceRangeLow: number;
  priceRangeHigh: number;
  shares: number;
  industry: string;
  status: string;
}

export default function IPOPage() {
  const [ipos, setIpos] = useState<IPOItem[]>([]);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadIPOs() {
      try {
        const url = statusFilter === 'ALL' ? '/api/ipos' : `/api/ipos?status=${statusFilter}`;
        const res = await fetch(url);
        if (res.ok) {
          const data = await res.json();
          setIpos(data.ipos || []);
        }
      } catch (err) {
        console.error('Failed to load IPOs:', err);
      } finally {
        setLoading(false);
      }
    }
    loadIPOs();
  }, [statusFilter]);

  const tabs = ['ALL', 'UPCOMING', 'FILED', 'LISTED', 'WITHDRAWN'];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div className="paper-panel" style={{ padding: '24px 28px' }}>
        <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--accent-ipo)', marginBottom: '4px' }}>
          PUBLIC OFFERING PIPELINE
        </div>
        <h1 style={{ fontSize: '24px', fontWeight: 800, letterSpacing: '-0.02em', color: 'var(--ink-primary)' }}>
          IPO Calendar & Filings
        </h1>
        <p style={{ color: 'var(--ink-secondary)', fontSize: '13px', marginTop: '4px' }}>
          Track upcoming public debuts, S-1 prospectus filings, pricing ranges, and recently listed market debutants.
        </p>

        {/* Filter Tabs */}
        <div style={{ display: 'flex', gap: '8px', marginTop: '20px', flexWrap: 'wrap' }}>
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setStatusFilter(tab)}
              style={{
                padding: '6px 14px',
                fontSize: '12px',
                fontWeight: 600,
                borderRadius: '4px',
                backgroundColor: statusFilter === tab ? 'var(--ink-primary)' : 'var(--bg-surface)',
                color: statusFilter === tab ? 'var(--bg-base)' : 'var(--ink-secondary)',
                border: statusFilter === tab ? '1px solid var(--ink-primary)' : '1px solid var(--border-primary)',
              }}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* IPO Table */}
      <div className="paper-panel" style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
          <thead>
            <tr style={{ backgroundColor: 'var(--bg-surface)', borderBottom: '1px solid var(--border-primary)', color: 'var(--ink-secondary)', fontSize: '11px', textTransform: 'uppercase' }}>
              <th style={{ padding: '12px 16px' }}>Company</th>
              <th style={{ padding: '12px 16px' }}>Ticker / Exchange</th>
              <th style={{ padding: '12px 16px' }}>Expected Date</th>
              <th style={{ padding: '12px 16px', textAlign: 'right' }}>Price Range</th>
              <th style={{ padding: '12px 16px', textAlign: 'right' }}>Shares Offered</th>
              <th style={{ padding: '12px 16px' }}>Industry</th>
              <th style={{ padding: '12px 16px', textAlign: 'center' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={7} style={{ padding: '24px', textAlign: 'center', color: 'var(--ink-tertiary)' }}>
                  Loading IPO filings...
                </td>
              </tr>
            )}

            {!loading && ipos.length === 0 && (
              <tr>
                <td colSpan={7} style={{ padding: '24px', textAlign: 'center', color: 'var(--ink-tertiary)' }}>
                  No IPOs matching filter criteria.
                </td>
              </tr>
            )}

            {ipos.map((ipo) => (
              <tr
                key={ipo.id}
                style={{ borderBottom: '1px solid var(--border-subtle)', transition: 'background-color 0.15s ease' }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--bg-surface)')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
              >
                <td style={{ padding: '12px 16px' }}>
                  <div style={{ fontWeight: 700, color: 'var(--ink-primary)' }}>{ipo.company}</div>
                </td>
                <td style={{ padding: '12px 16px' }}>
                  <span className="num-mono" style={{ fontWeight: 700, color: 'var(--accent-ipo)' }}>
                    {ipo.ticker}
                  </span>
                  <span style={{ fontSize: '11px', color: 'var(--ink-tertiary)', marginLeft: '6px' }}>
                    {ipo.exchange}
                  </span>
                </td>
                <td style={{ padding: '12px 16px', color: 'var(--ink-secondary)' }}>
                  {new Date(ipo.expectedDate).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                </td>
                <td className="num-mono" style={{ padding: '12px 16px', textAlign: 'right', fontWeight: 600 }}>
                  ${ipo.priceRangeLow.toFixed(2)} - ${ipo.priceRangeHigh.toFixed(2)}
                </td>
                <td className="num-mono" style={{ padding: '12px 16px', textAlign: 'right' }}>
                  {(ipo.shares / 1e6).toFixed(1)}M
                </td>
                <td style={{ padding: '12px 16px', color: 'var(--ink-secondary)' }}>
                  {ipo.industry}
                </td>
                <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                  <span
                    style={{
                      fontSize: '10px',
                      fontWeight: 700,
                      padding: '2px 8px',
                      borderRadius: '3px',
                      backgroundColor:
                        ipo.status === 'UPCOMING'
                          ? 'rgba(180, 83, 9, 0.12)'
                          : ipo.status === 'LISTED'
                          ? 'rgba(5, 150, 105, 0.12)'
                          : 'rgba(107, 114, 128, 0.12)',
                      color:
                        ipo.status === 'UPCOMING'
                          ? 'var(--accent-ipo)'
                          : ipo.status === 'LISTED'
                          ? 'var(--color-positive)'
                          : 'var(--ink-secondary)',
                    }}
                  >
                    {ipo.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
