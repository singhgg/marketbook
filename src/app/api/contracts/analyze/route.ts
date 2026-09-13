import { NextRequest, NextResponse } from 'next/server';
import { ContractDataProvider } from '@/lib/contracts/contractDataProvider';
import { ContractChain } from '@/lib/contracts/types';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const chain = (searchParams.get('chain') || 'ethereum').toLowerCase() as ContractChain;
    const address = searchParams.get('address') || '';

    if (!address) {
      return NextResponse.json(
        { success: false, error: 'Contract address is required. Provide ?address=0x...' },
        { status: 400 }
      );
    }

    const analysis = await ContractDataProvider.analyzeContract(chain, address);
    return NextResponse.json({ success: true, contract: analysis });
  } catch (error: any) {
    console.error('Error analyzing contract in /api/contracts/analyze:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Contract analysis failed' },
      { status: 400 }
    );
  }
}
