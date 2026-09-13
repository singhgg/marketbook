'use client';

import React, { useState, useMemo } from 'react';
import { useMarketStore } from '@/lib/store';

interface InteractiveChartProps {
  symbol: string;
  assetType?: string;
  height?: number;
  initialPrice?: number;
}

export function InteractiveChart({
  symbol,
  assetType = 'CRYPTO',
  height = 320,
  initialPrice = 100,
}: InteractiveChartProps) {
  const [timeframe, setTimeframe] = useState<'1D' | '7D' | '1M' | '1Y'>('1D');
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  const liveTick = useMarketStore((s) => s.liveTicks[symbol]);
  const currentPrice = liveTick?.price ?? initialPrice;

  // Asset specific accent color mapping
  const chartColor = useMemo(() => {
    switch (symbol.toUpperCase()) {
      case 'BTC':
        return '#C25E00'; // Burnt orange
      case 'ETH':
        return '#4338CA'; // Indigo
      case 'SOL':
        return '#7C3AED'; // Violet
      case 'MBX-50':
        return '#0E6251'; // Petrol / teal
      case 'NVDA':
      case 'AAPL':
      case 'MSFT':
      case 'SPY':
        return '#1E40AF'; // Deep blue
      default:
        return assetType === 'CRYPTO' ? '#C25E00' : '#1E40AF';
    }
  }, [symbol, assetType]);

  // Generate historical curve data points based on current price and selected timeframe
  const dataPoints = useMemo(() => {
    const count = timeframe === '1D' ? 24 : timeframe === '7D' ? 28 : timeframe === '1M' ? 30 : 52;
    const base = currentPrice * 0.96;
    const points: { time: string; price: number; volume: number }[] = [];

    // Deterministic pseudo-random curve that ends at currentPrice
    let p = base;
    for (let i = 0; i < count; i++) {
      const stepFactor = i / (count - 1);
      const wave = Math.sin(i * 0.45) * (currentPrice * 0.015);
      const trend = base + (currentPrice - base) * stepFactor;
      p = trend + wave;

      if (i === count - 1) {
        p = currentPrice;
      }

      points.push({
        time: timeframe === '1D' ? `${i}:00` : `Day ${i + 1}`,
        price: Number(p.toFixed(2)),
        volume: Math.floor(1000000 + Math.abs(Math.sin(i)) * 4000000),
      });
    }

    return points;
  }, [currentPrice, timeframe]);

  // Compute SVG coordinates
  const prices = dataPoints.map((d) => d.price);
  const minPrice = Math.min(...prices) * 0.998;
  const maxPrice = Math.max(...prices) * 1.002;
  const priceRange = maxPrice - minPrice || 1;

  const svgWidth = 800;
  const svgHeight = height - 70; // reserve space for controls & axes

  const pointsString = dataPoints
    .map((d, index) => {
      const x = (index / (dataPoints.length - 1)) * svgWidth;
      const y = svgHeight - ((d.price - minPrice) / priceRange) * svgHeight;
      return `${x},${y}`;
    })
    .join(' ');

  const activePoint = hoverIndex !== null ? dataPoints[hoverIndex] : dataPoints[dataPoints.length - 1];

  return (
    <div
      className="paper-panel"
      style={{
        padding: '16px',
        backgroundColor: 'var(--bg-secondary)',
        borderRadius: '4px',
        border: '1px solid var(--border-primary)',
      }}
    >
      {/* Header bar: Active Price & Timeframe controls */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: '16px',
        }}
      >
        <div>
          <div style={{ fontSize: '11px', color: 'var(--ink-tertiary)', textTransform: 'uppercase' }}>
            {symbol} Valuation ({timeframe})
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px' }}>
            <span className="num-mono" style={{ fontSize: '24px', fontWeight: 700 }}>
              ${activePoint?.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </span>
            <span style={{ fontSize: '12px', color: 'var(--ink-secondary)' }}>
              {activePoint?.time}
            </span>
          </div>
        </div>

        {/* Timeframe Switcher */}
        <div
          style={{
            display: 'inline-flex',
            backgroundColor: 'var(--bg-surface)',
            border: '1px solid var(--border-primary)',
            borderRadius: '3px',
            padding: '2px',
          }}
        >
          {(['1D', '7D', '1M', '1Y'] as const).map((tf) => (
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
                boxShadow: timeframe === tf ? '0 1px 2px rgba(0,0,0,0.05)' : 'none',
              }}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>

      {/* SVG Chart Surface */}
      <div style={{ position: 'relative', width: '100%', height: `${svgHeight}px` }}>
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          style={{ width: '100%', height: '100%', overflow: 'visible' }}
          preserveAspectRatio="none"
          onMouseLeave={() => setHoverIndex(null)}
        >
          {/* Subtle horizontal gridlines */}
          {[0.25, 0.5, 0.75].map((factor) => {
            const y = svgHeight * factor;
            const gridPrice = maxPrice - factor * priceRange;
            return (
              <g key={factor}>
                <line
                  x1="0"
                  y1={y}
                  x2={svgWidth}
                  y2={y}
                  stroke="var(--border-subtle)"
                  strokeDasharray="4 4"
                  strokeWidth="1"
                />
                <text
                  x={svgWidth - 4}
                  y={y - 4}
                  fill="var(--ink-muted)"
                  fontSize="10"
                  textAnchor="end"
                  className="num-mono"
                >
                  ${gridPrice.toFixed(1)}
                </text>
              </g>
            );
          })}

          {/* Area fill under curve */}
          <polygon
            points={`0,${svgHeight} ${pointsString} ${svgWidth},${svgHeight}`}
            fill={chartColor}
            fillOpacity="0.08"
          />

          {/* Main Price Curve */}
          <polyline
            fill="none"
            stroke={chartColor}
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            points={pointsString}
          />

          {/* Interactive Mouse Hover Overlay */}
          {dataPoints.map((d, index) => {
            const x = (index / (dataPoints.length - 1)) * svgWidth;
            const y = svgHeight - ((d.price - minPrice) / priceRange) * svgHeight;
            const isHovered = hoverIndex === index;

            return (
              <g key={index}>
                <rect
                  x={x - svgWidth / dataPoints.length / 2}
                  y="0"
                  width={svgWidth / dataPoints.length}
                  height={svgHeight}
                  fill="transparent"
                  style={{ cursor: 'crosshair' }}
                  onMouseEnter={() => setHoverIndex(index)}
                />
                {isHovered && (
                  <>
                    <line
                      x1={x}
                      y1="0"
                      x2={x}
                      y2={svgHeight}
                      stroke="var(--ink-tertiary)"
                      strokeDasharray="2 2"
                      strokeWidth="1"
                    />
                    <circle cx={x} cy={y} r="4.5" fill={chartColor} stroke="var(--bg-secondary)" strokeWidth="2" />
                  </>
                )}
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}
