'use client';

import { useTranslation } from '@/context/LanguageContext';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import LanguageSwitcher from '@/components/LanguageSwitcher/LanguageSwitcher';
import ThemeToggle from '../ThemeToggle/ThemeToggle';

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const pathname = usePathname();
    const { isLoading, t } = useTranslation("common");

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 10) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    // Close menu when route changes
    useEffect(() => {
        setIsMenuOpen(false);
    }, [pathname]);

    if (isLoading) {
        return <div className="flex justify-center items-center h-screen">
            <div className="loader"></div>
        </div>;
    }

    return (
        <header className={`fixed top-0 left-0 right-0 w-full z-50 transition-all duration-300 backdrop-blur-md ${isScrolled ? 'bg-white/80 dark:bg-gray-900/80 shadow-sm' : 'bg-white/60 dark:bg-gray-900/60'
            }`}>
            <div className="flex flex-row justify-between items-center container mx-auto px-4 sm:px-6 md:px-8 lg:px-20 xl:px-60">
                <nav className="flex items-center justify-between w-full py-4">
                    <div className='flex items-center space-x-4'>
                        <Link href="/" className="text-black hover:text-black font-medium transition-colors dark:text-gray-300 dark:hover:text-white hover:underline">
                            fleizean
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-1">
                        <Link href="/journey" className="text-black hover:text-black no-underline text-sm font-medium transition-colors dark:text-gray-300 dark:hover:text-white hover:underline px-2">
                            {t('header.navigation.journey')}
                        </Link>
                        <span className="text-gray-700 text-xs">•</span>
                        <Link href="/tech-stack" className="text-black hover:text-black no-underline text-sm font-medium transition-colors dark:text-gray-300 dark:hover:text-white hover:underline px-2">
                            {t('header.navigation.tech_stack')}
                        </Link>
                        <span className="text-gray-700 text-xs">•</span>
                        <Link href="/projects" className="text-black hover:text-black no-underline text-sm font-medium transition-colors dark:text-gray-300 dark:hover:text-white hover:underline px-2">
                            {t('header.navigation.projects')}
                        </Link>
                        <span className="text-gray-700 text-xs">•</span>
                        <Link href="/school-life" className="text-black hover:text-black no-underline text-sm font-medium transition-colors dark:text-gray-300 dark:hover:text-white hover:underline px-2">
                            {t('header.navigation.school_life')}
                        </Link>
                        <span className="text-gray-700 text-xs">•</span>
                        <Link href="/blog" className="text-black hover:text-black no-underline text-sm font-medium transition-colors dark:text-gray-300 dark:hover:text-white hover:underline px-2">
                            {t('header.navigation.blogs')}
                        </Link>
                        <span className="text-gray-700 text-xs">•</span>
                        <Link href="/contact" className="text-black hover:text-black no-underline text-sm font-medium transition-colors dark:text-gray-300 dark:hover:text-white hover:underline px-2">
                            {t('header.navigation.contact')}
                        </Link>
                        <div className="flex items-center ml-3 gap-2">
                            <LanguageSwitcher />
                            <ThemeToggle />
                        </div>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden flex items-center gap-2">
                        <LanguageSwitcher />
                        <ThemeToggle />
                        <button
                            onClick={toggleMenu}
                            className="text-black hover:text-black focus:outline-none dark:text-gray-300 dark:hover:text-white ml-2"
                        >
                            {isMenuOpen ? (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            )}
                        </button>
                    </div>
                </nav>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="md:hidden absolute top-full left-0 right-0 bg-white dark:bg-gray-800 shadow-md border-t border-gray-200 dark:border-gray-700">
                    <div className="px-4 py-3 space-y-3">
                        <Link href="/journey" className="block text-black hover:text-black no-underline font-medium transition-colors dark:text-gray-300 dark:hover:text-white ">
                            {t('header.navigation.journey')}
                        </Link>
                        <Link href="/tech-stack" className="block text-black hover:text-black no-underline font-medium transition-colors dark:text-gray-300 dark:hover:text-white ">
                            {t('header.navigation.tech_stack')}
                        </Link>
                        <Link href="/projects" className="block text-black hover:text-black no-underline font-medium transition-colors dark:text-gray-300 dark:hover:text-white ">
                            {t('header.navigation.projects')}
                        </Link>
                        <Link href="/school-life" className="block text-black hover:text-black no-underline font-medium transition-colors dark:text-gray-300 dark:hover:text-white ">
                            {t('header.navigation.school_life')}
                        </Link>
                        <Link href="/blog" className="block text-black hover:text-black no-underline font-medium transition-colors dark:text-gray-300 dark:hover:text-white ">
                            {t('header.navigation.blogs')}
                        </Link>
                        <Link href="/contact" className="block text-black hover:text-black no-underline font-medium transition-colors dark:text-gray-300 dark:hover:text-white ">
                            {t('header.navigation.contact')}
                        </Link>
                        <div className="flex items-center ml-3 gap-2">
                            <LanguageSwitcher />
                            <ThemeToggle />
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
};

export default Header;