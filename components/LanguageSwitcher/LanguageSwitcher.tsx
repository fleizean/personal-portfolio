import React, { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';

const LanguageSwitcher = () => {
    const { language, setLanguage } = useLanguage();
    const [isOpen, setIsOpen] = useState(false);

    const languages = [
        { code: 'en', flag: '🇺🇸', name: 'EN' },
        { code: 'tr', flag: '🇹🇷', name: 'TR' }
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
                className="flex items-center gap-1.5 px-2.5 py-1.5 bg-gray-200/70 dark:bg-gray-700/70 backdrop-blur-sm border border-gray-300/50 dark:border-gray-600/50 rounded-full hover:bg-gray-300/70 dark:hover:bg-gray-600/70 transition-all duration-200 text-xs font-medium text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
                <span className="text-sm">{currentLang?.flag}</span>
                <span className="uppercase">{currentLang?.name}</span>
            </button>

            {isOpen && (
                <div className="absolute top-full right-0 mt-2 bg-white/90 dark:bg-gray-800/90 backdrop-blur-md border border-gray-200/50 dark:border-gray-600/50 rounded-lg shadow-lg overflow-hidden min-w-[80px] z-50">
                    {languages.map((lang) => (
                        <button
                            key={lang.code}
                            onClick={() => handleLanguageChange(lang.code as 'en' | 'tr')}
                            className={`w-full flex items-center gap-2 px-3 py-2 text-xs font-medium transition-colors duration-200 ${language === lang.code
                                    ? 'bg-gray-100 text-black dark:bg-gray-700 dark:text-white'
                                    : 'text-gray-700 hover:bg-gray-50 hover:text-black dark:text-gray-300 dark:hover:bg-gray-700'
                                }`}
                        >
                            <span className="text-sm">{lang.flag}</span>
                            <span className="uppercase">{lang.name}</span>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default LanguageSwitcher;