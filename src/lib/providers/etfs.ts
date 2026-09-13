import { MarketAsset } from '../types/market';
import { db } from '../db';
import { getUSEquityMarketStatus } from '../calculations/marketHours';

export class ETFProvider {
  async getETFUniverse(): Promise<MarketAsset[]> {
    const assets = await db.asset.findMany({
      where: { assetType: 'ETF' },
      include: { etf: true },
    });

    const status = getUSEquityMarketStatus();

    return assets.map((a) => ({
      id: a.id,
      symbol: a.symbol,
      name: a.name,
      assetType: 'ETF',
      price: a.price,
      change24h: a.change24h,
      volume24h: a.volume24h,
      lastUpdated: a.lastUpdated.toISOString(),
      isLive: status.isOpen,
      statusText: status.statusText,
      category: a.etf?.category,
      aum: a.etf?.aum,
      expenseRatio: a.etf?.expenseRatio,
      metadata: a.etf?.holdingsSummary,
    }));
  }
}

export const etfProvider = new ETFProvider();
