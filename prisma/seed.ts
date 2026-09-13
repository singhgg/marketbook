import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding MarketBook database...');

  // 1. Clean existing records in correct foreign key order
  await prisma.activityEvent.deleteMany();
  await prisma.offer.deleteMany();
  await prisma.listing.deleteMany();
  await prisma.nFT.deleteMany();
  await prisma.collection.deleteMany();
  await prisma.thesisEvidence.deleteMany();
  await prisma.thesis.deleteMany();
  await prisma.scenario.deleteMany();
  await prisma.alert.deleteMany();
  await prisma.watchlistItem.deleteMany();
  await prisma.watchlist.deleteMany();
  await prisma.portfolioAsset.deleteMany();
  await prisma.portfolio.deleteMany();
  await prisma.cryptoAsset.deleteMany();
  await prisma.stock.deleteMany();
  await prisma.eTF.deleteMany();
  await prisma.index.deleteMany();
  await prisma.iPO.deleteMany();
  await prisma.asset.deleteMany();
  await prisma.user.deleteMany();

  // 2. Create primary user
  const user = await prisma.user.create({
    data: {
      id: 'usr_marketbook_primary',
      walletAddress: '0x71C8413661925191CE4D51f8B89736B69f0bA764',
      username: 'SatoshiTerminal',
    },
  });

  // 3. Create Crypto Assets
  const cryptoData = [
    {
      symbol: 'BTC',
      name: 'Bitcoin',
      price: 64250.0,
      change24h: 2.34,
      volume24h: 38240000000,
      marketCap: 1265000000000,
      high52w: 73750.0,
      low52w: 26500.0,
      rank: 1,
      change7d: 4.8,
      change30d: 12.4,
      fdv: 1349000000000,
      circulatingSupply: 19750000,
      totalSupply: 21000000,
      sparkline: JSON.stringify([62100, 62450, 62900, 63100, 63800, 64100, 64250]),
    },
    {
      symbol: 'ETH',
      name: 'Ethereum',
      price: 3480.5,
      change24h: -1.15,
      volume24h: 18450000000,
      marketCap: 418000000000,
      high52w: 4090.0,
      low52w: 1520.0,
      rank: 2,
      change7d: -0.4,
      change30d: 8.2,
      fdv: 418000000000,
      circulatingSupply: 120100000,
      totalSupply: 120100000,
      sparkline: JSON.stringify([3540, 3520, 3505, 3490, 3460, 3475, 3480.5]),
    },
    {
      symbol: 'SOL',
      name: 'Solana',
      price: 152.8,
      change24h: 5.82,
      volume24h: 4230000000,
      marketCap: 71200000000,
      high52w: 210.0,
      low52w: 19.5,
      rank: 3,
      change7d: 14.2,
      change30d: 22.8,
      fdv: 89000000000,
      circulatingSupply: 466000000,
      totalSupply: 580000000,
      sparkline: JSON.stringify([141, 143, 145, 148, 150, 151, 152.8]),
    },
    {
      symbol: 'BNB',
      name: 'BNB Chain',
      price: 582.4,
      change24h: 0.65,
      volume24h: 1120000000,
      marketCap: 89500000000,
      high52w: 720.0,
      low52w: 205.0,
      rank: 4,
      change7d: 1.8,
      change30d: 3.4,
      fdv: 89500000000,
      circulatingSupply: 153800000,
      totalSupply: 153800000,
      sparkline: JSON.stringify([575, 578, 579, 580, 581, 582, 582.4]),
    },
    {
      symbol: 'AVAX',
      name: 'Avalanche',
      price: 28.45,
      change24h: -2.3,
      volume24h: 480000000,
      marketCap: 11200000000,
      high52w: 65.3,
      low52w: 8.9,
      rank: 5,
      change7d: -3.8,
      change30d: 5.1,
      fdv: 20500000000,
      circulatingSupply: 395000000,
      totalSupply: 720000000,
      sparkline: JSON.stringify([29.5, 29.2, 29.0, 28.8, 28.3, 28.4, 28.45]),
    },
    {
      symbol: 'LINK',
      name: 'Chainlink',
      price: 14.15,
      change24h: 3.4,
      volume24h: 310000000,
      marketCap: 8600000000,
      high52w: 22.8,
      low52w: 6.8,
      rank: 6,
      change7d: 8.9,
      change30d: 15.6,
      fdv: 14150000000,
      circulatingSupply: 608000000,
      totalSupply: 1000000000,
      sparkline: JSON.stringify([13.4, 13.6, 13.8, 13.9, 14.0, 14.1, 14.15]),
    },
    {
      symbol: 'SUI',
      name: 'Sui Network',
      price: 1.84,
      change24h: 7.9,
      volume24h: 890000000,
      marketCap: 5100000000,
      high52w: 2.36,
      low52w: 0.36,
      rank: 7,
      change7d: 28.4,
      change30d: 85.2,
      fdv: 18400000000,
      circulatingSupply: 2760000000,
      totalSupply: 10000000000,
      sparkline: JSON.stringify([1.55, 1.62, 1.68, 1.74, 1.79, 1.81, 1.84]),
    },
    {
      symbol: 'NEAR',
      name: 'NEAR Protocol',
      price: 5.12,
      change24h: 4.1,
      volume24h: 340000000,
      marketCap: 6200000000,
      high52w: 9.0,
      low52w: 1.0,
      rank: 8,
      change7d: 11.2,
      change30d: 19.8,
      fdv: 6200000000,
      circulatingSupply: 1210000000,
      totalSupply: 1210000000,
      sparkline: JSON.stringify([4.8, 4.88, 4.92, 5.01, 5.08, 5.1, 5.12]),
    },
  ];

  for (const c of cryptoData) {
    const asset = await prisma.asset.create({
      data: {
        symbol: c.symbol,
        name: c.name,
        assetType: 'CRYPTO',
        price: c.price,
        change24h: c.change24h,
        volume24h: c.volume24h,
        marketCap: c.marketCap,
        high52w: c.high52w,
        low52w: c.low52w,
        crypto: {
          create: {
            rank: c.rank,
            change7d: c.change7d,
            change30d: c.change30d,
            fdv: c.fdv,
            circulatingSupply: c.circulatingSupply,
            totalSupply: c.totalSupply,
            sparkline: c.sparkline,
          },
        },
      },
    });
  }

  // 4. Create Stocks
  const stockData = [
    {
      symbol: 'NVDA',
      name: 'NVIDIA Corporation',
      price: 119.5,
      change24h: 3.12,
      volume24h: 42000000,
      marketCap: 2940000000000,
      high52w: 140.76,
      low52w: 39.23,
      sector: 'Technology',
      industry: 'Semiconductors',
      exchange: 'NASDAQ',
      country: 'US',
      peRatio: 52.4,
      dividendYield: 0.03,
    },
    {
      symbol: 'AAPL',
      name: 'Apple Inc.',
      price: 224.3,
      change24h: -0.45,
      volume24h: 36000000,
      marketCap: 3420000000000,
      high52w: 237.23,
      low52w: 164.08,
      sector: 'Technology',
      industry: 'Consumer Electronics',
      exchange: 'NASDAQ',
      country: 'US',
      peRatio: 33.8,
      dividendYield: 0.44,
    },
    {
      symbol: 'MSFT',
      name: 'Microsoft Corporation',
      price: 432.8,
      change24h: 1.05,
      volume24h: 21000000,
      marketCap: 3210000000000,
      high52w: 468.35,
      low52w: 309.45,
      sector: 'Technology',
      industry: 'Software - Infrastructure',
      exchange: 'NASDAQ',
      country: 'US',
      peRatio: 36.2,
      dividendYield: 0.72,
    },
    {
      symbol: 'AMZN',
      name: 'Amazon.com, Inc.',
      price: 186.4,
      change24h: 0.85,
      volume24h: 28000000,
      marketCap: 1940000000000,
      high52w: 201.2,
      low52w: 118.35,
      sector: 'Consumer Cyclical',
      industry: 'Internet Retail',
      exchange: 'NASDAQ',
      country: 'US',
      peRatio: 42.1,
      dividendYield: 0.0,
    },
    {
      symbol: 'TSLA',
      name: 'Tesla, Inc.',
      price: 218.6,
      change24h: -2.8,
      volume24h: 55000000,
      marketCap: 698000000000,
      high52w: 271.0,
      low52w: 138.8,
      sector: 'Consumer Cyclical',
      industry: 'Auto Manufacturers',
      exchange: 'NASDAQ',
      country: 'US',
      peRatio: 64.5,
      dividendYield: 0.0,
    },
    {
      symbol: 'META',
      name: 'Meta Platforms, Inc.',
      price: 524.2,
      change24h: 1.9,
      volume24h: 16000000,
      marketCap: 1330000000000,
      high52w: 544.23,
      low52w: 279.4,
      sector: 'Communication Services',
      industry: 'Internet Content & Information',
      exchange: 'NASDAQ',
      country: 'US',
      peRatio: 26.8,
      dividendYield: 0.38,
    },
    {
      symbol: 'PLTR',
      name: 'Palantir Technologies',
      price: 36.8,
      change24h: 6.4,
      volume24h: 48000000,
      marketCap: 82000000000,
      high52w: 38.2,
      low52w: 14.48,
      sector: 'Technology',
      industry: 'Software - Infrastructure',
      exchange: 'NYSE',
      country: 'US',
      peRatio: 88.0,
      dividendYield: 0.0,
    },
  ];

  for (const s of stockData) {
    await prisma.asset.create({
      data: {
        symbol: s.symbol,
        name: s.name,
        assetType: 'STOCK',
        price: s.price,
        change24h: s.change24h,
        volume24h: s.volume24h,
        marketCap: s.marketCap,
        high52w: s.high52w,
        low52w: s.low52w,
        stock: {
          create: {
            sector: s.sector,
            industry: s.industry,
            exchange: s.exchange,
            country: s.country,
            peRatio: s.peRatio,
            dividendYield: s.dividendYield,
          },
        },
      },
    });
  }

  // 5. Create ETFs
  const etfData = [
    {
      symbol: 'SPY',
      name: 'SPDR S&P 500 ETF Trust',
      price: 562.4,
      change24h: 0.42,
      volume24h: 52000000,
      aum: 580000000000,
      category: 'Large Blend',
      expenseRatio: 0.09,
      holdings: JSON.stringify(['MSFT (7.1%)', 'AAPL (6.9%)', 'NVDA (6.4%)', 'AMZN (3.8%)', 'META (2.5%)']),
    },
    {
      symbol: 'QQQ',
      name: 'Invesco QQQ Trust',
      price: 484.9,
      change24h: 0.88,
      volume24h: 38000000,
      aum: 285000000000,
      category: 'Large Growth',
      expenseRatio: 0.2,
      holdings: JSON.stringify(['AAPL (8.8%)', 'MSFT (8.4%)', 'NVDA (8.1%)', 'AMZN (5.2%)', 'META (4.8%)']),
    },
    {
      symbol: 'GLD',
      name: 'SPDR Gold Shares',
      price: 236.8,
      change24h: 0.65,
      volume24h: 9400000,
      aum: 68000000000,
      category: 'Precious Metals',
      expenseRatio: 0.4,
      holdings: JSON.stringify(['Physical Gold Bullion (100%)']),
    },
    {
      symbol: 'IBIT',
      name: 'iShares Bitcoin Trust',
      price: 36.4,
      change24h: 2.25,
      volume24h: 24000000,
      aum: 22000000000,
      category: 'Digital Assets',
      expenseRatio: 0.25,
      holdings: JSON.stringify(['Physical Bitcoin (100%)']),
    },
    {
      symbol: 'IWM',
      name: 'iShares Russell 2000 ETF',
      price: 218.2,
      change24h: -0.35,
      volume24h: 24000000,
      aum: 65000000000,
      category: 'Small Blend',
      expenseRatio: 0.19,
      holdings: JSON.stringify(['Super Micro (0.6%)', 'FTAI Aviation (0.5%)', 'Sprouts (0.4%)']),
    },
  ];

  for (const e of etfData) {
    await prisma.asset.create({
      data: {
        symbol: e.symbol,
        name: e.name,
        assetType: 'ETF',
        price: e.price,
        change24h: e.change24h,
        volume24h: e.volume24h,
        etf: {
          create: {
            category: e.category,
            aum: e.aum,
            expenseRatio: e.expenseRatio,
            holdingsSummary: e.holdings,
          },
        },
      },
    });
  }

  // 6. Create Indices (including MBX-50 proprietary index)
  const indexData = [
    {
      symbol: 'MBX-50',
      name: 'MarketBook Composite 50',
      price: 1845.2,
      change24h: 1.48,
      volume24h: 84000000000,
      region: 'Global Cross-Market',
      constituentCount: 50,
      isProprietary: true,
    },
    {
      symbol: 'SPX',
      name: 'S&P 500 Index',
      price: 5635.8,
      change24h: 0.44,
      volume24h: 3100000000,
      region: 'US',
      constituentCount: 503,
      isProprietary: false,
    },
    {
      symbol: 'NDX',
      name: 'NASDAQ 100',
      price: 19842.1,
      change24h: 0.92,
      volume24h: 4200000000,
      region: 'US',
      constituentCount: 101,
      isProprietary: false,
    },
    {
      symbol: 'NIFTY50',
      name: 'NIFTY 50',
      price: 25356.5,
      change24h: 0.38,
      volume24h: 680000000,
      region: 'India',
      constituentCount: 50,
      isProprietary: false,
    },
    {
      symbol: 'SENSEX',
      name: 'BSE SENSEX 30',
      price: 82890.9,
      change24h: 0.41,
      volume24h: 420000000,
      region: 'India',
      constituentCount: 30,
      isProprietary: false,
    },
    {
      symbol: 'N225',
      name: 'Nikkei 225',
      price: 36581.7,
      change24h: -0.68,
      volume24h: 1400000000,
      region: 'Asia / Japan',
      constituentCount: 225,
      isProprietary: false,
    },
    {
      symbol: 'DAX',
      name: 'DAX 40',
      price: 18699.4,
      change24h: 0.15,
      volume24h: 920000000,
      region: 'Europe / Germany',
      constituentCount: 40,
      isProprietary: false,
    },
  ];

  for (const idx of indexData) {
    await prisma.asset.create({
      data: {
        symbol: idx.symbol,
        name: idx.name,
        assetType: 'INDEX',
        price: idx.price,
        change24h: idx.change24h,
        volume24h: idx.volume24h,
        indexAsset: {
          create: {
            region: idx.region,
            constituentCount: idx.constituentCount,
            isProprietary: idx.isProprietary,
          },
        },
      },
    });
  }

  // 7. Create IPO Calendar
  const ipoData = [
    {
      company: 'Stripe, Inc.',
      ticker: 'STRP',
      exchange: 'NYSE',
      expectedDate: new Date('2026-11-18'),
      priceRangeLow: 42.0,
      priceRangeHigh: 48.0,
      shares: 75000000,
      industry: 'Financial Technology / Payments',
      status: 'UPCOMING',
    },
    {
      company: 'Circle Internet Financial',
      ticker: 'CRCL',
      exchange: 'NYSE',
      expectedDate: new Date('2026-10-24'),
      priceRangeLow: 24.0,
      priceRangeHigh: 28.0,
      shares: 40000000,
      industry: 'Digital Assets / Stablecoins',
      status: 'FILED',
    },
    {
      company: 'Databricks, Inc.',
      ticker: 'DATB',
      exchange: 'NASDAQ',
      expectedDate: new Date('2026-12-05'),
      priceRangeLow: 65.0,
      priceRangeHigh: 72.0,
      shares: 50000000,
      industry: 'Enterprise AI & Data Architecture',
      status: 'UPCOMING',
    },
    {
      company: 'Reddit, Inc.',
      ticker: 'RDDT',
      exchange: 'NYSE',
      expectedDate: new Date('2024-03-21'),
      priceRangeLow: 31.0,
      priceRangeHigh: 34.0,
      shares: 22000000,
      industry: 'Social Media & Community',
      status: 'LISTED',
    },
    {
      company: 'Rubrik, Inc.',
      ticker: 'RBRK',
      exchange: 'NYSE',
      expectedDate: new Date('2024-04-25'),
      priceRangeLow: 28.0,
      priceRangeHigh: 31.0,
      shares: 23500000,
      industry: 'Cloud Data Security',
      status: 'LISTED',
    },
  ];

  for (const ipo of ipoData) {
    await prisma.iPO.create({ data: ipo });
  }

  // 8. Create NFT Collections & NFTs
  const collection1 = await prisma.collection.create({
    data: {
      slug: 'chromie-squiggle',
      name: 'Chromie Squiggle by Snowfro',
      description: 'The foundational project of Art Blocks generative art by Erick Calderon (Snowfro).',
      contract: '0x059EDD72Cd353dF5106D2B9cC5ab83a52287aC3a',
      chain: 'Ethereum',
      floorPrice: 8.85,
      volume24h: 34.5,
      totalVolume: 74200,
      itemCount: 10000,
      ownerCount: 2480,
      avatarImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&auto=format&fit=crop&q=80',
      bannerImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80',
    },
  });

  const collection2 = await prisma.collection.create({
    data: {
      slug: 'punks-of-antiquity',
      name: 'Punks of Antiquity',
      description: 'Historical digital artifacts celebrating classical antiquity on-chain.',
      contract: '0xb47e3cd837ddf8e4c57f05d70ab865de6e193bbb',
      chain: 'Ethereum',
      floorPrice: 38.2,
      volume24h: 92.4,
      totalVolume: 924500,
      itemCount: 10000,
      ownerCount: 3820,
      avatarImage: 'https://images.unsplash.com/photo-1634986666676-ec8fd927c23d?w=200&auto=format&fit=crop&q=80',
      bannerImage: 'https://images.unsplash.com/photo-1634986666676-ec8fd927c23d?w=1200&auto=format&fit=crop&q=80',
    },
  });

  const nft1 = await prisma.nFT.create({
    data: {
      tokenId: '7421',
      contract: collection1.contract,
      name: 'Chromie Squiggle #7421 (Ribbed Bold)',
      description: 'A vibrant hyper-saturated ribbed rainbow squiggle with pristine color cycle spacing.',
      imageUrl: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?w=600&auto=format&fit=crop&q=80',
      collectionId: collection1.id,
      creatorId: user.id,
      ownerId: user.id,
      ownerAddress: user.walletAddress,
      rarityRank: 312,
      traits: JSON.stringify([
        { trait_type: 'Type', value: 'Ribbed' },
        { trait_type: 'Color Direction', value: 'Forward' },
        { trait_type: 'Spectrum', value: 'Full Spectrum' },
        { trait_type: 'Segments', value: '18' },
      ]),
      listings: {
        create: {
          sellerId: user.id,
          sellerAddress: user.walletAddress!,
          price: 9.25,
          status: 'ACTIVE',
        },
      },
    },
  });

  const nft2 = await prisma.nFT.create({
    data: {
      tokenId: '2890',
      contract: collection2.contract,
      name: 'Antique Punk #2890 (Fedora & Gold Chain)',
      description: 'Rare cyber-classical portrait with bronze patina and 24K gold chain accessory.',
      imageUrl: 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=600&auto=format&fit=crop&q=80',
      collectionId: collection2.id,
      creatorId: user.id,
      ownerId: user.id,
      ownerAddress: user.walletAddress,
      rarityRank: 124,
      traits: JSON.stringify([
        { trait_type: 'Accessory', value: 'Fedora' },
        { trait_type: 'Necklace', value: 'Gold Chain' },
        { trait_type: 'Eyes', value: 'Horned Rim Glasses' },
        { trait_type: 'Type', value: 'Male' },
      ]),
      listings: {
        create: {
          sellerId: user.id,
          sellerAddress: user.walletAddress!,
          price: 41.5,
          status: 'ACTIVE',
        },
      },
    },
  });

  // 9. Create Activity Events
  await prisma.activityEvent.createMany({
    data: [
      {
        type: 'SALE',
        nftId: nft1.id,
        fromAddress: '0x3a4b9c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b',
        toAddress: user.walletAddress,
        price: 8.9,
        txHash: '0x8f7c9e1d2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d',
      },
      {
        type: 'LISTING',
        nftId: nft1.id,
        fromAddress: user.walletAddress,
        price: 9.25,
        txHash: '0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b',
      },
      {
        type: 'OFFER',
        nftId: nft2.id,
        fromAddress: '0x9999888877776666555544443333222211110000',
        price: 39.0,
        txHash: '0x3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d',
      },
      {
        type: 'MINT',
        nftId: nft1.id,
        toAddress: '0x3a4b9c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b',
        price: 0.5,
        txHash: '0x5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f',
      },
    ],
  });

  // 10. Create Portfolio & Holdings
  const btcAsset = await prisma.asset.findUnique({ where: { symbol: 'BTC' } });
  const ethAsset = await prisma.asset.findUnique({ where: { symbol: 'ETH' } });
  const nvdaAsset = await prisma.asset.findUnique({ where: { symbol: 'NVDA' } });
  const spyAsset = await prisma.asset.findUnique({ where: { symbol: 'SPY' } });

  const portfolio = await prisma.portfolio.create({
    data: {
      userId: user.id,
      name: 'Master Global Macro & Digital Alpha',
    },
  });

  if (btcAsset && ethAsset && nvdaAsset && spyAsset) {
    await prisma.portfolioAsset.createMany({
      data: [
        {
          portfolioId: portfolio.id,
          assetId: btcAsset.id,
          quantity: 1.85,
          averageCost: 58200.0,
          notes: 'Long-term reserve allocation & store of value',
        },
        {
          portfolioId: portfolio.id,
          assetId: ethAsset.id,
          quantity: 14.5,
          averageCost: 3120.0,
          notes: 'Yield generation & smart contract compute exposure',
        },
        {
          portfolioId: portfolio.id,
          assetId: nvdaAsset.id,
          quantity: 150.0,
          averageCost: 98.4,
          notes: 'Core AI hardware infrastructure thesis',
        },
        {
          portfolioId: portfolio.id,
          assetId: spyAsset.id,
          quantity: 80.0,
          averageCost: 512.5,
          notes: 'Baseline macro equity beta anchor',
        },
      ],
    });
  }

  // 11. Create Watchlists
  const watchlist1 = await prisma.watchlist.create({
    data: {
      userId: user.id,
      name: 'High Conviction Watchlist',
      description: 'Assets with active catalyst thesis in the next 90 days',
    },
  });

  if (btcAsset && ethAsset && nvdaAsset) {
    await prisma.watchlistItem.createMany({
      data: [
        {
          watchlistId: watchlist1.id,
          assetId: btcAsset.id,
          notes: 'Monitoring 4H breakout above $65K resistance zone',
        },
        {
          watchlistId: watchlist1.id,
          assetId: ethAsset.id,
          notes: 'ETH/BTC ratio turning point watch',
        },
        {
          watchlistId: watchlist1.id,
          assetId: nvdaAsset.id,
          notes: 'Earnings reaction and datacenter revenue guidance',
        },
      ],
    });
  }

  // 12. Create Alerts
  if (btcAsset && ethAsset) {
    await prisma.alert.createMany({
      data: [
        {
          userId: user.id,
          assetId: btcAsset.id,
          condition: 'GREATER_THAN',
          threshold: 65000.0,
          status: 'ACTIVE',
        },
        {
          userId: user.id,
          assetId: ethAsset.id,
          condition: 'PCT_CHANGE_24H',
          threshold: -4.0,
          status: 'ACTIVE',
        },
      ],
    });
  }

  // 13. Create Theses
  if (ethAsset && btcAsset) {
    const thesis = await prisma.thesis.create({
      data: {
        userId: user.id,
        assetId: ethAsset.id,
        title: 'ETH/BTC Mean Reversion Driven by L2 Blob Fee Reductions & Staking Demand',
        hypothesis: 'Ethereum may outperform Bitcoin over a 45-day horizon as on-chain activity shifts back toward mainnet settlement following major rollup upgrades.',
        status: 'SUPPORTED',
        targetPrice: 3850.0,
        timeframeDays: 45,
        notes: 'Institutional staking products creating supply drain on exchanges.',
        evidence: {
          create: [
            {
              isSupporting: true,
              content: '30-day exchange reserves of ETH declined by 3.2% while L2 transaction throughput increased by 42%.',
              metricSnapshot: 'ETH Exchange Balance: -3.2%, TPS: +42%',
            },
            {
              isSupporting: false,
              content: 'Solana continues taking retail DEX market share in memecoins and consumer apps.',
              metricSnapshot: 'SOL DEX Share: 38% vs ETH: 44%',
            },
          ],
        },
      },
    });
  }

  // 14. Create Scenarios
  await prisma.scenario.createMany({
    data: [
      {
        userId: user.id,
        name: 'Bull Supercycle Expansion',
        preset: 'BULL',
        parameters: JSON.stringify({ BTC: 0.25, ETH: 0.35, NVDA: 0.15, SPY: 0.08 }),
      },
      {
        userId: user.id,
        name: 'Liquidity Squeeze & High Volatility',
        preset: 'BEAR',
        parameters: JSON.stringify({ BTC: -0.18, ETH: -0.24, NVDA: -0.12, SPY: -0.06 }),
      },
      {
        userId: user.id,
        name: 'Macro Rotation to Real Yield',
        preset: 'BASE',
        parameters: JSON.stringify({ BTC: 0.05, ETH: 0.08, NVDA: -0.04, SPY: 0.03 }),
      },
    ],
  });

  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
