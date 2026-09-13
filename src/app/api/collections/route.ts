import { NextResponse } from 'next/server';
import { nftProvider } from '@/lib/providers/nfts';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const collections = await nftProvider.getCollections();
    return NextResponse.json({ success: true, count: collections.length, collections });
  } catch (error) {
    console.error('Error in /api/collections:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch collections' }, { status: 500 });
  }
}
