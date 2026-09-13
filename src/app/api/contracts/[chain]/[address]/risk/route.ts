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
      isVerified: analysis.overview.verificationStatus === 'VERIFIED',
      riskSignals: analysis.riskSignals,
      disclaimer:
        'MarketBook Contract Intelligence provides automated technical analysis based on publicly available blockchain data. It is not a professional smart-contract security audit and cannot guarantee contract safety.',
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch contract risk signals' },
      { status: 400 }
    );
  }
}
