import type { Metadata } from 'next';
import '@/styles/globals.css';
import { Header } from '@/components/Header';
import { TickerTape } from '@/components/TickerTape';
import { Footer } from '@/components/Footer';
import { RealTimeProvider } from '@/components/RealTimeProvider';

export const metadata: Metadata = {
  title: 'MARKETBOOK — Trade. Collect. Own. | Cross-Market Terminal & Research',
  description:
    'Full-stack cross-market financial platform integrating Crypto, Equities, ETFs, Indices, IPOs, NFTs, and On-chain intelligence with real-time streaming updates.',
  keywords: [
    'MarketBook',
    'Crypto',
    'Stocks',
    'ETFs',
    'Indices',
    'MBX-50',
    'IPOs',
    'NFTs',
    'Market Intelligence',
    'Portfolio Analytics',
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <RealTimeProvider>
          <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <TickerTape />
            <Header />
            <main style={{ flex: 1, maxWidth: '1600px', width: '100%', margin: '0 auto', padding: '24px 20px' }}>
              {children}
            </main>
            <Footer />
          </div>
        </RealTimeProvider>
      </body>
    </html>
  );
}
