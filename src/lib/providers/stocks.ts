import { MarketAsset } from '../types/market';
import { db } from '../db';
import { getUSEquityMarketStatus } from '../calculations/marketHours';

export class StockProvider {
  /**
   * Fetches stocks universe respecting exchange market hours
   */
  async getStockUniverse(): Promise<MarketAsset[]> {
    const assets = await db.asset.findMany({
      where: { assetType: 'STOCK' },
      include: { stock: true },
    });

    const marketStatus = getUSEquityMarketStatus();

    return assets.map((a) => ({
      id: a.id,
      symbol: a.symbol,
      name: a.name,
      assetType: 'STOCK',
      price: a.price,
      change24h: a.change24h,
      volume24h: a.volume24h,
      marketCap: a.marketCap,
      high52w: a.high52w,
      low52w: a.low52w,
      lastUpdated: a.lastUpdated.toISOString(),
      isLive: marketStatus.isOpen,
      statusText: marketStatus.statusText,
      sector: a.stock?.sector,
      industry: a.stock?.industry,
      exchange: a.stock?.exchange,
      country: a.stock?.country,
      peRatio: a.stock?.peRatio,
      dividendYield: a.stock?.dividendYield,
    }));
  }

  async getStock(symbol: string): Promise<MarketAsset | null> {
    const asset = await db.asset.findUnique({
      where: { symbol: symbol.toUpperCase() },
      include: { stock: true },
    });

    if (!asset || asset.assetType !== 'STOCK') return null;

    const marketStatus = getUSEquityMarketStatus();

    return {
      id: asset.id,
      symbol: asset.symbol,
      name: asset.name,
      assetType: 'STOCK',
      price: asset.price,
      change24h: asset.change24h,
      volume24h: asset.volume24h,
      marketCap: asset.marketCap,
      high52w: asset.high52w,
      low52w: asset.low52w,
      lastUpdated: asset.lastUpdated.toISOString(),
      isLive: marketStatus.isOpen,
      statusText: marketStatus.statusText,
      sector: asset.stock?.sector,
      industry: asset.stock?.industry,
      exchange: asset.stock?.exchange,
      country: asset.stock?.country,
      peRatio: asset.stock?.peRatio,
      dividendYield: asset.stock?.dividendYield,
    };
  }
}

export const stockProvider = new StockProvider();
