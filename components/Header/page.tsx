'use client';

import Link from 'next/link';

const Header = () => {
    
    return (
        <header className={`relative w-full z-50 transition-all duration-300 mt-15`}>
            <div className="flex flex-row justify-between items-center container mx-auto px-60">
                <nav className="flex items-center justify-between w-full">
                    <div className='flex items-center space-x-4'>
                        <Link href="/" className="text-gray-700 hover:text-black no-underline font-medium transition-colors">
                            fleizean
                        </Link>
                    </div>
                    <div className="flex items-center">
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
                </nav>
            </div>
        </header>
    );
};

export default Header;