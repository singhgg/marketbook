import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { evaluateMarketRegime } from '@/lib/calculations/regime';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const [crypto, stocks, gld] = await Promise.all([
      db.asset.findMany({ where: { assetType: 'CRYPTO' }, take: 5 }),
      db.asset.findMany({ where: { assetType: 'STOCK' }, take: 5 }),
      db.asset.findUnique({ where: { symbol: 'GLD' } }),
    ]);

    const cryptoAvg = crypto.reduce((sum, a) => sum + a.change24h, 0) / (crypto.length || 1);
    const stockAvg = stocks.reduce((sum, a) => sum + a.change24h, 0) / (stocks.length || 1);
    const goldChange = gld?.change24h ?? 0.4;

    const regime = evaluateMarketRegime({
      cryptoAvgChange: cryptoAvg,
      equityAvgChange: stockAvg,
      goldChange,
      volatilityIndex: 15.8,
    });

    return NextResponse.json({ success: true, regime });
  } catch (error) {
    console.error('Error in /api/intelligence/regime:', error);
    return NextResponse.json({ success: false, error: 'Failed to evaluate market regime' }, { status: 500 });
  }
}
