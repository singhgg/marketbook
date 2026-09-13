import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const alerts = await db.alert.findMany({
      include: {
        asset: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ success: true, count: alerts.length, alerts });
  } catch (error) {
    console.error('Error in /api/alerts:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch alerts' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { symbol, condition, threshold } = body;

    const asset = await db.asset.findUnique({
      where: { symbol: symbol.toUpperCase() },
    });

    if (!asset) {
      return NextResponse.json({ success: false, error: 'Asset not found' }, { status: 404 });
    }

    const user = await db.user.findFirst();
    if (!user) throw new Error('No user found');

    const alert = await db.alert.create({
      data: {
        userId: user.id,
        assetId: asset.id,
        condition,
        threshold: parseFloat(threshold),
        status: 'ACTIVE',
      },
      include: { asset: true },
    });

    return NextResponse.json({ success: true, alert });
  } catch (error) {
    console.error('Error creating alert:', error);
    return NextResponse.json({ success: false, error: 'Failed to create alert' }, { status: 500 });
  }
}
