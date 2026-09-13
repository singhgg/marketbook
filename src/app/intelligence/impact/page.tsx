'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { GitPullRequest, Info, ArrowRight } from 'lucide-react';
import { LivePrice } from '@/components/LivePrice';

interface NodeItem {
  id: string;
  name: string;
  type: 'CRYPTO' | 'EQUITY' | 'COMMODITY' | 'INDEX';
  x: number;
  y: number;
  color: string;
}

interface EdgeItem {
  source: string;
  target: string;
  correlation: number;
  strength: 'HIGH' | 'MEDIUM' | 'LOW';
  label: string;
}

const NODES: NodeItem[] = [
  { id: 'MBX-50', name: 'MBX-50', type: 'INDEX', x: 380, y: 220, color: '#0E6251' },
  { id: 'BTC', name: 'Bitcoin', type: 'CRYPTO', x: 220, y: 120, color: '#C25E00' },
  { id: 'ETH', name: 'Ethereum', type: 'CRYPTO', x: 160, y: 260, color: '#4338CA' },
  { id: 'SOL', name: 'Solana', type: 'CRYPTO', x: 240, y: 360, color: '#7C3AED' },
  { id: 'NVDA', name: 'NVIDIA', type: 'EQUITY', x: 540, y: 130, color: '#1E40AF' },
  { id: 'SPY', name: 'S&P 500', type: 'EQUITY', x: 600, y: 270, color: '#1E40AF' },
  { id: 'QQQ', name: 'NASDAQ', type: 'EQUITY', x: 480, y: 360, color: '#1E40AF' },
  { id: 'GLD', name: 'Gold', type: 'COMMODITY', x: 380, y: 40, color: '#B45309' },
];

const EDGES: EdgeItem[] = [
  { source: 'MBX-50', target: 'BTC', correlation: 0.91, strength: 'HIGH', label: 'Primary Weight' },
  { source: 'MBX-50', target: 'NVDA', correlation: 0.74, strength: 'HIGH', label: 'Top Equity' },
  { source: 'BTC', target: 'ETH', correlation: 0.88, strength: 'HIGH', label: 'Crypto Macro Lead' },
  { source: 'ETH', target: 'SOL', correlation: 0.81, strength: 'HIGH', label: 'Smart Contract Beta' },
  { source: 'NVDA', target: 'QQQ', correlation: 0.89, strength: 'HIGH', label: 'Tech Factor Driver' },
  { source: 'SPY', target: 'QQQ', correlation: 0.94, strength: 'HIGH', label: 'Equity Baseline' },
  { source: 'BTC', target: 'NVDA', correlation: 0.52, strength: 'MEDIUM', label: 'Risk Sentiment' },
  { source: 'BTC', target: 'GLD', correlation: 0.18, strength: 'LOW', label: 'Alternative Monetary' },
  { source: 'GLD', target: 'NVDA', correlation: -0.15, strength: 'LOW', label: 'Risk vs Hedge' },
];

