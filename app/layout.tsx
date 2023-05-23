import './globals.css';
import {Inter} from 'next/font/google';
import {
  SubstrateProvider,
} from '@/lib/polkadot';

const inter = Inter({subsets: ['latin']});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {

  return (
      <html lang="en">
      <SubstrateProvider>
        <body className={inter.className}>{children}</body>
      </SubstrateProvider>
      </html>
  );
}
