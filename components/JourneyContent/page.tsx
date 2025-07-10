"use client";

import Link from 'next/link';
import React from 'react';
import Image from 'next/image';
import { JourneyItem } from '@/types/journeyitem';
import { useTranslation } from '@/context/LanguageContext';

const JourneyContent: React.FC = () => {
    const { isLoading, t } = useTranslation("common");


    if (isLoading) {
        return <div className="flex justify-center items-center h-screen">
            <div className="loader"></div>
        </div>;
    }

    const getPresentItems = (): JourneyItem[] => {
        if (isLoading) return [];

        const result = t('journey.items.present', { returnObjects: true });

        // Eğer result bir array ise, onu JourneyItem[] olarak cast et
        if (Array.isArray(result)) {
            return result as unknown as JourneyItem[];
        }

        // Değilse boş array döndür
        return [];
    };

    const getPastItems = (): JourneyItem[] => {
        if (isLoading) return [];

        const result = t('journey.items.past', { returnObjects: true });

        if (Array.isArray(result)) {
            return result as unknown as JourneyItem[];
        }

        return [];
    };

    const presentItems = getPresentItems();
    const pastItems = getPastItems();


    const getDefaultEmoji = (type: JourneyItem['type']) => {
        switch (type) {
            case 'work': return '💼';
            case 'education': return '🎓';
            case 'project': return '⚙️';
            case 'personal': return '🌍';
            case 'other': return '✨';
            default: return '✨';
        }
    };

    return (
        <section className="relative w-full z-50 transition-all duration-300 py-20 md:py-28 lg:py-36 dark:blue-900 dark:bg-opacity-50 dark:bg-gray-800">
            <div className="container mx-auto px-4 sm:px-6 md:px-10 lg:px-20 xl:px-60 py-6 sm:py-10">
                <h2 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-10 text-gray-700 dark:text-gray-300 dark:hover:text-white">{t('journey.section_title')}</h2>

                {/* Present Section */}
                <div className="mb-8">
                    <h3 className="font-bold mb-4 text-gray-800 dark:text-gray-300 dark:hover:text-white">{t('journey.present_section_title')}</h3>
                    <ul className="space-y-4">
                        {presentItems.map((item, index) => (
                            <li key={index} className="pb-3">
                                <div className="flex flex-col sm:flex-row items-start justify-between">
                                    {/* Left content */}
                                    <div className="flex items-baseline gap-2 w-full sm:w-auto">
                                        <span className="text-lg">{item.emoji || getDefaultEmoji(item.type)}</span>
                                        <div className="w-full">
                                            <div className="flex flex-wrap items-center gap-1">
                                                <span className="font-xs text-gray-700 dark:text-gray-300 dark:hover:text-white">{item.title} at </span>
                                                <span className="font-medium text-black dark:text-gray-300 dark:hover:text-white">
                                                    <Link href={`${item.link}`} target="_blank" rel="noopener noreferrer" className="text-black hover:text-gray-500 dark:text-gray-300 dark:hover:text-white">{item.place}</Link>
                                                    <span className="text-gray-800 dark:text-gray-300 dark:hover:text-white"> • {item.year}</span>
                                                </span>
                                            </div>
                                            <p className="text-sm text-gray-500 mt-1 dark:text-gray-300 dark:hover:text-white">{item.description}</p>
                                        </div>
                                    </div>

                                    {/* Photo area */}
                                    {item.photo && (
                                        <div className="flex items-center mt-3 sm:mt-0">
                                            <div className="hidden md:block h-14 border-l border-gray-200 dark:border-gray-700 mx-4"></div>
                                            <Link
                                                href={item.link || '#'}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                title={item.title}
                                                className='flex-shrink-0'
                                            >
                                                <div className="w-16 h-16 overflow-hidden rounded flex-shrink-0 bg-white dark:bg-gray-100">
                                                    <Image
                                                        src={item.photo}
                                                        alt={item.title}
                                                        width={50}
                                                        height={50}
                                                        className="object-contain w-full h-full dark:brightness-90 transition-all duration-300"
                                                    />
                                                </div>
                                            </Link>
                                        </div>
                                    )}
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Past Section */}
                <div>
                    <h3 className="font-bold mb-4 text-gray-800 dark:text-gray-300 dark:hover:text-white">{t('journey.past_section_title')}</h3>
                    <ul className="space-y-4">
                        {pastItems.map((item, index) => (
                            <li key={index} className="pb-3">
                                <div className="flex flex-col sm:flex-row items-start justify-between">
                                    <div className="flex items-baseline gap-2 w-full sm:w-auto">
                                        <span className="text-lg">{item.emoji || getDefaultEmoji(item.type)}</span>
                                        <div className="w-full">
                                            <div className="flex flex-wrap items-center gap-1">
                                                <span className="font-xs text-gray-700 dark:text-gray-300 dark:hover:text-white">{item.title} at</span>
                                                <span className="font-medium text-black dark:text-gray-300 dark:hover:text-white">
                                                    <Link href={`${item.link}`} target="_blank" rel="noopener noreferrer" className="text-black hover:text-gray-500 dark:text-gray-300 dark:hover:text-white">{item.place}</Link>
                                                    <span className="text-gray-800 dark:text-gray-300 dark:hover:text-white"> • {item.year}</span>
                                                </span>
                                            </div>
                                            <p className="text-sm text-gray-500 mt-1 dark:text-gray-300 dark:hover:text-white">{item.description}</p>
                                        </div>
                                    </div>
                                    {item.photo && (
                                        <div className="flex items-center mt-3 sm:mt-0">
                                            <div className="hidden md:block h-14 border-l border-gray-200 dark:border-gray-700 mx-4"></div>
                                            <Link
                                                href={item.link || '#'}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                title={item.title}
                                                className='flex-shrink-0'
                                            >
                                                <div className="w-16 h-16 overflow-hidden rounded flex-shrink-0 bg-white dark:bg-gray-100">
                                                    <Image
                                                        src={item.photo}
                                                        alt={item.title}
                                                        width={64}
                                                        height={64}
                                                        className="object-contain w-full h-full dark:brightness-90 transition-all duration-300"
                                                    />
                                                </div>
                                            </Link>
                                        </div>
                                    )}
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </section>
    );
};

export default JourneyContent;