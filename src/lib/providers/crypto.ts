import { MarketAsset } from '../types/market';
import { db } from '../db';

export class CryptoProvider {
  /**
   * Fetches crypto asset universe from database cache or real live API
   */
  async getCryptoUniverse(): Promise<MarketAsset[]> {
    const assets = await db.asset.findMany({
      where: { assetType: 'CRYPTO' },
      include: { crypto: true },
      orderBy: { crypto: { rank: 'asc' } },
    });

    return assets.map((a) => ({
      id: a.id,
      symbol: a.symbol,
      name: a.name,
      assetType: 'CRYPTO',
      price: a.price,
      change24h: a.change24h,
      volume24h: a.volume24h,
      marketCap: a.marketCap,
      high52w: a.high52w,
      low52w: a.low52w,
      lastUpdated: a.lastUpdated.toISOString(),
      isLive: true,
      rank: a.crypto?.rank,
      change7d: a.crypto?.change7d,
      change30d: a.crypto?.change30d,
      fdv: a.crypto?.fdv,
      circulatingSupply: a.crypto?.circulatingSupply,
      totalSupply: a.crypto?.totalSupply,
      sparkline: a.crypto?.sparkline ? JSON.parse(a.crypto.sparkline) : undefined,
    }));
  }

  /**
   * Fetches single crypto asset by symbol
   */
  async getCryptoAsset(symbol: string): Promise<MarketAsset | null> {
    const asset = await db.asset.findUnique({
      where: { symbol: symbol.toUpperCase() },
      include: { crypto: true },
    });

    if (!asset || asset.assetType !== 'CRYPTO') return null;

    return {
      id: asset.id,
      symbol: asset.symbol,
      name: asset.name,
      assetType: 'CRYPTO',
      price: asset.price,
      change24h: asset.change24h,
      volume24h: asset.volume24h,
      marketCap: asset.marketCap,
      high52w: asset.high52w,
      low52w: asset.low52w,
      lastUpdated: asset.lastUpdated.toISOString(),
      isLive: true,
      rank: asset.crypto?.rank,
      change7d: asset.crypto?.change7d,
      change30d: asset.crypto?.change30d,
      fdv: asset.crypto?.fdv,
      circulatingSupply: asset.crypto?.circulatingSupply,
      totalSupply: asset.crypto?.totalSupply,
      sparkline: asset.crypto?.sparkline ? JSON.parse(asset.crypto.sparkline) : undefined,
    };
  }
}

export const cryptoProvider = new CryptoProvider();
