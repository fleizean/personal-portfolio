"use client";

import React from 'react';
import Link from 'next/link';
import { FaReact, FaServer, FaPython, FaDocker, FaFileAlt } from 'react-icons/fa';
import { SiTypescript, SiGraphql, SiJavascript, SiDjango, SiFastapi, SiRabbitmq, SiSignal, SiNginx, SiPostgresql } from 'react-icons/si';
import { MdBusiness } from 'react-icons/md';
import { RiNextjsFill } from 'react-icons/ri';
import { GiSkills, GiStarSattelites } from 'react-icons/gi';
import { AiOutlineDotNet } from 'react-icons/ai';
import { TbBrandCSharp } from 'react-icons/tb';
import { DiMsqlServer } from 'react-icons/di';
import { TechItem } from '@/types/techitem';
import { useTranslation } from '@/context/LanguageContext';

type IconComponent = React.ComponentType<{ className?: string }>;


const TechStackContent: React.FC = () => {
    const { isLoading, t } = useTranslation("common");

    if (isLoading) {
        return <div className="flex justify-center items-center h-screen">
            <div className="loader"></div>
        </div>;
    }

    const techStackData = t('tech_stack', { returnObjects: true });
    const techItems: TechItem[] = techStackData.items || [];

    // Render'da kullanım:
    const getIcon = (iconName: string): IconComponent => {
        const iconMap: Record<string, IconComponent> = {
            FaReact,
            TbBrandCSharp,
            SiRabbitmq,
            SiSignal,
            FaDocker,
            DiMsqlServer,
            SiPostgresql,
            SiNginx,
            MdBusiness,
            RiNextjsFill,
            SiTypescript,
            SiJavascript,
            AiOutlineDotNet,
            FaPython,
            SiDjango,
            SiFastapi,
            FaFileAlt,
            SiGraphql,
            FaServer,
            GiSkills,
            GiStarSattelites
        };
        return iconMap[iconName] || FaServer; // Fallback icon
    };

    {
        techItems.map((item: TechItem) => {
            const IconComponent = getIcon(item.icon);
            return <IconComponent key={item.name} className={item.color} />;
        })
    }

    const frontendItems = techItems.filter((item: TechItem) => item.category === 'frontend');
    const backendItems = techItems.filter((item: TechItem) => item.category === 'backend');
    const learningItems = techItems.filter((item: TechItem) => item.category === 'learning');

    return (
        <section className="relative w-full z-50 transition-all duration-300 mt-10 md:mt-15">
            <div className="container mx-auto px-4 sm:px-6 md:px-12 lg:px-20 xl:px-60 py-10">
                <h2 className="text-2xl sm:text-3xl font-bold mb-6 md:mb-10 text-gray-700">{t('tech_stack.title')}</h2>

                {/* Frontend Section */}
                <div className="mb-6">
                    <h3 className="font-bold mb-3 md:mb-4 flex items-center">
                        <span className="mr-2 text-gray-800">●</span>
                        <span>{t('tech_stack.categories.frontend')}</span>
                    </h3>
                    <ul className="space-y-1 pl-2 md:pl-3">
                        {frontendItems.map((item, index) => (
                            <li key={index} className="pb-3">
                                <div className="flex items-start gap-2">
                                    <span className={`text-base sm:text-lg mt-1 ${item.color}`}>
                                        {(() => {
                                            const IconComponent = getIcon(item.icon);
                                            return <IconComponent />;
                                        })()}
                                    </span>
                                    <div className="flex-1">
                                        <div className="flex flex-wrap items-center gap-1">
                                            <span className="font-xs">{item.name}</span>
                                            <span className="font-medium text-black">
                                                <Link href={item.link || '#'} target="_blank" rel="noopener noreferrer" className="text-black hover:text-gray-500">
                                                    
                                                </Link>
                                            </span>
                                        </div>
                                        <p className="text-xs sm:text-sm text-gray-500 mt-1">{item.description}</p>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Backend Section */}
                <div className="mb-6">
                    <h3 className="font-bold mb-3 md:mb-4 flex items-center">
                        <span className="mr-2 text-gray-800">●</span>
                        <span>{t('tech_stack.categories.backend')}</span>
                    </h3>
                    <ul className="space-y-1 pl-2 md:pl-3">
                        {backendItems.map((item, index) => (
                            <li key={index} className="pb-3">
                                <div className="flex items-start gap-2">
                                    <span className={`text-base sm:text-lg mt-1 ${item.color}`}>
                                        {(() => {
                                            const IconComponent = getIcon(item.icon);
                                            return <IconComponent />;
                                        })()}
                                    </span>
                                    <div className="flex-1">
                                        <div className="flex flex-wrap items-center gap-1">
                                            <span className="font-xs">{item.name}</span>
                                            <span className="font-medium text-black">
                                                <Link href={item.link || '#'} target="_blank" rel="noopener noreferrer" className="text-black hover:text-gray-500">
                                                    
                                                </Link>
                                            </span>
                                        </div>
                                        <p className="text-xs sm:text-sm text-gray-500 mt-1">{item.description}</p>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Database Section */}
                <div className="mb-6">
                    <h3 className="font-bold mb-3 md:mb-4 flex items-center">
                        <span className="mr-2 text-gray-800">●</span>
                        <span>{t('tech_stack.categories.database')}</span>
                    </h3>
                    <ul className="space-y-1 pl-2 md:pl-3">
                        {techItems.filter(item => item.category === 'database').map((item, index) => (
                            <li key={index} className="pb-3">
                                <div className="flex items-start gap-2">
                                    <span className={`text-base sm:text-lg mt-1 ${item.color}`}>
                                        {(() => {
                                            const IconComponent = getIcon(item.icon);
                                            return <IconComponent />;
                                        })()}
                                    </span>
                                    <div className="flex-1">
                                        <div className="flex flex-wrap items-center gap-1">
                                            <span className="font-xs">{item.name}</span>
                                            <span className="font-medium text-black">
                                                <Link href={item.link || '#'} target="_blank" rel="noopener noreferrer" className="text-black hover:text-gray-500">
                                                    
                                                </Link>
                                            </span>
                                        </div>
                                        <p className="text-xs sm:text-sm text-gray-500 mt-1">{item.description}</p>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* DevOps Section */}
                <div className="mb-6">
                    <h3 className="font-bold mb-3 md:mb-4 flex items-center">
                        <span className="mr-2 text-gray-800">●</span>
                        <span>{t('tech_stack.categories.devops')}</span>
                    </h3>
                    <ul className="space-y-1 pl-2 md:pl-3">
                        {techItems.filter(item => item.category === 'devops').map((item, index) => (
                            <li key={index} className="pb-3">
                                <div className="flex items-start gap-2">
                                    <span className={`text-base sm:text-lg mt-1 ${item.color}`}>
                                        {(() => {
                                            const IconComponent = getIcon(item.icon);
                                            return <IconComponent />;
                                        })()}
                                    </span>
                                    <div className="flex-1">
                                        <div className="flex flex-wrap items-center gap-1">
                                            <span className="font-xs">{item.name}</span>
                                            <span className="font-medium text-black">
                                                <Link href={item.link || '#'} target="_blank" rel="noopener noreferrer" className="text-black hover:text-gray-500">
                                                    
                                                </Link>
                                            </span>
                                        </div>
                                        <p className="text-xs sm:text-sm text-gray-500 mt-1">{item.description}</p>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Currently Learning Section */}
                <div>
                    <h3 className="font-bold mb-3 md:mb-4 flex items-center">
                        <span className="mr-2 text-gray-800">●</span>
                        <span>{t('tech_stack.categories.learning')}</span>
                    </h3>
                    <ul className="space-y-1 pl-2 md:pl-3">
                        {learningItems.map((item, index) => (
                            <li key={index} className="pb-3">
                                <div className="flex items-start gap-2">
                                    <span className={`text-base sm:text-lg mt-1 ${item.color}`}>
                                        {(() => {
                                            const IconComponent = getIcon(item.icon);
                                            return <IconComponent />;
                                        })()}
                                    </span>
                                    <div className="flex-1">
                                        <div className="flex flex-wrap items-center gap-1">
                                            <span className="font-xs">{item.name}</span>
                                            <span className="font-medium text-black">
                                                <Link href={item.link || '#'} target="_blank" rel="noopener noreferrer" className="text-black hover:text-gray-500">
                                                   
                                                </Link>
                                            </span>
                                        </div>
                                        <p className="text-xs sm:text-sm text-gray-500 mt-1">{item.description}</p>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </section>
    );
};

export default TechStackContent;