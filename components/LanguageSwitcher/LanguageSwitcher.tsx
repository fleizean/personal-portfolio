import React, { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';

const LanguageSwitcher = () => {
    const { language, setLanguage } = useLanguage();
    const [isOpen, setIsOpen] = useState(false);

    const languages = [
        { code: 'en', flag: '🇺🇸', name: 'English' },
        { code: 'tr', flag: '🇹🇷', name: 'Türkçe' }
    ];

    const currentLang = languages.find(lang => lang.code === language);

    const handleLanguageChange = (langCode: 'en' | 'tr') => {
        setLanguage(langCode);
        setIsOpen(false);
    };

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 text-sm font-medium text-gray-700 hover:text-black dark:text-gray-300 dark:hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
            >
                <span className="text-base">{currentLang?.flag}</span>
                <span className="hidden sm:inline">{currentLang?.name}</span>
                <span className="sm:hidden">{language.toUpperCase()}</span>
            </button>

            {isOpen && (
                <div className="absolute top-full right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden min-w-[120px] dark:bg-gray-800 dark:border-gray-600 z-50">
                    {languages.map((lang) => (
                        <button
                            key={lang.code}
                            onClick={() => handleLanguageChange(lang.code as 'en' | 'tr')}
                            className={`w-full flex items-center gap-2 px-3 py-2 text-sm font-medium transition-colors duration-200 ${
                                language === lang.code 
                                    ? 'bg-gray-50 text-black dark:bg-gray-700 dark:text-white'
                                    : 'text-gray-700 hover:bg-gray-50 hover:text-black dark:text-gray-300 dark:hover:bg-gray-700'
                            }`}
                        >
                            <span className="text-base">{lang.flag}</span>
                            <span className="hidden sm:inline">{lang.name}</span>
                            <span className="sm:hidden">{lang.code.toUpperCase()}</span>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default LanguageSwitcher;