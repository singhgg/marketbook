import { NextRequest, NextResponse } from 'next/server';
import { nftProvider } from '@/lib/providers/nfts';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: { contract: string; tokenId: string } }
) {
  try {
    const nft = await nftProvider.getNFT(params.contract, params.tokenId);
    if (!nft) {
      return NextResponse.json({ success: false, error: 'NFT not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, nft });
  } catch (error) {
    console.error('Error in /api/nfts/[contract]/[tokenId]:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch NFT' }, { status: 500 });
  }
}
