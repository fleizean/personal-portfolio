import { Inter } from 'next/font/google';
import ClientLayout from './ClientLayout';
import './globals.css';
import { Metadata } from 'next';
import { LanguageProvider } from '@/context/LanguageContext';
import { ThemeProvider } from '@/context/ThemeContext';

export const metadata: Metadata = {
  title: {
    template: '%s - fleizean',
    default: 'fleizean - software, design and my life',
  },
  description:
    'Software engineer and designer passionate about creating elegant solutions. Explore my journey, projects, tech stack, and connect with me for collaboration opportunities.',
  authors: [{ name: 'Enes Yağız', url: 'https://fleizean.dev' }],
  publisher: 'Enes Yağız',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  metadataBase: new URL('https://fleizean.dev'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'tr_TR',
    url: 'https://fleizean.dev',
    siteName: 'fleizean',
    title: 'fleizean - software, design and my life',
    description:
      'Software engineer and designer passionate about creating elegant solutions. Explore my journey, projects, tech stack, and connect with me for collaboration opportunities.',
    images: [
      {
        url: '/hero/hero.png',
        width: 1200,
        height: 630,
        alt: 'fleizean - software, design and my life',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@onlyflei',
    creator: '@onlyflei',
    title: 'fleizean - software, design and my life',
    description:
      'Software engineer and designer passionate about creating elegant solutions. Explore my journey, projects, tech stack, and connect with me for collaboration opportunities.',
    images: ['/hero/hero.png'],
  },
  icons: {
    icon: [
      { url: 'favicons/favicon-96x96.png', sizes: '96x96', type: 'image/png' },
      { url: 'favicons/favicon.svg', type: 'image/svg+xml' },
      { url: 'favicons/favicon.ico', rel: 'shortcut icon' },
    ],
    apple: [{ url: 'favicons/apple-touch-icon.png', sizes: '180x180' }],
    other: [
      {
        rel: 'manifest',
        url: 'favicons/site.webmanifest',
      },
    ],
  },
  appleWebApp: {
    title: 'fleizean',
  },
};

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <body className={`${inter.className} bg-white antialiased`} suppressHydrationWarning>
        <ThemeProvider>
          <LanguageProvider>
            <ClientLayout>{children}</ClientLayout>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
