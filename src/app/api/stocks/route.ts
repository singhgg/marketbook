import { NextResponse } from 'next/server';
import { stockProvider } from '@/lib/providers/stocks';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const assets = await stockProvider.getStockUniverse();
    return NextResponse.json({ success: true, count: assets.length, assets });
  } catch (error) {
    console.error('Error in /api/stocks:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch stock assets' }, { status: 500 });
  }
}
