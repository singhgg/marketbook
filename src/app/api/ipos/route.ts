import { NextRequest, NextResponse } from 'next/server';
import { ipoProvider } from '@/lib/providers/ipos';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const status = request.nextUrl.searchParams.get('status') || undefined;
    const ipos = await ipoProvider.getIPOs(status);
    return NextResponse.json({ success: true, count: ipos.length, ipos });
  } catch (error) {
    console.error('Error in /api/ipos:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch IPOs' }, { status: 500 });
  }
}
