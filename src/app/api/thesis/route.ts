import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const theses = await db.thesis.findMany({
      include: {
        asset: true,
        evidence: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ success: true, count: theses.length, theses });
  } catch (error) {
    console.error('Error in /api/thesis:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch theses' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { symbol, title, hypothesis, status, targetPrice, timeframeDays, notes, evidence } = body;

    const asset = await db.asset.findUnique({
      where: { symbol: symbol.toUpperCase() },
    });

    if (!asset) {
      return NextResponse.json({ success: false, error: 'Asset not found' }, { status: 404 });
    }

    const user = await db.user.findFirst();
    if (!user) throw new Error('No user found');

    const thesis = await db.thesis.create({
      data: {
        userId: user.id,
        assetId: asset.id,
        title,
        hypothesis,
        status: status || 'OPEN',
        targetPrice: targetPrice ? parseFloat(targetPrice) : null,
        timeframeDays: timeframeDays ? parseInt(timeframeDays) : 30,
        notes,
        evidence: evidence && evidence.length > 0 ? {
          create: evidence.map((e: any) => ({
            isSupporting: e.isSupporting ?? true,
            content: e.content,
            metricSnapshot: e.metricSnapshot,
          })),
        } : undefined,
      },
      include: {
        asset: true,
        evidence: true,
      },
    });

    return NextResponse.json({ success: true, thesis });
  } catch (error) {
    console.error('Error creating thesis:', error);
    return NextResponse.json({ success: false, error: 'Failed to create thesis' }, { status: 500 });
  }
}
