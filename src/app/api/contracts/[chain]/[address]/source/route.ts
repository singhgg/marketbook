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
    const isVerified = analysis.overview.verificationStatus === 'VERIFIED';
    return NextResponse.json({
      success: true,
      address,
      chain,
      isVerified,
      sourceMatch: isVerified
        ? 'Verified source corresponds to deployed contract bytecode.'
        : 'Source code not verified on public explorer. Deployed bytecode used.',
      verifiedSource: analysis.verifiedSource,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch verified source' },
      { status: 400 }
    );
  }
}