export default function ImpactGraphPage() {
  const [selectedNode, setSelectedNode] = useState<string>('MBX-50');
  const [timeframe, setTimeframe] = useState<'1D' | '7D' | '30D' | '90D'>('30D');

  const selectedNodeData = NODES.find((n) => n.id === selectedNode);

  // Filter edges related to selected node
  const connectedEdges = EDGES.filter((e) => e.source === selectedNode || e.target === selectedNode);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div className="paper-panel" style={{ padding: '24px 28px' }}>
        <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--accent-mbx50)', marginBottom: '4px' }}>
          CROSS-MARKET TOPOLOGY
        </div>
        <h1 style={{ fontSize: '24px', fontWeight: 800, letterSpacing: '-0.02em', color: 'var(--ink-primary)' }}>
          Inter-Asset Impact & Correlation Graph
        </h1>
        <p style={{ color: 'var(--ink-secondary)', fontSize: '13px', marginTop: '4px' }}>
          Interactive topological network mapping rolling co-movements between digital assets, macro equity factors, and safe-haven commodities.
        </p>

        {/* Disclaimer Alert */}
        <div
          style={{
            marginTop: '16px',
            padding: '10px 14px',
            backgroundColor: 'var(--bg-surface)',
            border: '1px solid var(--border-primary)',
            borderRadius: '4px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '11px',
            color: 'var(--ink-secondary)',
          }}
        >
          <Info size={14} color="var(--ink-tertiary)" />
          <span>
            <strong>Fundamental Rule:</strong> Correlation does not imply causation. Network edge weights denote rolling statistical Pearson coefficients, not deterministic causality.
          </span>
        </div>
      </div>

      {/* Main Grid: Interactive Graph (8 cols) + Node Inspection (4 cols) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '20px' }}>
        {/* Graph Surface (8 cols) */}
        <div className="paper-panel" style={{ gridColumn: 'span 8', padding: '20px', position: 'relative' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <span style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase' }}>
              Network Visualizer ({timeframe})
            </span>

            {/* Timeframe Switcher */}
            <div style={{ display: 'flex', backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-primary)', borderRadius: '3px', padding: '2px' }}>
              {(['1D', '7D', '30D', '90D'] as const).map((tf) => (
                <button
                  key={tf}
                  onClick={() => setTimeframe(tf)}
                  style={{
                    padding: '4px 10px',
                    fontSize: '11px',
                    fontWeight: 600,
                    borderRadius: '2px',
                    backgroundColor: timeframe === tf ? 'var(--bg-secondary)' : 'transparent',
                    color: timeframe === tf ? 'var(--ink-primary)' : 'var(--ink-tertiary)',
                  }}
                >
                  {tf}
                </button>
              ))}
            </div>
          </div>

          <div style={{ width: '100%', height: '460px', backgroundColor: 'var(--bg-secondary)', borderRadius: '4px', overflow: 'hidden' }}>
            <svg viewBox="0 0 760 460" style={{ width: '100%', height: '100%' }}>
              {/* Edges */}
              {EDGES.map((edge, i) => {
                const sourceNode = NODES.find((n) => n.id === edge.source);
                const targetNode = NODES.find((n) => n.id === edge.target);
                if (!sourceNode || !targetNode) return null;

                const isConnected = edge.source === selectedNode || edge.target === selectedNode;

                return (
                  <g key={i}>
                    <line
                      x1={sourceNode.x}
                      y1={sourceNode.y}
                      x2={targetNode.x}
                      y2={targetNode.y}
                      stroke={isConnected ? 'var(--accent-mbx50)' : 'var(--border-strong)'}
                      strokeWidth={isConnected ? 2.5 : 1}
                      strokeOpacity={isConnected ? 0.9 : 0.4}
                      strokeDasharray={edge.strength === 'LOW' ? '4 4' : undefined}
                    />
                  </g>
                );
              })}

              {/* Nodes */}
              {NODES.map((node) => {
                const isSelected = node.id === selectedNode;
                return (
                  <g
                    key={node.id}
                    onClick={() => setSelectedNode(node.id)}
                    style={{ cursor: 'pointer' }}
                  >
                    <circle
                      cx={node.x}
                      cy={node.y}
                      r={isSelected ? 26 : 22}
                      fill={node.color}
                      stroke={isSelected ? '#191B1D' : 'var(--bg-base)'}
                      strokeWidth={isSelected ? 3 : 2}
                    />
                    <text
                      x={node.x}
                      y={node.y + 4}
                      fill="#FFFFFF"
                      fontSize="11"
                      fontWeight="700"
                      textAnchor="middle"
                    >
                      {node.id}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
        </div>

        {/* Node Inspection Sidebar (4 cols) */}
        <div style={{ gridColumn: 'span 4', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="paper-panel" style={{ padding: '20px' }}>
            <div style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--ink-tertiary)', fontWeight: 600 }}>
              Inspecting Selected Node
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginTop: '4px' }}>
              <h3 style={{ fontSize: '20px', fontWeight: 800 }}>{selectedNodeData?.name}</h3>
              <span className="num-mono" style={{ fontSize: '12px', fontWeight: 600, color: 'var(--ink-secondary)' }}>
                ({selectedNodeData?.id})
              </span>
            </div>

            <div style={{ marginTop: '14px', padding: '10px', backgroundColor: 'var(--bg-surface)', borderRadius: '4px' }}>
              <div style={{ fontSize: '11px', color: 'var(--ink-secondary)' }}>Real-Time Valuation</div>
              <LivePrice symbol={selectedNode} showChange={true} size="lg" />
            </div>

            <h4 style={{ fontSize: '12px', fontWeight: 700, marginTop: '20px', marginBottom: '10px', textTransform: 'uppercase' }}>
              Connected Node Relationships ({connectedEdges.length})
            </h4>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {connectedEdges.map((edge, idx) => {
                const other = edge.source === selectedNode ? edge.target : edge.source;
                return (
                  <div
                    key={idx}
                    style={{
                      padding: '8px 10px',
                      backgroundColor: 'var(--bg-surface)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: '3px',
                      fontSize: '11px',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 600 }}>
                      <span>&harr; {other} ({edge.label})</span>
                      <span className="num-mono" style={{ color: 'var(--accent-mbx50)' }}>
                        r = {edge.correlation.toFixed(2)}
                      </span>
                    </div>
                    <div style={{ color: 'var(--ink-tertiary)', marginTop: '2px' }}>
                      Strength: {edge.strength}
                    </div>
                  </div>
                );
              })}
            </div>

            <Link
              href={`/asset/${selectedNode}`}
              style={{
                marginTop: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                padding: '10px',
                backgroundColor: 'var(--ink-primary)',
                color: 'var(--bg-base)',
                borderRadius: '4px',
                fontSize: '12px',
                fontWeight: 600,
              }}
            >
              <span>Full Asset Intelligence &rarr;</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
