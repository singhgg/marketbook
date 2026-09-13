import { MarketAsset } from '../types/market';
import { db } from '../db';
import { calculateMBX50 } from '../calculations/mbx50';
import { DEFAULT_INDICES } from '../data/defaultUniverse';

export class IndexProvider {
  async getIndices(): Promise<MarketAsset[]> {
    const mbx50Result = calculateMBX50();

    try {
      const assets = await db.asset.findMany({
        where: { assetType: 'INDEX' },
        include: { indexAsset: true },
      });

      if (assets && assets.length > 0) {
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
    } catch {
      // Fall through to DEFAULT_INDICES
    }

    return DEFAULT_INDICES.map((idx) => {
      const isMbx = idx.symbol === 'MBX-50';
      return {
        ...idx,
        price: isMbx ? mbx50Result.indexValue : idx.price,
        change24h: isMbx ? mbx50Result.change24h : idx.change24h,
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

    try {
      const asset = await db.asset.findUnique({
        where: { symbol: sym },
        include: { indexAsset: true },
      });

      if (asset && asset.assetType === 'INDEX') {
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
    } catch {
      // Fall through to DEFAULT_INDICES
    }

    return DEFAULT_INDICES.find((i) => i.symbol.toUpperCase() === sym) ?? null;
  }
}

export const indexProvider = new IndexProvider();
