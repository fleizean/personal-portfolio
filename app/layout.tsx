import { Inter } from "next/font/google";
import ClientLayout from "./ClientLayout";
import "./globals.css";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    template: '%s - fleizean',
    default: 'fleizean - software, design and my life',
  },
  description: "fleizean — software, design and my life",
  icons: {
    icon: [
      { url: 'favicons/favicon-96x96.png', sizes: '96x96', type: 'image/png' },
      { url: 'favicons/favicon.svg', type: 'image/svg+xml' },
      { url: 'favicons/favicon.ico', rel: 'shortcut icon' },
    ],
    apple: [
      { url: 'favicons/apple-touch-icon.png', sizes: '180x180' },
    ],
    other: [
      {
        rel: 'manifest',
        url: 'favicons/site.webmanifest',
      },
    ]
  },
  appleWebApp: {
    title: 'fleizean',
  }
};

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <body className={`${inter.className} bg-white antialiased`} suppressHydrationWarning>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}