'use client';

import React from 'react';
import Link from 'next/link';
import { useTranslation } from '@/context/LanguageContext';

const Footer: React.FC = () => {
    const { isLoading, t } = useTranslation("common");

    if (isLoading) {
        return <div className="flex justify-center items-center h-screen">
            <div className="loader"></div>
        </div>;
    }
    const currentYear = new Date().getFullYear();
    const copyrightText = t('footer.copyright').replace('{{year}}', currentYear.toString());

    return (
        <footer className="relative w-full z-40 mt-auto">
            <div className="flex flex-col justify-between items-center container mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-24">
                <hr className="border-t border-gray-200 shadow-sm w-full dark:border-gray-700" />
                <div className="flex flex-col sm:flex-row justify-between items-center py-4 w-full">
                    <div className="flex flex-col items-center sm:items-start mb-4 sm:mb-0">
                        <span className="text-gray-500 dark:text-gray-400 text-xs mb-1">{t("footer.location_label")}</span>
                        <Link
                            href="https://www.google.com/maps/place/Kocaeli,+Turkey/@40.7667,29.9167,12z/data=!3m1!4b1"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-700 hover:text-black no-underline text-sm font-medium transition-colors dark:text-gray-300 dark:hover:text-white"
                        >
                            <span className="mr-1">🇹🇷</span> {t("footer.location_name")}
                        </Link>
                    </div>
            
                    <div className="flex flex-col items-center sm:items-end mb-2 sm:mb-0">
                        <span className="text-gray-500 dark:text-gray-400 text-xs mb-1">{copyrightText}</span>
                        <a href="mailto:nsyagz@gmail.com" className="text-gray-700 dark:text-gray-400 hover:text-black dark:hover:text-white no-underline text-sm font-medium transition-colors">@fleizean</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;