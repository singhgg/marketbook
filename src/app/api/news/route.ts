import { NextRequest, NextResponse } from 'next/server';
import { newsProvider } from '@/lib/providers/news';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const category = request.nextUrl.searchParams.get('category') || undefined;
    const news = await newsProvider.getNews(category);
    return NextResponse.json({ success: true, count: news.length, news });
  } catch (error) {
    console.error('Error in /api/news:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch news' }, { status: 500 });
  }
}
