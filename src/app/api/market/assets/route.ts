import { NextResponse } from 'next/server';
import { marketDataProvider } from '@/lib/providers/marketDataProvider';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const assets = await marketDataProvider.getAllAssets();
    return NextResponse.json({ success: true, count: assets.length, assets });
  } catch (error) {
    console.error('Error in /api/market/assets:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch assets' }, { status: 500 });
  }
}
