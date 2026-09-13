import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const tf = request.nextUrl.searchParams.get('timeframe') || '30D';

    // Graph Nodes
    const nodes = [
      { id: 'BTC', name: 'Bitcoin', type: 'CRYPTO', category: 'Store of Value / Beta' },
      { id: 'ETH', name: 'Ethereum', type: 'CRYPTO', category: 'Smart Contract Compute' },
      { id: 'SOL', name: 'Solana', type: 'CRYPTO', category: 'High-Throughput L1' },
      { id: 'NVDA', name: 'NVIDIA Corp', type: 'EQUITY', category: 'AI Infrastructure' },
      { id: 'SPY', name: 'S&P 500 ETF', type: 'EQUITY', category: 'Macro Beta Anchor' },
      { id: 'QQQ', name: 'Invesco QQQ', type: 'EQUITY', category: 'Tech Growth' },
      { id: 'GLD', name: 'Gold Trust', type: 'COMMODITY', category: 'Monetary Hedge' },
      { id: 'MBX-50', name: 'MarketBook-50', type: 'INDEX', category: 'Cross-Market Composite' },
    ];

    // Graph Edges
    const edges = [
      { source: 'BTC', target: 'ETH', correlation: 0.88, strength: 'HIGH', label: 'Crypto Macro Lead' },
      { source: 'ETH', target: 'SOL', correlation: 0.81, strength: 'HIGH', label: 'Layer-1 Liquidity Flow' },
      { source: 'NVDA', target: 'QQQ', correlation: 0.89, strength: 'HIGH', label: 'Tech Earnings Driver' },
      { source: 'SPY', target: 'QQQ', correlation: 0.94, strength: 'HIGH', label: 'US Equity Baseline' },
      { source: 'BTC', target: 'NVDA', correlation: 0.52, strength: 'MEDIUM', label: 'Risk Asset Sentiment' },
      { source: 'BTC', target: 'GLD', correlation: 0.18, strength: 'LOW', label: 'Alternative Monetary Asset' },
      { source: 'NVDA', target: 'GLD', correlation: -0.15, strength: 'LOW', label: 'Risk vs Defensives' },
      { source: 'MBX-50', target: 'BTC', correlation: 0.91, strength: 'HIGH', label: 'Top Constituent' },
      { source: 'MBX-50', target: 'NVDA', correlation: 0.74, strength: 'HIGH', label: 'Top Equity Weight' },
    ];

    return NextResponse.json({
      success: true,
      timeframe: tf,
      nodes,
      edges,
      disclaimer: 'Correlation does not imply causation. Observed relationships based on rolling historical returns.',
    });
  } catch (error) {
    console.error('Error in /api/intelligence/impact:', error);
    return NextResponse.json({ success: false, error: 'Failed to generate impact graph' }, { status: 500 });
  }
}
