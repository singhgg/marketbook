'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Compass, Plus, CheckCircle, AlertCircle, Clock, X } from 'lucide-react';

interface ThesisItem {
  id: string;
  title: string;
  hypothesis: string;
  status: 'OPEN' | 'SUPPORTED' | 'WEAKENING' | 'INVALIDATED';
  targetPrice?: number | null;
  timeframeDays: number;
  notes?: string | null;
  createdAt: string;
  asset: {
    symbol: string;
    name: string;
    price: number;
  };
  evidence: {
    id: string;
    isSupporting: boolean;
    content: string;
    metricSnapshot?: string | null;
  }[];
}

function ThesisBuilderContent() {
  const searchParams = useSearchParams();
  const initialSymbol = searchParams?.get('symbol') || 'ETH';

  const [theses, setTheses] = useState<ThesisItem[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [symbol, setSymbol] = useState(initialSymbol);
  const [title, setTitle] = useState('');
  const [hypothesis, setHypothesis] = useState('');
  const [targetPrice, setTargetPrice] = useState('');
  const [timeframeDays, setTimeframeDays] = useState('30');
  const [supportingEvidence, setSupportingEvidence] = useState('');
  const [contradictingEvidence, setContradictingEvidence] = useState('');

  const loadTheses = async () => {
    try {
      const res = await fetch('/api/thesis');
      if (res.ok) {
        const data = await res.json();
        setTheses(data.theses || []);
      }
    } catch (err) {
      console.error('Failed to load theses:', err);
    }
  };

  useEffect(() => {
    loadTheses();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !hypothesis) return;

    try {
      const evidence = [];
      if (supportingEvidence) {
        evidence.push({ isSupporting: true, content: supportingEvidence });
      }
      if (contradictingEvidence) {
        evidence.push({ isSupporting: false, content: contradictingEvidence });
      }

      const res = await fetch('/api/thesis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          symbol,
          title,
          hypothesis,
          targetPrice: targetPrice ? parseFloat(targetPrice) : null,
          timeframeDays: parseInt(timeframeDays),
          status: 'OPEN',
          evidence,
        }),
      });

      if (res.ok) {
        setIsCreating(false);
        setTitle('');
        setHypothesis('');
        setTargetPrice('');
        setSupportingEvidence('');
        setContradictingEvidence('');
        loadTheses();
      }
    } catch (err) {
      console.error('Error creating thesis:', err);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div className="paper-panel" style={{ padding: '24px 28px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--accent-mbx50)', marginBottom: '4px' }}>
              RESEARCH METHODOLOGY
            </div>
            <h1 style={{ fontSize: '24px', fontWeight: 800, letterSpacing: '-0.02em', color: 'var(--ink-primary)' }}>
              Thesis Builder & Hypothesis Workspace
            </h1>
            <p style={{ color: 'var(--ink-secondary)', fontSize: '13px', marginTop: '4px' }}>
              Formulate structured investment theses, log observable supporting and contradicting signals, and maintain discipline through market regimes.
            </p>
          </div>

          <button
            onClick={() => setIsCreating(!isCreating)}
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
            {isCreating ? <X size={14} /> : <Plus size={14} />}
            <span>{isCreating ? 'Cancel Formulation' : 'New Research Thesis'}</span>
          </button>
        </div>
      </div>

      {/* Creation Modal / Form */}
      {isCreating && (
        <form
          onSubmit={handleCreate}
          className="paper-panel"
          style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}
        >
          <h3 style={{ fontSize: '16px', fontWeight: 700 }}>Formulate Investment Thesis</h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
            <div>
              <label style={{ fontSize: '11px', fontWeight: 700, color: 'var(--ink-secondary)', display: 'block', marginBottom: '4px' }}>
                ASSET SYMBOL
              </label>
              <input
                type="text"
                value={symbol}
                onChange={(e) => setSymbol(e.target.value)}
                placeholder="e.g. ETH, BTC, NVDA"
                style={{ width: '100%', padding: '8px', backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-primary)', borderRadius: '3px' }}
                required
              />
            </div>

            <div>
              <label style={{ fontSize: '11px', fontWeight: 700, color: 'var(--ink-secondary)', display: 'block', marginBottom: '4px' }}>
                TARGET PRICE (OPTIONAL)
              </label>
              <input
                type="number"
                step="any"
                value={targetPrice}
                onChange={(e) => setTargetPrice(e.target.value)}
                placeholder="e.g. 3850"
                style={{ width: '100%', padding: '8px', backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-primary)', borderRadius: '3px' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '11px', fontWeight: 700, color: 'var(--ink-secondary)', display: 'block', marginBottom: '4px' }}>
                TIMEFRAME (DAYS)
              </label>
              <select
                value={timeframeDays}
                onChange={(e) => setTimeframeDays(e.target.value)}
                style={{ width: '100%', padding: '8px', backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-primary)', borderRadius: '3px' }}
              >
                <option value="14">14 Days</option>
                <option value="30">30 Days</option>
                <option value="45">45 Days</option>
                <option value="90">90 Days</option>
                <option value="180">180 Days</option>
              </select>
            </div>
          </div>

          <div>
            <label style={{ fontSize: '11px', fontWeight: 700, color: 'var(--ink-secondary)', display: 'block', marginBottom: '4px' }}>
              THESIS TITLE
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. ETH/BTC Mean Reversion Driven by Staking Inflows"
              style={{ width: '100%', padding: '8px', backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-primary)', borderRadius: '3px' }}
              required
            />
          </div>

          <div>
            <label style={{ fontSize: '11px', fontWeight: 700, color: 'var(--ink-secondary)', display: 'block', marginBottom: '4px' }}>
              CORE HYPOTHESIS
            </label>
            <textarea
              value={hypothesis}
              onChange={(e) => setHypothesis(e.target.value)}
              rows={3}
              placeholder="Detail the core mechanism and catalyst driving expected performance..."
              style={{ width: '100%', padding: '8px', backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-primary)', borderRadius: '3px', fontFamily: 'inherit' }}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
            <div>
              <label style={{ fontSize: '11px', fontWeight: 700, color: 'var(--color-positive)', display: 'block', marginBottom: '4px' }}>
                SUPPORTING EVIDENCE / CATALYST
              </label>
              <textarea
                value={supportingEvidence}
                onChange={(e) => setSupportingEvidence(e.target.value)}
                rows={2}
                placeholder="Observed signals supporting the hypothesis..."
                style={{ width: '100%', padding: '8px', backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-primary)', borderRadius: '3px', fontFamily: 'inherit' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '11px', fontWeight: 700, color: 'var(--color-negative)', display: 'block', marginBottom: '4px' }}>
                CONTRADICTING RISKS / INVALIDATION CRITERIA
              </label>
              <textarea
                value={contradictingEvidence}
                onChange={(e) => setContradictingEvidence(e.target.value)}
                rows={2}
                placeholder="What condition or metric proves this thesis wrong?..."
                style={{ width: '100%', padding: '8px', backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-primary)', borderRadius: '3px', fontFamily: 'inherit' }}
              />
            </div>
          </div>

          <button
            type="submit"
            style={{
              padding: '10px 20px',
              backgroundColor: 'var(--accent-mbx50)',
              color: '#FFFFFF',
              borderRadius: '4px',
              fontWeight: 700,
              fontSize: '13px',
              alignSelf: 'flex-start',
            }}
          >
            Save Thesis & Begin Tracking
          </button>
        </form>
      )}

      {/* Existing Theses List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {theses.map((t) => (
          <div key={t.id} className="paper-panel" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <span style={{ fontSize: '11px', fontWeight: 800, padding: '2px 6px', backgroundColor: 'var(--bg-surface)', borderRadius: '2px' }}>
                    {t.asset?.symbol}
                  </span>
                  <span
                    style={{
                      fontSize: '10px',
                      fontWeight: 800,
                      padding: '2px 6px',
                      borderRadius: '2px',
                      backgroundColor:
                        t.status === 'SUPPORTED'
                          ? 'rgba(5, 150, 105, 0.12)'
                          : t.status === 'WEAKENING'
                          ? 'rgba(217, 119, 6, 0.12)'
                          : t.status === 'INVALIDATED'
                          ? 'rgba(220, 38, 38, 0.12)'
                          : 'rgba(107, 114, 128, 0.12)',
                      color:
                        t.status === 'SUPPORTED'
                          ? 'var(--color-positive)'
                          : t.status === 'WEAKENING'
                          ? 'var(--accent-anomaly)'
                          : t.status === 'INVALIDATED'
                          ? 'var(--color-negative)'
                          : 'var(--ink-secondary)',
                    }}
                  >
                    STATUS: {t.status}
                  </span>
                  <span style={{ fontSize: '11px', color: 'var(--ink-tertiary)' }}>
                    Horizon: {t.timeframeDays} Days
                  </span>
                </div>

                <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--ink-primary)' }}>
                  {t.title}
                </h3>
              </div>

              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '10px', textTransform: 'uppercase', color: 'var(--ink-tertiary)' }}>Current / Target</div>
                <div className="num-mono" style={{ fontSize: '14px', fontWeight: 700 }}>
                  ${t.asset?.price.toLocaleString()} {t.targetPrice ? `&rarr; $${t.targetPrice.toLocaleString()}` : ''}
                </div>
              </div>
            </div>

            <p style={{ fontSize: '13px', color: 'var(--ink-secondary)', marginTop: '10px', lineHeight: 1.5 }}>
              {t.hypothesis}
            </p>

            {/* Evidence items */}
            {t.evidence && t.evidence.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '16px' }}>
                {t.evidence.map((ev) => (
                  <div
                    key={ev.id}
                    style={{
                      padding: '8px 12px',
                      backgroundColor: 'var(--bg-surface)',
                      borderLeft: `3px solid ${ev.isSupporting ? 'var(--color-positive)' : 'var(--color-negative)'}`,
                      borderRadius: '2px',
                      fontSize: '12px',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600, color: ev.isSupporting ? 'var(--color-positive)' : 'var(--color-negative)' }}>
                      {ev.isSupporting ? <CheckCircle size={12} /> : <AlertCircle size={12} />}
                      <span>{ev.isSupporting ? 'Supporting Observation' : 'Contradicting / Invalidation Factor'}</span>
                    </div>
                    <div style={{ color: 'var(--ink-primary)', marginTop: '2px' }}>
                      {ev.content}
                    </div>
                    {ev.metricSnapshot && (
                      <div className="num-mono" style={{ fontSize: '11px', color: 'var(--ink-tertiary)', marginTop: '2px' }}>
                        Snapshot: {ev.metricSnapshot}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ThesisBuilderPage() {
  return (
    <Suspense fallback={<div style={{ padding: '40px', textAlign: 'center' }}>Loading research thesis workspace...</div>}>
      <ThesisBuilderContent />
    </Suspense>
  );
}
