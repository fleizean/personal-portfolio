"use client";

import { useTranslation } from '@/context/LanguageContext';
import React from 'react';

const NotFound = () => {
    const { isLoading, t } = useTranslation("common");

    if (isLoading) {
        return <div className="flex justify-center items-center h-screen">
            <div className="loader"></div>
        </div>;
    }
    
    return (
        <div className="relative w-full z-50 transition-all duration-300 py-20 md:py-28 lg:py-36 dark:blue-900 dark:bg-opacity-50 dark:bg-gray-800 min-h-screen">
           <div className="container items-center container mx-auto justify-center px-8 lg:px-60 py-10">
            <h1 className="text-5xl mb-5">{t('not_found.title') || "Page Not Found"}</h1>
                <p className="text-gray-500 mt-2">
                    {t('not_found.description_main') || "The page you are looking for does not exist."}
                </p>
                <p className="text-gray-400 text-sm mt-1">
                    {t('not_found.description_secondary') || "Please check the URL or return to the homepage."}
                </p>
            </div>
        </div>
    );
};

export default NotFound;
