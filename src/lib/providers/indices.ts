import { MarketAsset } from '../types/market';
import { db } from '../db';
import { calculateMBX50 } from '../calculations/mbx50';

export class IndexProvider {
  async getIndices(): Promise<MarketAsset[]> {
    const assets = await db.asset.findMany({
      where: { assetType: 'INDEX' },
      include: { indexAsset: true },
    });

    const mbx50Result = calculateMBX50();

    return assets.map((a) => {
      const isMbx = a.symbol === 'MBX-50';
      const price = isMbx ? mbx50Result.indexValue : a.price;
      const change24h = isMbx ? mbx50Result.change24h : a.change24h;

      return {
        id: a.id,
        symbol: a.symbol,
        name: a.name,
        assetType: 'INDEX',
        price,
        change24h,
        volume24h: a.volume24h,
        lastUpdated: new Date().toISOString(),
        isLive: true,
        region: a.indexAsset?.region,
        isProprietary: a.indexAsset?.isProprietary,
      };
    });
  }

  async getIndex(symbol: string): Promise<MarketAsset | null> {
    const sym = symbol.toUpperCase();
    if (sym === 'MBX-50') {
      const mbx50Result = calculateMBX50();
      return {
        id: 'idx_mbx50',
        symbol: 'MBX-50',
        name: 'MarketBook Composite 50',
        assetType: 'INDEX',
        price: mbx50Result.indexValue,
        change24h: mbx50Result.change24h,
        volume24h: 84000000000,
        lastUpdated: new Date().toISOString(),
        isLive: true,
        region: 'Global Cross-Market',
        isProprietary: true,
      };
    }

    const asset = await db.asset.findUnique({
      where: { symbol: sym },
      include: { indexAsset: true },
    });

    if (!asset || asset.assetType !== 'INDEX') return null;

    return {
      id: asset.id,
      symbol: asset.symbol,
      name: asset.name,
      assetType: 'INDEX',
      price: asset.price,
      change24h: asset.change24h,
      volume24h: asset.volume24h,
      lastUpdated: new Date().toISOString(),
      isLive: true,
      region: asset.indexAsset?.region,
      isProprietary: asset.indexAsset?.isProprietary,
    };
  }
}

export const indexProvider = new IndexProvider();
