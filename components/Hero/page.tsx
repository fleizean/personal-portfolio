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
        <section className="py-10 md:py-16 lg:py-24">
            <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-20 xl:px-60">
                <div className="flex flex-col md:flex-row items-center justify-between gap-8 md:gap-4">
                    {/* Left Column - Text Content */}
                    <div className="w-full md:w-1/2 flex flex-col items-start space-y-4 md:space-y-6">
                        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-800">
                            {t("hero.greeting")}
                        </h1>

                        <h2 className="text-lg sm:text-xl md:text-2xl font-medium text-gray-600">
                            {t('hero.role')} <span className="text-blue-600">[{t('hero.roleHighlight')}]</span>
                        </h2>


                        <p className="text-sm sm:text-base text-gray-600 leading-relaxed lowercase">
                            {t('hero.description')}
                        </p>

                        {/* Social Links */}
                        <div className="flex space-x-5 pt-2 md:pt-4">
                            <Link href="https://github.com/fleizean" target="_blank" rel="noopener noreferrer"
                                className="text-gray-700 hover:text-black transition-colors">
                                <FaGithub className="text-xl md:text-2xl" />
                            </Link>
                            <Link href="https://linkedin.com/in/fleizean" target="_blank" rel="noopener noreferrer"
                                className="text-gray-700 hover:text-blue-700 transition-colors">
                                <FaLinkedin className="text-xl md:text-2xl" />
                            </Link>
                            <Link href="https://youtube.com/@fleizean" target="_blank" rel="noopener noreferrer"
                                className="text-gray-700 hover:text-red-600 transition-colors">
                                <FaYoutube className="text-xl md:text-2xl" />
                            </Link>
                            <Link href="https://profile.intra.42.fr/users/eyagiz" target="_blank" rel="noopener noreferrer"
                                className="text-gray-700 hover:text-purple-600 transition-colors">
                                <Si42 className="text-xl md:text-2xl" />
                            </Link>
                        </div>

                        <div className="flex items-center mt-6">
                            [<button
                                className="text-gray-700 hover:text-green-600 font-medium transition-colors duration-200"
                                onClick={handleResumeClick}
                            >
                                {t('hero.resumeButton')}
                            </button>]
                            <span className="text-gray-400 ml-4 mr-4">━</span>
                            [<button
                                className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200"
                                onClick={() => window.location.href = '/contact'}
                            >
                                {t('hero.contactButton')}
                            </button>]
                        </div>
                    </div>

                    {/* Right Column - Image */}
                    <div className="w-full md:w-1/2 flex justify-center md:justify-end mt-8 md:mt-0">
                        <div className="relative w-56 h-56 sm:w-64 sm:h-64 md:w-72 md:h-72 lg:w-80 lg:h-80 overflow-hidden border-4 border-gray-200 shadow-lg">
                            <Image
                                src="/hero.png"
                                alt="{t('hero.imageAlt')}"
                                fill
                                className="object-cover"
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