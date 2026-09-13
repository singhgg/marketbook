import { NextRequest, NextResponse } from 'next/server';
import { getCorrelationMatrix } from '@/lib/calculations/correlations';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const tf = (request.nextUrl.searchParams.get('timeframe') as any) || '1M';
    const data = getCorrelationMatrix(tf);
    return NextResponse.json({ success: true, ...data });
  } catch (error) {
    console.error('Error in /api/intelligence/correlations:', error);
    return NextResponse.json({ success: false, error: 'Failed to compute correlations' }, { status: 500 });
  }
}
