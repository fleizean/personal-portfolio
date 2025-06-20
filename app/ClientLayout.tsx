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
        <>
            <Header />
            <main className="flex-grow">
                {children}
            </main>
            <Footer />
            <ScrollToTop />
        </>
  );
}