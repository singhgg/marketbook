export type AssetType = 'CRYPTO' | 'STOCK' | 'ETF' | 'INDEX' | 'NFT';

export type ConnectionStatus = 'LIVE' | 'CONNECTING' | 'RECONNECTING' | 'MARKET CLOSED' | 'DEMO' | 'DATA UNAVAILABLE';

export interface MarketAsset {
  id: string;
  symbol: string;
  name: string;
  assetType: AssetType;
  price: number;
  change24h: number;
  volume24h: number;
  marketCap?: number | null;
  high52w?: number | null;
  low52w?: number | null;
  lastUpdated: string;
  isLive: boolean;
  statusText?: string;
  // Specific details
  rank?: number;
  change7d?: number | null;
  change30d?: number | null;
  fdv?: number | null;
  circulatingSupply?: number | null;
  totalSupply?: number | null;
  sparkline?: number[];
  sector?: string;
  industry?: string;
  exchange?: string;
  country?: string;
  peRatio?: number | null;
  dividendYield?: number | null;
  category?: string;
  aum?: number | null;
  expenseRatio?: number | null;
  region?: string;
  isProprietary?: boolean;
  metadata?: string | null;
  holdingsSummary?: string | null;
}

export interface LiveTick {
  symbol: string;
  price: number;
  change24h: number;
  volume24h?: number;
  high24h?: number;
  low24h?: number;
  timestamp: number;
  direction?: 'UP' | 'DOWN' | 'EQUAL';
}

export interface MarketNewsItem {
  id: string;
  title: string;
  source: string;
  url: string;
  summary: string;
  publishedAt: string;
  category: 'ALL' | 'CRYPTO' | 'STOCKS' | 'MACRO' | 'IPOS' | 'NFTS';
  relatedSymbols: string[];
}
