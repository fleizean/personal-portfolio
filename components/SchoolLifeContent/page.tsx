"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { SchoolExperience } from '@/types/schoolexperience';
import { useTranslation } from '@/context/LanguageContext';

const SchoolLifeContent: React.FC = () => {
    const { isLoading, t } = useTranslation("common");

    if (isLoading) {
        return <div className="flex justify-center items-center h-screen">
            <div className="loader"></div>
        </div>;
    }

    const schoolExperiences = t('school.experiences', { returnObjects: true }) as SchoolExperience[] || [];

    return (
        <section className="relative w-full z-50 transition-all duration-300 mt-15">
            <div className="container mx-auto px-4 sm:px-6 md:px-12 lg:px-20 xl:px-60 py-10">
                <h2 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-10 text-gray-700">{t('school.section_title')}</h2>

                <div>
                    <ul className="space-y-4">
                        {schoolExperiences.map((experience, index) => (
                            <li key={index} className="pb-3">
                                <div className="flex flex-col md:flex-row items-start justify-between gap-4">
                                    <div className="flex items-baseline gap-2 w-full md:w-auto">
                                        <span className="text-lg">🎓</span>
                                        <div className="w-full">
                                            <div className="flex flex-wrap items-center gap-1">
                                                <span className="font-xs">{experience.title}</span>
                                                <span className="font-medium text-black">
                                                    {experience.link ? (
                                                        <Link href={experience.link} target="_blank" rel="noopener noreferrer" className="text-black hover:text-gray-500">
                                                            • {experience.period}
                                                        </Link>
                                                    ) : (
                                                        `• ${experience.period}`
                                                    )}
                                                </span>
                                            </div>
                                            <p className="text-sm text-gray-500 mt-1">{experience.description}</p>
                                            
                                            <div className="mt-4">
                                                <h4 className="font-semibold mb-2">{t('school.key_experiences_title')}</h4>
                                                <ul className="list-disc pl-5 space-y-1">
                                                    {experience.highlights.map((highlight, i) => (
                                                        <li key={i} className="text-sm text-gray-600">{highlight}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                            
                                            <div className="mt-6">
                                                <h4 className="font-semibold mb-2">{t('school.experiences.0.reflection_title')}</h4>
                                                <p className="text-sm text-gray-600 italic">
                                                    &ldquo;{t('school.experiences.0.reflection')}&rdquo;
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {experience.image && (
                                        <div className="flex items-center mt-4 md:mt-0">
                                            <div className="hidden md:block h-14 border-l border-gray-200 mx-4"></div>
                                            <Link
                                                href={experience.link || '#'}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                title={experience.title}
                                                className="flex-shrink-0"
                                            >
                                                <Image
                                                    src={experience.image}
                                                    alt={experience.title}
                                                    width={50}
                                                    height={50}
                                                    className="object-cover"
                                                />
                                            </Link>
                                        </div>
                                    )}
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="mt-8">
                    <h3 className="font-bold mb-4">{t('school.looking_back_title')}</h3>
                    <div className="flex items-baseline gap-2">
                        <span className="text-lg flex-shrink-0">✨</span>
                        <p className="text-sm text-gray-600">
                            {t('school.looking_back_text')}
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default SchoolLifeContent;