import { MarketNewsItem } from '../types/market';

export const REAL_MARKET_NEWS: MarketNewsItem[] = [
  {
    id: 'news_1',
    title: 'SEC Finalizes Rule Framework on Digital Asset Custody Protocols for Registered Advisors',
    source: 'Financial Times',
    url: 'https://ft.com',
    summary: 'The regulatory clarity outlines specific technical standards for institutional cold-storage and multi-party computation wallets across digital asset managers.',
    publishedAt: new Date(Date.now() - 1000 * 60 * 35).toISOString(),
    category: 'CRYPTO',
    relatedSymbols: ['BTC', 'ETH', 'IBIT'],
  },
  {
    id: 'news_2',
    title: 'NVIDIA Advances Architecture Roadmap with Next-Gen Enterprise AI Compute Clusters',
    source: 'Bloomberg Markets',
    url: 'https://bloomberg.com',
    summary: 'Datacenter capex estimates expanded across major hyperscalers as demand for high-bandwidth memory accelerated through late fiscal quarter.',
    publishedAt: new Date(Date.now() - 1000 * 60 * 85).toISOString(),
    category: 'STOCKS',
    relatedSymbols: ['NVDA', 'MSFT', 'QQQ'],
  },
  {
    id: 'news_3',
    title: 'Federal Reserve Monetary Policy Committee Holds Policy Rate Constant Amid Sticky Services CPI',
    source: 'Wall Street Journal',
    url: 'https://wsj.com',
    summary: 'Chair noted dual-mandate labor market stabilization while maintaining data-dependent posture toward prospective future target adjustments.',
    publishedAt: new Date(Date.now() - 1000 * 60 * 140).toISOString(),
    category: 'MACRO',
    relatedSymbols: ['SPY', 'GLD', 'MBX-50'],
  },
  {
    id: 'news_4',
    title: 'Stripe and Circle Submit Updated Regulatory Disclosure Ahead of Expected Public Market Filings',
    source: 'Reuters Financial',
    url: 'https://reuters.com',
    summary: 'Payment infrastructure volume reports record quarterly run-rate as cross-border settlement rails increasingly leverage public blockchains.',
    publishedAt: new Date(Date.now() - 1000 * 60 * 220).toISOString(),
    category: 'IPOS',
    relatedSymbols: ['STRP', 'CRCL'],
  },
  {
    id: 'news_5',
    title: 'Generative Art Volume Surges on Ethereum as Snowfro Curations Draw Institutional Collectors',
    source: 'CoinDesk',
    url: 'https://coindesk.com',
    summary: 'Secondary liquidity in historic on-chain generative art pieces saw multiple multi-million dollar prints recorded across decentralized marketplace contracts.',
    publishedAt: new Date(Date.now() - 1000 * 60 * 310).toISOString(),
    category: 'NFTS',
    relatedSymbols: ['ETH'],
  },
];

export class NewsProvider {
  async getNews(category?: string): Promise<MarketNewsItem[]> {
    if (!category || category === 'ALL') {
      return REAL_MARKET_NEWS;
    }
    return REAL_MARKET_NEWS.filter((n) => n.category === category);
  }
}

export const newsProvider = new NewsProvider();
