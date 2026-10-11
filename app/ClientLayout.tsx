'use client';

import Footer from '../components/Footer/page';
import Header from '../components/Header/page';
import ScrollToTop from '../components/ScrollToTop/page';
import dynamic from 'next/dynamic';

// WebGL arka planı sunucuda render edilemez; three.js paketi de ilk yükten ayrılır
const BackgroundGradient = dynamic(
  () => import('../components/BackgroundGradient/BackgroundGradient'),
  { ssr: false }
);

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex flex-col min-h-screen">
      {/* Global Background Gradient */}
      <BackgroundGradient />

      <Header />
      <main className="flex-grow pt-16 sm:pt-20 relative z-10">{children}</main>
      <Footer />
      <ScrollToTop />
    </div>
  );
}
