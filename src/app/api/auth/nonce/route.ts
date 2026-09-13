import { NextResponse } from 'next/server';
import crypto from 'crypto';

export const dynamic = 'force-dynamic';

export async function GET() {
  const nonce = crypto.randomBytes(16).toString('hex');
  return NextResponse.json({ success: true, nonce });
}
