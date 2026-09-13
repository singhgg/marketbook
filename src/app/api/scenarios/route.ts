import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { simulateScenario, SCENARIO_PRESETS, ScenarioHolding } from '@/lib/calculations/scenarios';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const scenarios = await db.scenario.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json({ success: true, presets: SCENARIO_PRESETS, scenarios });
  } catch (error) {
    console.error('Error in /api/scenarios:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch scenarios' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { preset, customShocks } = body;

    const portfolio = await db.portfolio.findFirst({
      include: {
        holdings: {
          include: { asset: true },
        },
      },
    });

    if (!portfolio || portfolio.holdings.length === 0) {
      return NextResponse.json({ success: false, error: 'No holdings in portfolio to simulate' }, { status: 400 });
    }

    const holdings: ScenarioHolding[] = portfolio.holdings.map((h) => ({
      symbol: h.asset.symbol,
      name: h.asset.name,
      category: h.asset.assetType as any,
      currentPrice: h.asset.price,
      quantity: h.quantity,
    }));

    const shocks = preset && SCENARIO_PRESETS[preset] ? SCENARIO_PRESETS[preset] : customShocks || {};
    const simulation = simulateScenario(holdings, shocks, preset || 'CUSTOM');

    return NextResponse.json({ success: true, simulation });
  } catch (error) {
    console.error('Error simulating scenario:', error);
    return NextResponse.json({ success: false, error: 'Failed to run scenario simulation' }, { status: 500 });
  }
}
