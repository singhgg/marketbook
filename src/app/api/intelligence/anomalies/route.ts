import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { detectMarketAnomalies, AnomalyInputAsset } from '@/lib/calculations/anomalies';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const assets = await db.asset.findMany({
      take: 30,
    });

    const anomalyInput: AnomalyInputAsset[] = assets.map((a) => ({
      symbol: a.symbol,
      name: a.name,
      assetType: a.assetType as any,
      price: a.price,
      change24h: a.change24h,
      volume24h: a.volume24h,
      avgVolume30d: a.volume24h * 0.45,
    }));

    const anomalies = detectMarketAnomalies(anomalyInput);

    return NextResponse.json({
      success: true,
      count: anomalies.length,
      anomalies,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error in /api/intelligence/anomalies:', error);
    return NextResponse.json({ success: false, error: 'Failed to detect anomalies' }, { status: 500 });
  }
}
