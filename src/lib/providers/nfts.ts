import { db } from '../db';
import { DEFAULT_COLLECTIONS } from '../data/defaultUniverse';

export class NFTProvider {
  async getCollections() {
    try {
      const collections = await db.collection.findMany({
        include: {
          _count: {
            select: { nfts: true },
          },
        },
        orderBy: { volume24h: 'desc' },
      });
      if (collections && collections.length > 0) return collections;
    } catch {
      // Fall through to DEFAULT_COLLECTIONS
    }
    return DEFAULT_COLLECTIONS;
  }

  async getCollectionBySlug(slug: string) {
    try {
      const col = await db.collection.findUnique({
        where: { slug },
        include: {
          nfts: {
            include: {
              listings: { where: { status: 'ACTIVE' } },
              offers: { where: { status: 'PENDING' } },
            },
          },
        },
      });
      if (col) return col;
    } catch {
      // Fall through
    }
    return DEFAULT_COLLECTIONS.find((c) => c.slug === slug) ?? null;
  }

  async getNFTs(filters?: { collectionSlug?: string; minPrice?: number; maxPrice?: number }) {
    try {
      const where: any = {};
      if (filters?.collectionSlug) {
        where.collection = { slug: filters.collectionSlug };
      }

      const nfts = await db.nFT.findMany({
        where,
        include: {
          collection: true,
          listings: { where: { status: 'ACTIVE' } },
          offers: { where: { status: 'PENDING' } },
        },
        orderBy: { createdAt: 'desc' },
      });
      if (nfts && nfts.length > 0) return nfts;
    } catch {
      // Fall through
    }

    const allNfts = DEFAULT_COLLECTIONS.flatMap((c) =>
      c.nfts.map((nft) => ({
        ...nft,
        collection: {
          id: c.id,
          name: c.name,
          slug: c.slug,
          contract: c.contract,
          chain: c.chain,
          floorPrice: c.floorPrice,
        },
      }))
    );

    if (filters?.collectionSlug) {
      return allNfts.filter((n) => n.collection.slug === filters.collectionSlug);
    }
    return allNfts;
  }

  async getNFT(contract: string, tokenId: string) {
    try {
      const nft = await db.nFT.findUnique({
        where: {
          contract_tokenId: {
            contract,
            tokenId,
          },
        },
        include: {
          collection: true,
          creator: true,
          owner: true,
          listings: {
            orderBy: { createdAt: 'desc' },
          },
          offers: {
            orderBy: { createdAt: 'desc' },
          },
          activity: {
            orderBy: { timestamp: 'desc' },
            take: 20,
          },
        },
      });
      if (nft) return nft;
    } catch {
      // Fall through
    }

    for (const c of DEFAULT_COLLECTIONS) {
      const match = c.nfts.find(
        (n) => n.contract.toLowerCase() === contract.toLowerCase() && n.tokenId === tokenId
      );
      if (match) {
        return {
          ...match,
          collection: c,
          creator: { username: 'MarketBook Creator', walletAddress: '0x71C8413661925191CE4D51f8B89736B69f0bA764' },
          owner: { username: 'MarketBook Collector', walletAddress: '0x71C8413661925191CE4D51f8B89736B69f0bA764' },
          activity: [],
        };
      }
    }

    return null;
  }
}

export const nftProvider = new NFTProvider();
