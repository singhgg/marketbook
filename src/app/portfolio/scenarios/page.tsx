'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Layers, Zap, Info, TrendingUp, TrendingDown, ArrowRight } from 'lucide-react';
import { simulateScenario, SCENARIO_PRESETS, ScenarioSimulationResult } from '@/lib/calculations/scenarios';

export default function ScenarioLabPage() {
  const [preset, setPreset] = useState<'BULL' | 'BASE' | 'BEAR' | 'CUSTOM'>('BULL');
  const [simulation, setSimulation] = useState<ScenarioSimulationResult | null>(null);
  const [loading, setLoading] = useState(true);

  const [btcShock, setBtcShock] = useState(25);
  const [ethShock, setEthShock] = useState(35);
  const [nvdaShock, setNvdaShock] = useState(15);
  const [spyShock, setSpyShock] = useState(7);

  const runSimulation = async (selectedPreset: typeof preset) => {
    setLoading(true);
    try {
      const shocks =
        selectedPreset === 'CUSTOM'
          ? {
              BTC: btcShock / 100,
              ETH: ethShock / 100,
              NVDA: nvdaShock / 100,
              SPY: spyShock / 100,
            }
          : SCENARIO_PRESETS[selectedPreset];

      const res = await fetch('/api/scenarios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          preset: selectedPreset,
          customShocks: shocks,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setSimulation(data.simulation);
      }
    } catch (err) {
      console.error('Scenario simulation failed:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    runSimulation(preset);
  }, [preset]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div className="paper-panel" style={{ padding: '24px 28px' }}>
        <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--accent-mbx50)', marginBottom: '4px' }}>
          STRESS-TESTING & FACTOR SENSITIVITY
        </div>
        <h1 style={{ fontSize: '24px', fontWeight: 800, letterSpacing: '-0.02em', color: 'var(--ink-primary)' }}>
          Scenario Lab (Hypothetical Shock Modeling)
        </h1>
        <p style={{ color: 'var(--ink-secondary)', fontSize: '13px', marginTop: '4px' }}>
          Model cross-market portfolio outcomes under multi-asset price displacements, liquidity squeeze scenarios, and bull market expansions.
        </p>

        {/* Disclaimer Banner */}
        <div
          style={{
            marginTop: '16px',
            padding: '10px 14px',
            backgroundColor: 'rgba(180, 83, 9, 0.08)',
            border: '1px solid rgba(180, 83, 9, 0.25)',
            borderRadius: '4px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '11px',
            color: 'var(--accent-ipo)',
          }}
        >
          <Info size={14} />
          <span>
            <strong>MANDATORY NOTICE &mdash; SIMULATION ONLY:</strong> Projections represent mathematical factor sensitivity models and should never be construed as future price predictions or trading advice.
          </span>
        </div>

        {/* Presets Switcher */}
        <div style={{ display: 'flex', gap: '10px', marginTop: '20px', flexWrap: 'wrap' }}>
          {(['BULL', 'BASE', 'BEAR', 'CUSTOM'] as const).map((p) => (
            <button
              key={p}
              onClick={() => setPreset(p)}
              style={{
                padding: '8px 18px',
                fontSize: '12px',
                fontWeight: 700,
                borderRadius: '4px',
                backgroundColor: preset === p ? 'var(--ink-primary)' : 'var(--bg-surface)',
                color: preset === p ? 'var(--bg-base)' : 'var(--ink-secondary)',
                border: preset === p ? '1px solid var(--ink-primary)' : '1px solid var(--border-primary)',
              }}
            >
              {p === 'BULL' ? '🚀 Bull Expansion (+25% / +35%)' : p === 'BEAR' ? '⚠️ Bear Shock (-22% / -28%)' : p === 'BASE' ? '⚖️ Base Drift (+5% / +6%)' : '⚙️ Custom Shocks'}
            </button>
          ))}
        </div>
      </div>

      {/* Custom Controls (if custom selected) */}
      {preset === 'CUSTOM' && (
        <div className="paper-panel" style={{ padding: '20px' }}>
          <h3 style={{ fontSize: '13px', fontWeight: 700, textTransform: 'uppercase', marginBottom: '14px' }}>
            Configure Custom Asset Shocks (%)
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
            <div>
              <label style={{ fontSize: '11px', fontWeight: 700, color: 'var(--accent-btc)', display: 'block', marginBottom: '4px' }}>
                BTC Shock (%)
              </label>
              <input
                type="number"
                value={btcShock}
                onChange={(e) => setBtcShock(Number(e.target.value))}
                style={{ width: '100%', padding: '6px', backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-primary)', borderRadius: '3px' }}
              />
            </div>
            <div>
              <label style={{ fontSize: '11px', fontWeight: 700, color: 'var(--accent-eth)', display: 'block', marginBottom: '4px' }}>
                ETH Shock (%)
              </label>
              <input
                type="number"
                value={ethShock}
                onChange={(e) => setEthShock(Number(e.target.value))}
                style={{ width: '100%', padding: '6px', backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-primary)', borderRadius: '3px' }}
              />
            </div>
            <div>
              <label style={{ fontSize: '11px', fontWeight: 700, color: 'var(--accent-stocks)', display: 'block', marginBottom: '4px' }}>
                NVDA Shock (%)
              </label>
              <input
                type="number"
                value={nvdaShock}
                onChange={(e) => setNvdaShock(Number(e.target.value))}
                style={{ width: '100%', padding: '6px', backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-primary)', borderRadius: '3px' }}
              />
            </div>
            <div>
              <label style={{ fontSize: '11px', fontWeight: 700, color: 'var(--accent-mbx50)', display: 'block', marginBottom: '4px' }}>
                SPY Shock (%)
              </label>
              <input
                type="number"
                value={spyShock}
                onChange={(e) => setSpyShock(Number(e.target.value))}
                style={{ width: '100%', padding: '6px', backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-primary)', borderRadius: '3px' }}
              />
            </div>
          </div>
          <button
            onClick={() => runSimulation('CUSTOM')}
            style={{
              marginTop: '14px',
              padding: '8px 16px',
              backgroundColor: 'var(--accent-mbx50)',
              color: '#FFFFFF',
              borderRadius: '3px',
              fontWeight: 700,
              fontSize: '12px',
            }}
          >
            Recalculate Custom Projection
          </button>
        </div>
      )}

      {/* Simulation Result Stat Banner */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
        <div className="paper-panel" style={{ padding: '20px' }}>
          <div style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--ink-tertiary)', fontWeight: 600 }}>
            Initial Portfolio Baseline
          </div>
          <div className="num-mono" style={{ fontSize: '24px', fontWeight: 800, marginTop: '4px' }}>
            ${simulation ? simulation.initialTotalValue.toLocaleString(undefined, { minimumFractionDigits: 2 }) : '—'}
          </div>
          <div style={{ fontSize: '11px', color: 'var(--ink-secondary)', marginTop: '2px' }}>
            Current mark-to-market total
          </div>
        </div>

        <div className="paper-panel" style={{ padding: '20px' }}>
          <div style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--ink-tertiary)', fontWeight: 600 }}>
            Projected Value Under Shock
          </div>
          <div className="num-mono" style={{ fontSize: '24px', fontWeight: 800, color: 'var(--ink-primary)', marginTop: '4px' }}>
            ${simulation ? simulation.projectedTotalValue.toLocaleString(undefined, { minimumFractionDigits: 2 }) : '—'}
          </div>
          <div style={{ fontSize: '11px', color: 'var(--ink-secondary)', marginTop: '2px' }}>
            Estimated portfolio outcome
          </div>
        </div>

        <div className="paper-panel" style={{ padding: '20px' }}>
          <div style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--ink-tertiary)', fontWeight: 600 }}>
            Estimated Net Dollar Impact
          </div>
          <div
            className="num-mono"
            style={{
              fontSize: '24px',
              fontWeight: 800,
              color: (simulation?.absoluteImpact ?? 0) >= 0 ? 'var(--color-positive)' : 'var(--color-negative)',
              marginTop: '4px',
            }}
          >
            {(simulation?.absoluteImpact ?? 0) >= 0 ? '+' : ''}$
            {simulation ? Math.abs(simulation.absoluteImpact).toLocaleString(undefined, { minimumFractionDigits: 2 }) : '0.00'}
          </div>
          <div className="num-mono" style={{ fontSize: '12px', fontWeight: 600, color: (simulation?.percentageImpact ?? 0) >= 0 ? 'var(--color-positive)' : 'var(--color-negative)' }}>
            {(simulation?.percentageImpact ?? 0) >= 0 ? '+' : ''}{simulation?.percentageImpact.toFixed(2)}% net portfolio shift
          </div>
        </div>
      </div>

      {/* Asset Contribution Breakdown Table */}
      <div className="paper-panel" style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
          <thead>
            <tr style={{ backgroundColor: 'var(--bg-surface)', borderBottom: '1px solid var(--border-primary)', color: 'var(--ink-secondary)', fontSize: '11px', textTransform: 'uppercase' }}>
              <th style={{ padding: '12px 16px' }}>Asset</th>
              <th style={{ padding: '12px 16px', textAlign: 'right' }}>Initial Value</th>
              <th style={{ padding: '12px 16px', textAlign: 'right' }}>Simulated Shock</th>
              <th style={{ padding: '12px 16px', textAlign: 'right' }}>Projected Value</th>
              <th style={{ padding: '12px 16px', textAlign: 'right' }}>Delta ($ Impact)</th>
            </tr>
          </thead>
          <tbody>
            {simulation?.assetBreakdown.map((item) => (
              <tr
                key={item.symbol}
                style={{ borderBottom: '1px solid var(--border-subtle)', transition: 'background-color 0.15s ease' }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--bg-surface)')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
              >
                <td style={{ padding: '12px 16px' }}>
                  <span style={{ fontWeight: 800 }}>{item.symbol}</span>
                  <span style={{ fontSize: '11px', color: 'var(--ink-secondary)', marginLeft: '6px' }}>{item.name}</span>
                </td>
                <td className="num-mono" style={{ padding: '12px 16px', textAlign: 'right' }}>
                  ${item.initialValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </td>
                <td
                  className="num-mono"
                  style={{
                    padding: '12px 16px',
                    textAlign: 'right',
                    fontWeight: 700,
                    color: item.shockPct >= 0 ? 'var(--color-positive)' : 'var(--color-negative)',
                  }}
                >
                  {item.shockPct >= 0 ? '+' : ''}{item.shockPct}%
                </td>
                <td className="num-mono" style={{ padding: '12px 16px', textAlign: 'right', fontWeight: 700 }}>
                  ${item.projectedValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </td>
                <td
                  className="num-mono"
                  style={{
                    padding: '12px 16px',
                    textAlign: 'right',
                    fontWeight: 700,
                    color: item.deltaValue >= 0 ? 'var(--color-positive)' : 'var(--color-negative)',
                  }}
                >
                  {item.deltaValue >= 0 ? '+' : ''}${item.deltaValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
