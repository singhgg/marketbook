import { db } from '../db';

export class NFTProvider {
  async getCollections() {
    return await db.collection.findMany({
      include: {
        _count: {
          select: { nfts: true },
        },
      },
      orderBy: { volume24h: 'desc' },
    });
  }

  async getCollectionBySlug(slug: string) {
    return await db.collection.findUnique({
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
  }

  async getNFTs(filters?: { collectionSlug?: string; minPrice?: number; maxPrice?: number }) {
    const where: any = {};
    if (filters?.collectionSlug) {
      where.collection = { slug: filters.collectionSlug };
    }

    return await db.nFT.findMany({
      where,
      include: {
        collection: true,
        listings: { where: { status: 'ACTIVE' } },
        offers: { where: { status: 'PENDING' } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getNFT(contract: string, tokenId: string) {
    return await db.nFT.findUnique({
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
  }
}

export const nftProvider = new NFTProvider();
