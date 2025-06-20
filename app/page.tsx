import { Metadata } from "next";
import Hero from "@/components/Hero/page";

export const metadata: Metadata = {
  title: "fleizean — software, design and my life",
  description: "fleizean — software, design and my life",
  icons: {
    icon: [
      { url: 'favicons/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: 'favicons/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
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


export default function Home() {
  return (
    <>      
      <Hero />
    </>
  );
}