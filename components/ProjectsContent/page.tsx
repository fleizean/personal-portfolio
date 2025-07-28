"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ProjectItem } from '@/types/projectitem';
import { useTranslation } from '@/context/LanguageContext';

const ProjectsContent: React.FC = () => {
    const { isLoading, t } = useTranslation("common");
        
    if (isLoading) {
        return <div className="flex justify-center items-center min-h-screen">
            <div className="loader"></div>
        </div>;
    }
    
    const presentProjects = t('projects.items.present', { returnObjects: true }) as ProjectItem[] || [];
    const pastProjects = t('projects.items.past', { returnObjects: true }) as ProjectItem[] || [];


    const getStatusBadge = (status: ProjectItem['status']) => {
        switch (status) {
            case 'development':
                return <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded">In Development</span>;
            case 'completed':
                return <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">Completed</span>;
            case 'ongoing':
                return <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">Ongoing</span>;
            default:
                return null;
        }
    };

    return (
        <section className="relative w-full z-10 transition-all duration-300 py-8 sm:py-12 md:py-16 lg:py-20 dark:blue-900 dark:bg-opacity-50 dark:bg-gray-800 min-h-screen">
            <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-20 xl:px-60">
            <h2 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-10 text-gray-700 dark:text-gray-300 dark:hover:text-white">{t('projects.section_title')}</h2>

            {/* Present Projects */}
            <div className="mb-8">
                <h3 className="font-bold mb-4 dark:text-gray-300 dark:hover:text-white">{t('projects.present_section_title')}</h3>
                <ul className="space-y-4">
                {presentProjects.map((project, index) => (
                    <li key={index} className="pb-3">
                    <div className="flex flex-col md:flex-row md:items-start">
                        <div className="flex items-baseline gap-2 flex-grow">
                        <span className="text-lg dark:text-gray-300">{project.icon}</span>
                        <div className="w-full">
                            <div className="flex flex-wrap items-center gap-2">
                            <span className="font-medium text-black dark:text-gray-300">{project.projectName}</span>
                            <span className="text-gray-500 dark:text-gray-400">• {project.year}</span>
                            {getStatusBadge(project.status)}
                            </div>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{project.description}</p>
                            
                            {/* Tech Stack */}
                            {project.techStack && (
                            <div className="flex flex-wrap gap-1 mt-2">
                                {project.techStack.map((tech, techIndex) => (
                                <span key={techIndex} className="bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300 text-xs px-2 py-0.5 rounded">
                                    {tech}
                                </span>
                                ))}
                            </div>
                            )}
                            
                            {/* Project Links */}
                            <div className="flex gap-3 mt-2">
                            {project.githubLink && (
                                <Link 
                                href={project.githubLink} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-sm text-gray-600 hover:text-black dark:text-gray-400 dark:hover:text-white"
                                >
                                {t('projects.links.github')}
                                </Link>
                            )}
                            {project.liveLink && (
                                <Link 
                                href={project.liveLink} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-sm text-gray-600 hover:text-black dark:text-gray-400 dark:hover:text-white"
                                >
                                {t('projects.links.live_demo')}
                                </Link>
                            )}
                            </div>
                        </div>
                        </div>
                        
                        {/* Project Image */}
                        {project.image && (
                        <div className="flex items-start mt-3 md:mt-0">
                            <div className="hidden md:block h-14 border-l border-gray-200 dark:border-gray-700 mx-4"></div>
                            <Link
                            href={project.githubLink || project.liveLink || '#'}
                            target="_blank"
                            rel="noopener noreferrer"
                            title={project.projectName}
                            className='flex-shrink-0'
                            >
                               <div className="w-16 h-16 overflow-hidden rounded flex-shrink-0 bg-white dark:bg-gray-100">
                                <Image
                                src={project.image}
                                alt={project.projectName}
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

            {/* Past Projects */}
            <div>
                <h3 className="font-bold mb-4 dark:text-gray-300 dark:hover:text-white">{t('projects.past_section_title')}</h3>
                <ul className="space-y-4">
                {pastProjects.map((project, index) => (
                    <li key={index} className="pb-3">
                    <div className="flex flex-col md:flex-row md:items-start">
                        <div className="flex items-baseline gap-2 flex-grow">
                        <span className="text-lg dark:text-gray-300">{project.icon}</span>
                        <div className="w-full">
                            <div className="flex flex-wrap items-center gap-2">
                            <span className="font-medium text-black dark:text-gray-300">{project.projectName}</span>
                            <span className="text-gray-500 dark:text-gray-400">• {project.year}</span>
                            {getStatusBadge(project.status)}
                            </div>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{project.description}</p>
                            
                            {/* Tech Stack */}
                            {project.techStack && (
                            <div className="flex flex-wrap gap-1 mt-2">
                                {project.techStack.map((tech, techIndex) => (
                                <span key={techIndex} className="bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300 text-xs px-2 py-0.5 rounded">
                                    {tech}
                                </span>
                                ))}
                            </div>
                            )}
                            
                            {/* Project Links */}
                            <div className="flex gap-3 mt-2">
                            {project.githubLink && (
                                <Link 
                                href={project.githubLink} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-sm text-gray-600 hover:text-black dark:text-gray-400 dark:hover:text-white"
                                >
                                {t('projects.links.github')}
                                </Link>
                            )}
                            {project.liveLink && (
                                <Link 
                                href={project.liveLink} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-sm text-gray-600 hover:text-black dark:text-gray-400 dark:hover:text-white"
                                >
                                {t('projects.links.live_demo')}
                                </Link>
                            )}
                            </div>
                        </div>
                        </div>
                        
                        {/* Project Image */}
                        {project.image && (
                        <div className="flex items-start mt-3 md:mt-0">
                            <div className="hidden md:block h-14 border-l border-gray-200 dark:border-gray-700 mx-4"></div>
                            <Link
                            href={project.githubLink || project.liveLink || '#'}
                            target="_blank"
                            rel="noopener noreferrer"
                            title={project.projectName}
                            className='flex-shrink-0'
                            >
                               <div className="w-16 h-16 overflow-hidden rounded flex-shrink-0 bg-white dark:bg-gray-100">
                                <Image
                                src={project.image}
                                alt={project.projectName}
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

export default ProjectsContent;