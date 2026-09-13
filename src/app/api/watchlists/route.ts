import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const watchlists = await db.watchlist.findMany({
      include: {
        items: {
          include: {
            asset: true,
          },
        },
      },
    });

    return NextResponse.json({ success: true, count: watchlists.length, watchlists });
  } catch (error) {
    console.error('Error in /api/watchlists:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch watchlists' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { watchlistId, symbol, notes } = body;

    const asset = await db.asset.findUnique({
      where: { symbol: symbol.toUpperCase() },
    });

    if (!asset) {
      return NextResponse.json({ success: false, error: 'Asset not found' }, { status: 404 });
    }

    const item = await db.watchlistItem.create({
      data: {
        watchlistId,
        assetId: asset.id,
        notes,
      },
      include: { asset: true },
    });

    return NextResponse.json({ success: true, item });
  } catch (error) {
    console.error('Error adding to watchlist:', error);
    return NextResponse.json({ success: false, error: 'Failed to add item' }, { status: 500 });
  }
}
