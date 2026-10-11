import { Inter } from 'next/font/google';
import ClientLayout from './ClientLayout';
import './globals.css';
import { Metadata } from 'next';
import { LanguageProvider } from '@/context/LanguageContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { getLanguage } from '@/lib/getLanguage';

export const metadata: Metadata = {
  title: {
    template: '%s — fleizean',
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
  },
  twitter: {
    card: 'summary_large_image',
    site: '@onlyflei',
    creator: '@onlyflei',
    title: 'fleizean - software, design and my life',
    description:
      'Software engineer and designer passionate about creating elegant solutions. Explore my journey, projects, tech stack, and connect with me for collaboration opportunities.',
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

// İlk boyamadan önce tema sınıfını ekler; yoksa koyu tema kullananlar beyaz bir açılış görür
const themeScript = `(function(){try{var t=localStorage.getItem('theme');if(t!=='light'&&t!=='dark'){t=window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'}document.documentElement.classList.add(t)}catch(e){}})()`;

const personJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Enes Yağız',
  alternateName: 'fleizean',
  url: 'https://fleizean.dev',
  image: 'https://fleizean.dev/hero/hero.png',
  jobTitle: 'Full Stack Developer',
  sameAs: [
    'https://github.com/fleizean',
    'https://www.linkedin.com/in/fleizean/',
    'https://youtube.com/@fleizean',
    'https://medium.com/@fleizean',
  ],
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const language = await getLanguage();

  return (
    <html lang={language} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
      </head>
      <body className={`${inter.className} bg-white antialiased`} suppressHydrationWarning>
        <ThemeProvider>
          <LanguageProvider initialLanguage={language}>
            <ClientLayout>{children}</ClientLayout>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
