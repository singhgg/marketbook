import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const assets = await db.asset.findMany({
      select: {
        symbol: true,
        name: true,
        price: true,
        change24h: true,
        volume24h: true,
        lastUpdated: true,
      },
      take: 20,
    });

    return NextResponse.json({
      success: true,
      timestamp: Date.now(),
      ticker: assets,
    });
  } catch (error) {
    console.error('Error in /api/market/ticker:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch ticker' }, { status: 500 });
  }
}
