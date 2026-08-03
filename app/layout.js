import { Playfair_Display, Inter } from 'next/font/google';
import { Providers } from './providers';
import './globals.css';

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
  weight: ['400', '500', '600', '700', '800', '900'],
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
  weight: ['300', '400', '500', '600', '700'],
});

export const metadata = {
  title: 'Inclex — Premium Leather Keychains | Crafted to Last',
  description:
    'Inclex crafts premium leather keychains with laser-engraved personalization. Genuine leather, stainless steel, lifetime finish. Made in India.',
  keywords: ['premium keychain', 'leather keychain', 'personalized keychain', 'luxury accessories', 'Inclex'],
  openGraph: {
    title: 'Inclex — Carry More Than Keys',
    description: 'Crafted to last. Designed to be remembered.',
    type: 'website',
    siteName: 'Inclex',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Inclex — Premium Leather Keychains',
    description: 'Crafted to last. Designed to be remembered.',
  },
  robots: { index: true, follow: true },
};

export const viewport = {
  themeColor: '#F8F7F4',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable}`} suppressHydrationWarning>
      <body className="font-sans antialiased bg-background text-foreground selection:bg-[#C9A227]/25 selection:text-[#111111]">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
