'use client';

import Footer from '../components/Footer/page';
import Header from '../components/Header/page';
import ScrollToTop from '../components/ScrollToTop/page';
import BackgroundGradient from '../components/BackgroundGradient/BackgroundGradient';

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
