import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { computePortfolioValuation, PortfolioHoldingInput } from '@/lib/calculations/portfolio';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const portfolio = await db.portfolio.findFirst({
      include: {
        holdings: {
          include: {
            asset: true,
          },
        },
      },
    });

    if (!portfolio) {
      return NextResponse.json({ success: false, error: 'Portfolio not found' }, { status: 404 });
    }

    const holdingInputs: PortfolioHoldingInput[] = portfolio.holdings.map((h) => ({
      id: h.id,
      assetId: h.assetId,
      symbol: h.asset.symbol,
      name: h.asset.name,
      assetType: h.asset.assetType as any,
      quantity: h.quantity,
      averageCost: h.averageCost,
      currentPrice: h.asset.price,
      change24h: h.asset.change24h,
    }));

    const valuation = computePortfolioValuation(holdingInputs);

    return NextResponse.json({
      success: true,
      portfolio: {
        id: portfolio.id,
        name: portfolio.name,
        valuation,
      },
    });
  } catch (error) {
    console.error('Error in /api/portfolio:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch portfolio' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { symbol, quantity, averageCost, notes } = body;

    const asset = await db.asset.findUnique({
      where: { symbol: symbol.toUpperCase() },
    });

    if (!asset) {
      return NextResponse.json({ success: false, error: 'Asset not found' }, { status: 404 });
    }

    let portfolio = await db.portfolio.findFirst();
    if (!portfolio) {
      const user = await db.user.findFirst();
      if (!user) throw new Error('No user exists');
      portfolio = await db.portfolio.create({
        data: { userId: user.id, name: 'Main Portfolio' },
      });
    }

    const holding = await db.portfolioAsset.create({
      data: {
        portfolioId: portfolio.id,
        assetId: asset.id,
        quantity: parseFloat(quantity),
        averageCost: parseFloat(averageCost),
        notes,
      },
    });

    return NextResponse.json({ success: true, holding });
  } catch (error) {
    console.error('Error adding holding:', error);
    return NextResponse.json({ success: false, error: 'Failed to add holding' }, { status: 500 });
  }
}
