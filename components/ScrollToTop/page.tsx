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
                    className="fixed bottom-25 right-6 p-3 z-200 bg-gray-800 rounded-full shadow-lg hover:bg-gray-700 transition-all duration-300 border border-gray-700 group"
                    aria-label="Scroll to top"
                >
                    <IoIosArrowUp className="text-indigo-400 text-2xl group-hover:text-indigo-300 transition-colors" />
                </button>
            )}
        </>
    );
};

export default ScrollToTop;