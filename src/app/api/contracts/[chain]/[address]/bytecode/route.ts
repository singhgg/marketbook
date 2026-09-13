import { NextRequest, NextResponse } from 'next/server';
import { ContractDataProvider } from '@/lib/contracts/contractDataProvider';
import { ContractChain } from '@/lib/contracts/types';

export const dynamic = 'force-dynamic';

export async function GET(
  _request: NextRequest,
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

    const analysis = await ContractDataProvider.analyzeContract(chain, address);
    return NextResponse.json({
      success: true,
      address,
      chain,
      bytecode: analysis.bytecode,
      decompiled: analysis.decompiled,
      behavior: analysis.behavior,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch bytecode' },
      { status: 400 }
    );
  }
}
