import { NextRequest, NextResponse } from 'next/server';
import { nftProvider } from '@/lib/providers/nfts';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const collectionSlug = searchParams.get('collection') || undefined;

    const nfts = await nftProvider.getNFTs({ collectionSlug });
    return NextResponse.json({ success: true, count: nfts.length, nfts });
  } catch (error) {
    console.error('Error in /api/nfts:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch NFTs' }, { status: 500 });
  }
}
