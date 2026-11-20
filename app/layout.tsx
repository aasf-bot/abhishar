import type { Metadata } from 'next';
import { Playfair_Display, Outfit } from 'next/font/google';
import './globals.css';

const playfair = Playfair_Display({
  subsets: ['latin'],
  style: ['normal', 'italic'],
  variable: '--font-playfair',
  display: 'swap',
});

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Abhishar V16.0 — The Art Odyssey | AASF, ABV-IIITM Gwalior',
  description:
    'Abhishar V16.0: The Art Odyssey. A Timeless Voyage Through Art and Culture — painting, sculpture, textile, mosaic and more. The annual magazine of AASF, ABV-IIITM Gwalior.',
  keywords: [
    'Abhishar',
    'AASF',
    'ABV-IIITM',
    'Gwalior',
    'magazine',
    'art',
    'odyssey',
    'painting',
    'sculpture',
    'textile',
    'mosaic',
  ],
  authors: [{ name: 'AASF, ABV-IIITM Gwalior' }],
  openGraph: {
    title: 'Abhishar V16.0 — The Art Odyssey',
    description:
      'A Timeless Voyage Through Art and Culture. The annual magazine of AASF, ABV-IIITM Gwalior.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${outfit.variable}`}
    >
      <body className="min-h-screen antialiased">
        <div className="grain" aria-hidden="true" />
        {children}
      </body>
    </html>
  );
}
