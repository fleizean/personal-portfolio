"use client";

import React, { useEffect, useState } from 'react';
import { IoIosArrowUp } from 'react-icons/io';

const ScrollToTop: React.FC = () => {
    const [isVisible, setIsVisible] = useState(false);

    // Check scroll position and show button when scrolled down
    useEffect(() => {
        const toggleVisibility = () => {
            if (window.scrollY > 300) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        window.addEventListener('scroll', toggleVisibility);

        return () => window.removeEventListener('scroll', toggleVisibility);
    }, []);

    // Scroll to top function
    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    return (
        <>
            {isVisible && (
                <button
                    onClick={scrollToTop}
                    className="fixed bottom-8 right-6 p-3 z-50 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 group"
                    style={{ background: 'linear-gradient(135deg, #6b5b95, #fc8dc7)' }}
                    aria-label="Scroll to top"
                >
                    <IoIosArrowUp className="text-white text-2xl group-hover:translate-y-[-2px] transition-transform duration-300" />
                </button>
            )}
        </>
    );
};

export default ScrollToTop;