import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const address = request.nextUrl.searchParams.get('address');
    const type = request.nextUrl.searchParams.get('type');

    const where: any = {};
    if (address) {
      where.OR = [{ fromAddress: address }, { toAddress: address }];
    }
    if (type && type !== 'ALL') {
      where.type = type;
    }

    const activity = await db.activityEvent.findMany({
      where,
      include: {
        nft: {
          include: { collection: true },
        },
      },
      orderBy: { timestamp: 'desc' },
      take: 40,
    });

    return NextResponse.json({ success: true, count: activity.length, activity });
  } catch (error) {
    console.error('Error in /api/activity:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch activity' }, { status: 500 });
  }
}
