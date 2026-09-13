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

    const analysis = await ContractDataProvider.analyzeContract(chain, address);
    return NextResponse.json({ success: true, contract: analysis });
  } catch (error: any) {
    console.error(`Error analyzing contract in /api/contracts/${params.chain}/${params.address}:`, error);
    return NextResponse.json(
      { success: false, error: error.message || 'Contract analysis failed' },
      { status: 400 }
    );
  }
}
