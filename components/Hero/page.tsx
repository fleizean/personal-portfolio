"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaGithub, FaLinkedin } from 'react-icons/fa';
import { FaYoutube } from 'react-icons/fa6';
import { Si42 } from 'react-icons/si';
import { useTranslation } from '@/context/LanguageContext';
import { useLanguage } from '@/context/LanguageContext';

const Hero = () => {
    const { isLoading, t } = useTranslation("common");
    const { language } = useLanguage();
    const [heroImage, setHeroImage] = useState('/hero/hero.png');

    // Glitch effect state
    const [isGlitching, setIsGlitching] = useState(false);

    useEffect(() => {
        // Check if music was completed on mount
        const musicCompleted = localStorage.getItem('musicCompleted') === 'true';
        if (musicCompleted) {
            setHeroImage('/hero/hero-2.png');
        }

        // Listen for music completion event
        const handleMusicCompleted = () => {
            setIsGlitching(true);

            // Change image in the middle of glitch
            setTimeout(() => {
                setHeroImage('/hero/hero-2.png');
            }, 250);

            // End glitch after animation
            setTimeout(() => {
                setIsGlitching(false);
            }, 1000);
        };

        window.addEventListener('musicCompleted', handleMusicCompleted);

        return () => {
            window.removeEventListener('musicCompleted', handleMusicCompleted);
        };
    }, []);

    if (isLoading) {
        return <div className="flex justify-center items-center h-screen">
            <div className="loader"></div>
        </div>;
    }

    return (
        <section className="py-10 sm:py-16 md:py-24 lg:py-32 min-h-screen">
            <style jsx>{`
                @keyframes glitch-anim-1 {
                    0% { clip-path: inset(20% 0 80% 0); transform: translate(-2px, 1px); }
                    20% { clip-path: inset(60% 0 10% 0); transform: translate(2px, -1px); }
                    40% { clip-path: inset(40% 0 50% 0); transform: translate(-2px, 2px); }
                    60% { clip-path: inset(80% 0 5% 0); transform: translate(2px, -2px); }
                    80% { clip-path: inset(10% 0 70% 0); transform: translate(-1px, 1px); }
                    100% { clip-path: inset(30% 0 50% 0); transform: translate(1px, -1px); }
                }
                @keyframes glitch-anim-2 {
                    0% { clip-path: inset(10% 0 60% 0); transform: translate(2px, -1px); }
                    20% { clip-path: inset(80% 0 5% 0); transform: translate(-2px, 1px); }
                    40% { clip-path: inset(30% 0 20% 0); transform: translate(2px, 2px); }
                    60% { clip-path: inset(15% 0 80% 0); transform: translate(-2px, -2px); }
                    80% { clip-path: inset(55% 0 10% 0); transform: translate(1px, 1px); }
                    100% { clip-path: inset(40% 0 30% 0); transform: translate(-1px, -1px); }
                }
                .glitch-container {
                    position: relative;
                }
                .glitch-container::before,
                .glitch-container::after {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: inherit;
                    opacity: 0.8;
                }
                .glitch-active {
                    animation: glitch-anim-1 0.3s infinite linear alternate-reverse;
                }
                .glitch-active::before {
                    animation: glitch-anim-2 0.4s infinite linear alternate-reverse;
                    left: 2px;
                    background: rgba(255, 0, 0, 0.2);
                    mix-blend-mode: multiply;
                }
                .glitch-active::after {
                    animation: glitch-anim-1 0.5s infinite linear alternate-reverse;
                    left: -2px;
                    background: rgba(0, 0, 255, 0.2);
                    mix-blend-mode: multiply;
                }
            `}</style>

            <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-20 xl:px-60">
                <div className="flex flex-col md:flex-row items-center justify-between gap-8 md:gap-4">
                    {/* Left Column - Text Content */}
                    <div className="w-full md:w-1/2 flex flex-col items-center md:items-start space-y-4 md:space-y-6 text-center md:text-left">
                        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-gray-300 dark:hover:text-white">
                            {t("hero.greeting")}
                        </h1>

                        <h2 className="text-base sm:text-lg md:text-xl lg:text-2xl font-medium text-gray-700 dark:text-gray-300 dark:hover:text-white">
                            {t('hero.role')} <Link href="/contact"><span className="text-blue-600 hover:text-green-300">[{t('hero.roleHighlight')}]</span></Link>
                        </h2>

                        <p className="text-sm sm:text-base text-gray-700 leading-relaxed lowercase dark:text-gray-300 dark:hover:text-white max-w-md md:max-w-none">
                            {t('hero.description')}
                        </p>

                        {/* Social Links */}
                        <div className="flex justify-center md:justify-start space-x-4 sm:space-x-5 pt-2 md:pt-4">
                            <Link href="https://github.com/fleizean" target="_blank" rel="noopener noreferrer"
                                className="text-gray-700 hover:text-green-500 transition-colors dark:text-gray-300 dark:hover:text-green-500">
                                <FaGithub className="text-lg sm:text-xl md:text-2xl" />
                            </Link>
                            <Link href="https://linkedin.com/in/fleizean" target="_blank" rel="noopener noreferrer"
                                className="text-gray-700 hover:text-blue-700 transition-colors dark:text-gray-300 dark:hover:text-blue-700">
                                <FaLinkedin className="text-lg sm:text-xl md:text-2xl" />
                            </Link>
                            <Link href="https://youtube.com/@fleizean" target="_blank" rel="noopener noreferrer"
                                className="text-gray-700 hover:text-red-600 transition-colors dark:text-gray-300 dark:hover:text-red-600">
                                <FaYoutube className="text-lg sm:text-xl md:text-2xl" />
                            </Link>
                            <Link href="https://profile.intra.42.fr/users/eyagiz" target="_blank" rel="noopener noreferrer"
                                className="text-gray-700 hover:text-yellow-600 transition-colors dark:text-gray-300 dark:hover:text-yellow-600">
                                <Si42 className="text-lg sm:text-xl md:text-2xl" />
                            </Link>
                        </div>

                        <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-2 sm:gap-0 mt-6">
                            <div className="flex items-center">
                                [<Link href="/cv">
                                    <span className="text-gray-700 hover:text-green-600 font-medium transition-colors duration-200 dark:text-gray-300 dark:hover:text-green-600 cursor-pointer">
                                        {t('hero.resumeButton')}
                                    </span>
                                </Link>]
                            </div>
                            <span className="text-gray-700 dark:text-gray-300 mx-2 sm:mx-4 hidden sm:inline">━</span>
                            <div className="flex items-center">
                                [<Link href="/contact"><button
                                    className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200 dark:text-gray-300 dark:hover:text-blue-600 cursor-pointer"
                                >
                                    {t('hero.contactButton')}
                                </button></Link>]
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Image */}
                    <div className="w-full md:w-1/2 flex justify-center md:justify-end mt-6 md:mt-0">
                        <div className={`relative w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64 lg:w-72 lg:h-72 xl:w-80 xl:h-80 overflow-hidden border-4 shadow-lg group glitch-container ${isGlitching ? 'glitch-active' : ''}`}>
                            <Image
                                src={heroImage}
                                alt="{t('hero.imageAlt')}"
                                fill
                                className="object-cover dark:brightness-75 dark:contrast-75 transition-all duration-300"
                                priority
                            />
                            {heroImage === '/hero/hero-2.png' && !isGlitching && (
                               <div className="absolute inset-0 flex items-center justify-center bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-help">
                                    <span className="text-white text-xs sm:text-sm font-mono text-center px-4 font-bold tracking-wider">
                                        Mr. Robot<br />
                                        shutdown - r<br />
                                        S3 E10 • 44:28
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;