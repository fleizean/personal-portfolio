"use client";

import Footer from "../components/Footer/page";
import Header from "../components/Header/page";
import ScrollToTop from "../components/ScrollToTop/page";


export default function ClientLayout({
    children,
}: {
    children: React.ReactNode;
}) {

    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow pt-16 sm:pt-20">
                {children}
            </main>
            <Footer />
            <ScrollToTop />
        </div>
  );
}