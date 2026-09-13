'use client';

import React, { useState, useEffect } from 'react';
import { Bell, Plus, Trash2, CheckCircle2, AlertTriangle } from 'lucide-react';
import { useMarketStore } from '@/lib/store';
import { LivePrice } from '@/components/LivePrice';

export default function AlertsPage() {
  const assets = useMarketStore((s) => s.assets);
  const activeAlerts = useMarketStore((s) => s.activeAlerts);
  const triggeredAlerts = useMarketStore((s) => s.triggeredAlerts);
  const dismissAlert = useMarketStore((s) => s.dismissAlert);
  const setAlerts = useMarketStore((s) => s.setAlerts);

  const [isAdding, setIsAdding] = useState(false);
  const [symbol, setSymbol] = useState('BTC');
  const [condition, setCondition] = useState('GREATER_THAN');
  const [threshold, setThreshold] = useState('65000');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const newAlert = {
      id: `alt_${Date.now()}`,
      symbol: symbol.toUpperCase(),
      condition,
      threshold: parseFloat(threshold),
      triggered: false,
    };
    setAlerts([...activeAlerts, newAlert]);
    setIsAdding(false);
  };

  const handleDelete = (id: string) => {
    setAlerts(activeAlerts.filter((a) => a.id !== id));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div className="paper-panel" style={{ padding: '24px 28px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--accent-anomaly)', marginBottom: '4px' }}>
              REAL-TIME EVENT ENGINE
            </div>
            <h1 style={{ fontSize: '24px', fontWeight: 800, letterSpacing: '-0.02em', color: 'var(--ink-primary)' }}>
              Market Triggers & Real-Time Alerts
            </h1>
            <p style={{ color: 'var(--ink-secondary)', fontSize: '13px', marginTop: '4px' }}>
              Autonomous monitoring rules evaluated continuously against incoming live WebSocket tick streams without artificial timer triggers.
            </p>
          </div>

          <button
            onClick={() => setIsAdding(!isAdding)}
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
            <span>Create Alert Rule</span>
          </button>
        </div>
      </div>

      {/* Triggered Notifications Banner if any */}
      {triggeredAlerts.length > 0 && (
        <div
          style={{
            padding: '16px 20px',
            backgroundColor: 'rgba(217, 119, 6, 0.12)',
            border: '1px solid rgba(217, 119, 6, 0.35)',
            borderRadius: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '10px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <AlertTriangle size={18} color="var(--accent-anomaly)" />
            <div>
              <div style={{ fontWeight: 700, fontSize: '13px', color: 'var(--accent-anomaly)' }}>
                Live Trigger Fired ({triggeredAlerts.length})
              </div>
              <div style={{ fontSize: '12px', color: 'var(--ink-secondary)' }}>
                A live price threshold condition was satisfied by the incoming tick stream.
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            {triggeredAlerts.map((tId) => (
              <button
                key={tId}
                onClick={() => dismissAlert(tId)}
                style={{
                  padding: '4px 10px',
                  backgroundColor: 'var(--bg-secondary)',
                  border: '1px solid var(--border-primary)',
                  borderRadius: '3px',
                  fontSize: '11px',
                  fontWeight: 600,
                }}
              >
                Acknowledge {tId.slice(-4)}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Form */}
      {isAdding && (
        <form onSubmit={handleCreate} className="paper-panel" style={{ padding: '20px', display: 'flex', gap: '12px', alignItems: 'flex-end', flexWrap: 'wrap' }}>
          <div>
            <label style={{ fontSize: '11px', fontWeight: 700, display: 'block', marginBottom: '4px' }}>ASSET SYMBOL</label>
            <input
              type="text"
              value={symbol}
              onChange={(e) => setSymbol(e.target.value)}
              style={{ padding: '6px 10px', backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-primary)', borderRadius: '3px', width: '120px' }}
              required
            />
          </div>
          <div>
            <label style={{ fontSize: '11px', fontWeight: 700, display: 'block', marginBottom: '4px' }}>CONDITION</label>
            <select
              value={condition}
              onChange={(e) => setCondition(e.target.value)}
              style={{ padding: '6px 10px', backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-primary)', borderRadius: '3px' }}
            >
              <option value="GREATER_THAN">Price Rises Above (&gt;=)</option>
              <option value="LESS_THAN">Price Drops Below (&lt;=)</option>
            </select>
          </div>
          <div>
            <label style={{ fontSize: '11px', fontWeight: 700, display: 'block', marginBottom: '4px' }}>THRESHOLD PRICE ($)</label>
            <input
              type="number"
              step="any"
              value={threshold}
              onChange={(e) => setThreshold(e.target.value)}
              style={{ padding: '6px 10px', backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-primary)', borderRadius: '3px', width: '140px' }}
              required
            />
          </div>
          <button
            type="submit"
            style={{ padding: '8px 16px', backgroundColor: 'var(--accent-mbx50)', color: '#FFFFFF', borderRadius: '3px', fontWeight: 700, fontSize: '12px' }}
          >
            Activate Real-Time Alert
          </button>
        </form>
      )}

      {/* Rules Table */}
      <div className="paper-panel" style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
          <thead>
            <tr style={{ backgroundColor: 'var(--bg-surface)', borderBottom: '1px solid var(--border-primary)', color: 'var(--ink-secondary)', fontSize: '11px', textTransform: 'uppercase' }}>
              <th style={{ padding: '12px 16px' }}>Rule Asset</th>
              <th style={{ padding: '12px 16px', textAlign: 'right' }}>Current Price</th>
              <th style={{ padding: '12px 16px' }}>Condition</th>
              <th style={{ padding: '12px 16px', textAlign: 'right' }}>Target Threshold</th>
              <th style={{ padding: '12px 16px', textAlign: 'center' }}>Live State</th>
              <th style={{ padding: '12px 16px', textAlign: 'right' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {activeAlerts.map((alert) => {
              const isTriggered = triggeredAlerts.includes(alert.id);
              return (
                <tr
                  key={alert.id}
                  style={{ borderBottom: '1px solid var(--border-subtle)', transition: 'background-color 0.15s ease' }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--bg-surface)')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                >
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{ fontWeight: 800 }}>{alert.symbol}</span>
                  </td>
                  <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                    <LivePrice symbol={alert.symbol} size="md" />
                  </td>
                  <td style={{ padding: '12px 16px', color: 'var(--ink-secondary)', fontSize: '12px' }}>
                    {alert.condition === 'GREATER_THAN' ? 'Breaks above threshold' : 'Drops below threshold'}
                  </td>
                  <td className="num-mono" style={{ padding: '12px 16px', textAlign: 'right', fontWeight: 700 }}>
                    ${alert.threshold.toLocaleString()}
                  </td>
                  <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                    <span
                      style={{
                        fontSize: '10px',
                        fontWeight: 700,
                        padding: '2px 8px',
                        borderRadius: '3px',
                        backgroundColor: isTriggered ? 'var(--color-negative-bg)' : 'rgba(5, 150, 105, 0.1)',
                        color: isTriggered ? 'var(--color-negative)' : 'var(--color-positive)',
                      }}
                    >
                      {isTriggered ? 'TRIGGERED' : 'MONITORING LIVE'}
                    </span>
                  </td>
                  <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                    <button onClick={() => handleDelete(alert.id)} style={{ color: 'var(--ink-tertiary)' }}>
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
