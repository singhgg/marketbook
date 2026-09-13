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
      // If MBX-50, update with dynamic calculated composite value
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
}

export const indexProvider = new IndexProvider();
