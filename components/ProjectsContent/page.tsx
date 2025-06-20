import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ProjectItem } from '@/types/projectitem';

const ProjectsContent: React.FC = () => {
    const presentProjects: ProjectItem[] = [
        {
            projectName: "Personal Portfolio",
            type: "present",
            icon: "🌟",
            year: "2024",
            status: "completed",
            description: "My personal portfolio website built with Next.js and TypeScript.",
            techStack: ["Next.js", "TypeScript", "TailwindCSS"],
            githubLink: "https://github.com/fleizean/personal-portfolio",
            liveLink: "https://fleizean.me",
            image: "/logo.png"
        },
        {
            projectName: "nasilbifirma",
            type: "present",
            icon: "🚀",
            year: "2024",
            status: "development",
            description: "Personal tech venture focused on innovative solutions.",
            techStack: [".NET", "Next.js", "TypeScript", "TailwindCSS"],
            githubLink: "https://github.com/fleizean/nasilbifirma",
            liveLink: "https://nasilbifirma.com",
            image: "/nasilbifirma.png"
        }
    ];

    const pastProjects: ProjectItem[] = [
        {
            projectName: "spotifyfizyfit",
            type: "past",
            icon: "🎵",
            year: "2024",
            status: "completed",
            description: "Selenium-based automation for Spotify to fizy playlist migration.",
            techStack: ["Python", "Selenium", "Web Automation"],
            githubLink: "https://github.com/fleizean/spotifyfizyfit",
            image: "/spotifyfizyfit.png"
        },
        {
            projectName: "sleepwipe",
            type: "past",
            icon: "💤",
            year: "2024",
            status: "completed",
            description: "Sleepwipe is a software that prevents the computer from going into sleep mode.",
            techStack: ["C", "Bash"],
            githubLink: "https://github.com/fleizean/sleepwipe",
            image: "/sleepwipe.png"
        },
        {
            projectName: "webserv",
            type: "past",
            icon: "🐚",
            year: "2023",
            status: "completed",
            description: "Nginx-like web server built from C++.",
            techStack: ["C++", "HTTP", "Web Server"],
            githubLink: "https://github.com/fleizean/webserv",
            image: "/webserv.png"
        }
    ];

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
        <section className="relative w-full z-50 transition-all duration-300 mt-15">
            <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-20 xl:px-60 py-10">
                <h2 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-10 text-gray-700">my projects</h2>

                {/* Present Projects */}
                <div className="mb-8">
                    <h3 className="font-bold mb-4">Present</h3>
                    <ul className="space-y-4">
                        {presentProjects.map((project, index) => (
                            <li key={index} className="pb-3">
                                <div className="flex flex-col md:flex-row md:items-start">
                                    <div className="flex items-baseline gap-2 flex-grow">
                                        <span className="text-lg">{project.icon}</span>
                                        <div className="w-full">
                                            <div className="flex flex-wrap items-center gap-2">
                                                <span className="font-medium text-black">{project.projectName}</span>
                                                <span className="text-gray-500">• {project.year}</span>
                                                {getStatusBadge(project.status)}
                                            </div>
                                            <p className="text-sm text-gray-500 mt-1">{project.description}</p>
                                            
                                            {/* Tech Stack */}
                                            {project.techStack && (
                                                <div className="flex flex-wrap gap-1 mt-2">
                                                    {project.techStack.map((tech, techIndex) => (
                                                        <span key={techIndex} className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded">
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
                                                        className="text-sm text-gray-600 hover:text-black"
                                                    >
                                                        GitHub
                                                    </Link>
                                                )}
                                                {project.liveLink && (
                                                    <Link 
                                                        href={project.liveLink} 
                                                        target="_blank" 
                                                        rel="noopener noreferrer"
                                                        className="text-sm text-gray-600 hover:text-black"
                                                    >
                                                        Live Demo
                                                    </Link>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {/* Project Image */}
                                    {project.image && (
                                        <div className="flex items-start mt-3 md:mt-0">
                                            <div className="hidden md:block h-14 border-l border-gray-200 mx-4"></div>
                                            <Link
                                                href={project.githubLink || project.liveLink || '#'}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                title={project.projectName}
                                                className='flex-shrink-0"'
                                            >
                                                <Image
                                                    src={project.image}
                                                    alt={project.projectName}
                                                    width={80}
                                                    height={50}
                                                    className="object-cover rounded"
                                                />
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
                    <h3 className="font-bold mb-4">Past</h3>
                    <ul className="space-y-4">
                        {pastProjects.map((project, index) => (
                            <li key={index} className="pb-3">
                                <div className="flex flex-col md:flex-row md:items-start">
                                    <div className="flex items-baseline gap-2 flex-grow">
                                        <span className="text-lg">{project.icon}</span>
                                        <div className="w-full">
                                            <div className="flex flex-wrap items-center gap-2">
                                                <span className="font-medium text-black">{project.projectName}</span>
                                                <span className="text-gray-500">• {project.year}</span>
                                                {getStatusBadge(project.status)}
                                            </div>
                                            <p className="text-sm text-gray-500 mt-1">{project.description}</p>
                                            
                                            {/* Tech Stack */}
                                            {project.techStack && (
                                                <div className="flex flex-wrap gap-1 mt-2">
                                                    {project.techStack.map((tech, techIndex) => (
                                                        <span key={techIndex} className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded">
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
                                                        className="text-sm text-gray-600 hover:text-black"
                                                    >
                                                        GitHub
                                                    </Link>
                                                )}
                                                {project.liveLink && (
                                                    <Link 
                                                        href={project.liveLink} 
                                                        target="_blank" 
                                                        rel="noopener noreferrer"
                                                        className="text-sm text-gray-600 hover:text-black"
                                                    >
                                                        Live Demo
                                                    </Link>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {/* Project Image */}
                                    {project.image && (
                                        <div className="flex items-start mt-3 md:mt-0">
                                            <div className="hidden md:block h-14 border-l border-gray-200 mx-4"></div>
                                            <Link
                                                href={project.githubLink || project.liveLink || '#'}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                title={project.projectName}
                                                className='flex-shrink-0"'
                                            >
                                                <Image
                                                    src={project.image}
                                                    alt={project.projectName}
                                                    width={80}
                                                    height={50}
                                                    className="object-cover rounded"
                                                />
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