import { db } from '../db';
import { DEFAULT_IPOS } from '../data/defaultUniverse';

export class IPOProvider {
  async getIPOs(statusFilter?: string) {
    try {
      const where = statusFilter && statusFilter !== 'ALL' ? { status: statusFilter } : {};
      const ipos = await db.iPO.findMany({
        where,
        orderBy: { expectedDate: 'desc' },
      });
      if (ipos && ipos.length > 0) return ipos;
    } catch {
      // Fall through to DEFAULT_IPOS
    }

    if (statusFilter && statusFilter !== 'ALL') {
      return DEFAULT_IPOS.filter((i) => i.status === statusFilter);
    }
    return DEFAULT_IPOS;
  }
}

export const ipoProvider = new IPOProvider();
