'use client';

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';

export default function DynamicContractIntelligencePage() {
  const params = useParams();
  const router = useRouter();

  const chain = params?.chain as string;
  const address = params?.address as string;

  useEffect(() => {
    if (chain && address) {
      router.replace(`/contract-intelligence?chain=${encodeURIComponent(chain)}&address=${encodeURIComponent(address)}`);
    } else {
      router.replace('/contract-intelligence');
    }
  }, [chain, address, router]);

  return (
    <div style={{ padding: '60px 20px', textAlign: 'center', color: 'var(--ink-secondary)' }}>
      Loading Contract Intelligence Terminal...
    </div>
  );
}
