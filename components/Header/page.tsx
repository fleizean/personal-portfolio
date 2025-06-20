'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const pathname = usePathname();
    
    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };
    
    // Close menu when route changes
    useEffect(() => {
        setIsMenuOpen(false);
    }, [pathname]);
    
    return (
        <header className={`relative w-full z-50 transition-all duration-300 mt-15`}>
            <div className="flex flex-row justify-between items-center container mx-auto px-4 sm:px-6 md:px-20 lg:px-60">
                <nav className="flex items-center justify-between w-full py-4">
                    <div className='flex items-center space-x-4'>
                        <Link href="/" className="text-gray-700 hover:text-black no-underline font-medium transition-colors">
                            fleizean
                        </Link>
                    </div>
                    
                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center">
                        <div className="flex items-center">
                            <Link href="/journey" className="text-gray-700 hover:text-black no-underline font-medium transition-colors">
                                journey
                            </Link>
                            <span className="mx-2 text-gray-400">━</span>
                        </div>
                        <div className="flex items-center">
                            <Link href="/tech-stack" className="text-gray-700 hover:text-black no-underline font-medium transition-colors">
                                tech stack
                            </Link>
                            <span className="mx-2 text-gray-400">━</span>
                        </div>
                        <div className="flex items-center">
                            <Link href="/projects" className="text-gray-700 hover:text-black no-underline font-medium transition-colors">
                                projects
                            </Link>
                            <span className="mx-2 text-gray-400">━</span>
                        </div>
                        <div className="flex items-center">
                            <Link href="/school-life" className="text-gray-700 hover:text-black no-underline font-medium transition-colors">
                                school life
                            </Link>
                        </div>
                    </div>
                    
                    {/* Mobile Menu Button */}
                    <div className="md:hidden">
                        <button 
                            onClick={toggleMenu}
                            className="text-gray-700 hover:text-black focus:outline-none"
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
                <div className="md:hidden bg-white shadow-md">
                    <div className="px-4 py-3 space-y-3">
                        <Link href="/journey" className="block text-gray-700 hover:text-black no-underline font-medium transition-colors">
                            journey
                        </Link>
                        <Link href="/tech-stack" className="block text-gray-700 hover:text-black no-underline font-medium transition-colors">
                            tech stack
                        </Link>
                        <Link href="/projects" className="block text-gray-700 hover:text-black no-underline font-medium transition-colors">
                            projects
                        </Link>
                        <Link href="/school-life" className="block text-gray-700 hover:text-black no-underline font-medium transition-colors">
                            school life
                        </Link>
                    </div>
                </div>
            )}
        </header>
    );
};

export default Header;