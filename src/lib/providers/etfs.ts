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
      metadata: a.etf?.holdingsSummary ?? null,
      holdingsSummary: a.etf?.holdingsSummary ?? null,
    }));
  }

  async getETF(symbol: string): Promise<MarketAsset | null> {
    const asset = await db.asset.findUnique({
      where: { symbol: symbol.toUpperCase() },
      include: { etf: true },
    });

    if (!asset || asset.assetType !== 'ETF') return null;

    const status = getUSEquityMarketStatus();

    return {
      id: asset.id,
      symbol: asset.symbol,
      name: asset.name,
      assetType: 'ETF',
      price: asset.price,
      change24h: asset.change24h,
      volume24h: asset.volume24h,
      lastUpdated: asset.lastUpdated.toISOString(),
      isLive: status.isOpen,
      statusText: status.statusText,
      category: asset.etf?.category,
      aum: asset.etf?.aum,
      expenseRatio: asset.etf?.expenseRatio,
      metadata: asset.etf?.holdingsSummary ?? null,
      holdingsSummary: asset.etf?.holdingsSummary ?? null,
    };
  }
}

export const etfProvider = new ETFProvider();
