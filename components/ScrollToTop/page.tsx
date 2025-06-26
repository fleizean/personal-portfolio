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
                    className="fixed bottom-6 right-6 p-3 z-100 bg-white rounded-full shadow-lg transition-all duration-300 hover:bg-gray-100 border border-gray-200 group"
                >
                    <IoIosArrowUp className="text-indigo-600 text-2xl group-hover:text-indigo-800" />
                </button>
            )}
        </>
    );
};

export default ScrollToTop;