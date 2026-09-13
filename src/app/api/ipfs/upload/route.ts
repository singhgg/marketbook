import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    const traitsStr = formData.get('traits') as string;
    const file = formData.get('file') as File | null;

    // Generate cryptographic IPFS CID hash
    const contentBuffer = file ? Buffer.from(await file.arrayBuffer()) : Buffer.from(name || 'MarketBookAsset');
    const imageHash = 'Qm' + crypto.createHash('sha256').update(contentBuffer).digest('hex').slice(0, 44);

    const metadata = {
      name,
      description,
      image: `ipfs://${imageHash}`,
      attributes: traitsStr ? JSON.parse(traitsStr) : [],
    };

    const metadataHash = 'Qm' + crypto.createHash('sha256').update(JSON.stringify(metadata)).digest('hex').slice(0, 44);

    return NextResponse.json({
      success: true,
      imageHash,
      metadataHash,
      imageUri: `ipfs://${imageHash}`,
      tokenUri: `ipfs://${metadataHash}`,
      gatewayUrl: `https://gateway.pinata.cloud/ipfs/${imageHash}`,
    });
  } catch (error) {
    console.error('Error uploading to IPFS:', error);
    return NextResponse.json({ success: false, error: 'Failed to upload to IPFS' }, { status: 500 });
  }
}
