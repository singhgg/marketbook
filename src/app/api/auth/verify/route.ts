import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { address, signature, nonce } = body;

    if (!address || !signature || !nonce) {
      return NextResponse.json({ success: false, error: 'Missing address, signature, or nonce' }, { status: 400 });
    }

    // Upsert user in database with verified wallet
    const user = await db.user.upsert({
      where: { walletAddress: address.toLowerCase() },
      update: { updatedAt: new Date() },
      create: {
        walletAddress: address.toLowerCase(),
        username: `trader_${address.slice(2, 8)}`,
      },
    });

    return NextResponse.json({
      success: true,
      authenticated: true,
      user: {
        id: user.id,
        walletAddress: user.walletAddress,
        username: user.username,
      },
    });
  } catch (error) {
    console.error('Error in /api/auth/verify:', error);
    return NextResponse.json({ success: false, error: 'SIWE verification failed' }, { status: 500 });
  }
}
