import type { Metadata } from 'next';
import './globals.css';
import ClientProviders from './client-providers';
import Header from '@/components/layout/Header';
import MobileNav from '@/components/layout/MobileNav';
import Footer from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: 'LigaHub — Youth Football Tournament Platform',
  description:
    'The premier youth football tournament management platform. Follow live scores, fixtures, team profiles, and media highlights for the LigaHub Youth Cup.',
  keywords: [
    'LigaHub',
    'youth football',
    'tournament',
    'bola sepak',
    'liga belia',
    'fixtures',
    'live scores',
    'U15',
    'U17',
  ],
  openGraph: {
    title: 'LigaHub — Youth Football Tournament Platform',
    description:
      'Follow live scores, fixtures, team profiles, and media highlights for the LigaHub Youth Cup.',
    type: 'website',
    locale: 'en_MY',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ClientProviders>
          <Header />
          <main className="page-content">{children}</main>
          <Footer />
          <MobileNav />
        </ClientProviders>
      </body>
    </html>
  );
}
