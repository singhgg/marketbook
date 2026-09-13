import { NextRequest, NextResponse } from 'next/server';
import { nftProvider } from '@/lib/providers/nfts';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const collection = await nftProvider.getCollectionBySlug(params.slug);
    if (!collection) {
      return NextResponse.json({ success: false, error: 'Collection not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, collection });
  } catch (error) {
    console.error('Error in /api/collections/[slug]:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch collection' }, { status: 500 });
  }
}
