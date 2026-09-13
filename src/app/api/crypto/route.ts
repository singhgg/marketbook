import { NextResponse } from 'next/server';
import { cryptoProvider } from '@/lib/providers/crypto';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const assets = await cryptoProvider.getCryptoUniverse();
    return NextResponse.json({ success: true, count: assets.length, assets });
  } catch (error) {
    console.error('Error in /api/crypto:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch crypto assets' }, { status: 500 });
  }
}
