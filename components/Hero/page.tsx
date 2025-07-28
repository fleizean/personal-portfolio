"use client";

import React from 'react';
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

    if (isLoading) {
        return <div className="flex justify-center items-center h-screen">
            <div className="loader"></div>
        </div>;
    }

    const handleResumeClick = () => {
        const resumeFile = language === 'tr' 
            ? '/ENES_YAGIZ_TR.pdf' 
            : '/ENES_YAGIZ_EN.pdf';
        window.location.href = resumeFile;
    };

    return (
        <section className="py-10 sm:py-16 md:py-24 lg:py-32 dark:blue-900 dark:bg-opacity-50 dark:bg-gray-800 min-h-screen">
            <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-20 xl:px-60">
                <div className="flex flex-col md:flex-row items-center justify-between gap-8 md:gap-4">
                    {/* Left Column - Text Content */}
                    <div className="w-full md:w-1/2 flex flex-col items-center md:items-start space-y-4 md:space-y-6 text-center md:text-left">
                        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 dark:text-gray-300 dark:hover:text-white">
                            {t("hero.greeting")}
                        </h1>

                        <h2 className="text-base sm:text-lg md:text-xl lg:text-2xl font-medium text-gray-600 dark:text-gray-300 dark:hover:text-white">
                            {t('hero.role')} <Link href="/contact"><span className="text-blue-600 hover:text-green-300">[{t('hero.roleHighlight')}]</span></Link>
                        </h2>

                        <p className="text-sm sm:text-base text-gray-600 leading-relaxed lowercase dark:text-gray-300 dark:hover:text-white max-w-md md:max-w-none">
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
                                [<button
                                    className="text-gray-700 hover:text-green-600 font-medium transition-colors duration-200 dark:text-gray-300 dark:hover:text-green-600"
                                    onClick={handleResumeClick}
                                >
                                    {t('hero.resumeButton')}
                                </button>]
                            </div>
                            <span className="text-gray-400 mx-2 sm:mx-4 hidden sm:inline">━</span>
                            <div className="flex items-center">
                                [<Link href="/contact"><button
                                    className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200 dark:text-gray-300 dark:hover:text-blue-600"
                                >
                                    {t('hero.contactButton')}
                                </button></Link>]
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Image */}
                    <div className="w-full md:w-1/2 flex justify-center md:justify-end mt-6 md:mt-0">
                        <div className="relative w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64 lg:w-72 lg:h-72 xl:w-80 xl:h-80 overflow-hidden border-4 border-gray-200 shadow-lg dark:border-gray-700">
                            <Image
                                src="/hero.png"
                                alt="{t('hero.imageAlt')}"
                                fill
                                className="object-cover dark:brightness-75 dark:contrast-75 transition-all duration-300"
                                priority
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;