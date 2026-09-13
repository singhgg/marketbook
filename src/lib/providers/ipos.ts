import { db } from '../db';

export class IPOProvider {
  async getIPOs(statusFilter?: string) {
    const where = statusFilter && statusFilter !== 'ALL' ? { status: statusFilter } : {};
    return await db.iPO.findMany({
      where,
      orderBy: { expectedDate: 'desc' },
    });
  }
}

export const ipoProvider = new IPOProvider();
