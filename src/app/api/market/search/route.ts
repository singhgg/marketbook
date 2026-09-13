import { NextRequest, NextResponse } from 'next/server';
import { marketDataProvider } from '@/lib/providers/marketDataProvider';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q') || '';

    const results = await marketDataProvider.universalSearch(query);
    return NextResponse.json({ success: true, count: results.length, results });
  } catch (error) {
    console.error('Error in /api/market/search:', error);
    return NextResponse.json({ success: false, error: 'Search failed' }, { status: 500 });
  }
}
