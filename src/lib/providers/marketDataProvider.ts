import { cryptoProvider } from './crypto';
import { stockProvider } from './stocks';
import { etfProvider } from './etfs';
import { indexProvider } from './indices';
import { ipoProvider } from './ipos';
import { nftProvider } from './nfts';
import { newsProvider } from './news';
import { MarketAsset } from '../types/market';
import { db } from '../db';

export interface SearchResultItem {
  id: string;
  symbol: string;
  name: string;
  type: 'CRYPTO' | 'STOCK' | 'ETF' | 'INDEX' | 'IPO' | 'NFT' | 'COLLECTION' | 'WALLET';
  price?: number;
  change24h?: number;
  url: string;
}

export class MarketDataProvider {
  crypto = cryptoProvider;
  stocks = stockProvider;
  etfs = etfProvider;
  indices = indexProvider;
  ipos = ipoProvider;
  nfts = nftProvider;
  news = newsProvider;

  async getAllAssets(): Promise<MarketAsset[]> {
    const [crypto, stocks, etfs, indices] = await Promise.all([
      this.crypto.getCryptoUniverse(),
      this.stocks.getStockUniverse(),
      this.etfs.getETFUniverse(),
      this.indices.getIndices(),
    ]);

    return [...crypto, ...stocks, ...etfs, ...indices];
  }

  async getAssetBySymbol(symbol: string): Promise<MarketAsset | null> {
    const sym = symbol.toUpperCase();
    const crypto = await this.crypto.getCryptoAsset(sym);
    if (crypto) return crypto;

    const stock = await this.stocks.getStock(sym);
    if (stock) return stock;

    const all = await this.getAllAssets();
    return all.find((a) => a.symbol.toUpperCase() === sym) || null;
  }

  /**
   * Provider-backed Universal Search across all categories & wallet addresses
   */
  async universalSearch(query: string): Promise<SearchResultItem[]> {
    if (!query || query.trim().length === 0) return [];
    const q = query.trim().toLowerCase();

    // Check if query is a wallet address (0x...)
    if (q.startsWith('0x') && q.length >= 10) {
      return [
        {
          id: `wallet_${q}`,
          symbol: `${q.slice(0, 6)}...${q.slice(-4)}`,
          name: 'Ethereum Account / Smart Contract',
          type: 'WALLET',
          url: `/activity?address=${q}`,
        },
      ];
    }

    const results: SearchResultItem[] = [];

    // Search Assets (Crypto, Stocks, ETFs, Indices)
    const dbAssets = await db.asset.findMany({
      where: {
        OR: [
          { symbol: { contains: q } },
          { name: { contains: q } },
        ],
      },
      take: 8,
    });

    for (const a of dbAssets) {
      results.push({
        id: a.id,
        symbol: a.symbol,
        name: a.name,
        type: a.assetType as any,
        price: a.price,
        change24h: a.change24h,
        url: `/asset/${a.symbol}`,
      });
    }

    // Search IPOs
    const ipos = await db.iPO.findMany({
      where: {
        OR: [
          { ticker: { contains: q } },
          { company: { contains: q } },
        ],
      },
      take: 4,
    });

    for (const ipo of ipos) {
      results.push({
        id: ipo.id,
        symbol: ipo.ticker,
        name: ipo.company,
        type: 'IPO',
        url: `/ipos`,
      });
    }

    // Search Collections
    const collections = await db.collection.findMany({
      where: {
        OR: [
          { name: { contains: q } },
          { slug: { contains: q } },
        ],
      },
      take: 4,
    });

    for (const col of collections) {
      results.push({
        id: col.id,
        symbol: col.slug,
        name: col.name,
        type: 'COLLECTION',
        price: col.floorPrice,
        url: `/collections/${col.slug}`,
      });
    }

    return results;
  }
}

export const marketDataProvider = new MarketDataProvider();
