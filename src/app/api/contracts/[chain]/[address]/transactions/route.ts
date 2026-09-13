import { NextRequest, NextResponse } from 'next/server';
import { ContractDataProvider } from '@/lib/contracts/contractDataProvider';
import { ContractChain } from '@/lib/contracts/types';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: { chain: string; address: string } }
) {
  try {
    const chain = (params.chain || 'ethereum').toLowerCase() as ContractChain;
    const address = params.address || '';

    if (!address) {
      return NextResponse.json(
        { success: false, error: 'Contract address is required.' },
        { status: 400 }
      );
    }

    const { searchParams } = new URL(request.url);
    const filter = searchParams.get('filter') || 'all';

    const analysis = await ContractDataProvider.analyzeContract(chain, address);
    let transactions = analysis.recentActivity || [];

    if (filter !== 'all') {
      const f = filter.toLowerCase();
      transactions = transactions.filter((tx: any) => {
        const method = (tx.method || '').toLowerCase();
        if (f === 'transfers') return method.includes('transfer');
        if (f === 'mints') return method.includes('mint');
        if (f === 'burns') return method.includes('burn');
        if (f === 'admin') return method.includes('set') || method.includes('upgrade') || method.includes('pause') || method.includes('owner');
        if (f === 'calls') return true;
        return true;
      });
    }

    return NextResponse.json({
      success: true,
      address,
      chain,
      filter,
      total: transactions.length,
      transactions,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch contract transactions' },
      { status: 400 }
    );
  }
}
