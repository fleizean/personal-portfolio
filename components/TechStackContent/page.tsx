import React from 'react';
import Link from 'next/link';
import { FaReact, FaServer, FaPython, FaDocker, FaFileAlt } from 'react-icons/fa';
import { SiTypescript, SiGraphql, SiJavascript, SiDjango, SiFastapi, SiRabbitmq, SiSignal, SiNginx, SiPostgresql } from 'react-icons/si';
import { MdBusiness } from 'react-icons/md';
import { RiNextjsFill } from 'react-icons/ri';
import { GiSkills } from 'react-icons/gi';
import { AiOutlineDotNet } from 'react-icons/ai';
import { TbBrandCSharp } from 'react-icons/tb';
import { DiMsqlServer } from 'react-icons/di';

interface TechItem {
    name: string;
    color: string;
    icon: React.ElementType;
    description: string;
    category: 'frontend' | 'backend' | 'learning' | 'database' | 'devops';
    link?: string;
}

const TechStackContent: React.FC = () => {
    const techItems: TechItem[] = [
        {
            name: "React",
            color: "text-blue-400",
            icon: FaReact,
            description: "Developing modern and interactive user interfaces with component-based architecture",
            category: "frontend",
            link: "https://reactjs.org/"
        },
        {
            name: "C#",
            color: "text-purple-500",
            icon: TbBrandCSharp,
            description: "Developing object-oriented applications using Microsoft's powerful C-style language",
            category: "backend",
            link: "https://learn.microsoft.com/en-us/dotnet/csharp/"
        },
        {
            name: "RabbitMQ",
            color: "text-orange-500",
            icon: SiRabbitmq,
            description: "Reliable message broker for asynchronous communication between services",
            category: "backend",
            link: "https://www.rabbitmq.com/"
        },        
        {
            name: "SignalR",
            color: "text-red-600",
            icon: SiSignal,
            description: "Real-time web functionality for .NET applications using WebSockets and more",
            category: "backend",
            link: "https://learn.microsoft.com/en-us/aspnet/core/signalr/introduction"
        },
        {
            name: "Docker",
            color: "text-blue-500",
            icon: FaDocker,
            description: "Containerizing applications for scalable and consistent deployment",
            category: "devops",
            link: "https://www.docker.com/"
        },                
        {
            name: "MSSQL",
            color: "text-blue-800",
            icon: DiMsqlServer,
            description: "Microsoft's enterprise-grade relational database management system",
            category: "database",
            link: "https://www.microsoft.com/en-us/sql-server"
        },        
        {
            name: "PostgreSQL",
            color: "text-blue-400",
            icon: SiPostgresql,
            description: "Open-source relational database known for its robustness and extensibility",
            category: "database",
            link: "https://www.postgresql.org/"
        },
        {
            name: "Nginx",
            color: "text-green-600",
            icon: SiNginx,
            description: "High-performance HTTP server and reverse proxy used for serving apps",
            category: "devops",
            link: "https://www.nginx.com/"
        },
        {
            name: "IIS",
            color: "text-blue-700",
            icon: MdBusiness,
            description: "Microsoft's web server for hosting ASP.NET applications",
            category: "devops",
            link: "https://www.microsoft.com/en-us/iis"
        },    
        {
            name: "Next.js",
            color: "text-black",
            icon: RiNextjsFill,
            description: "Building performant and SEO-friendly web applications with server-side rendering",
            category: "frontend",
            link: "https://nextjs.org/"
        },
        {
            name: "TypeScript",
            color: "text-blue-500",
            icon: SiTypescript,
            description: "Enhancing JavaScript development with static typing for improved scalability and reliability",
            category: "frontend",
            link: "https://www.typescriptlang.org/"
        },
        {
            name: "JavaScript",
            color: "text-yellow-400",
            icon: SiJavascript,
            description: "Creating dynamic client-side logic with the core language of the web",
            category: "frontend",
            link: "https://developer.mozilla.org/en-US/docs/Web/JavaScript"
        },
        {
            name: ".NET",
            color: "text-purple-600",
            icon: AiOutlineDotNet,
            description: "Developing robust and high-performance applications using Microsoft's development framework",
            category: "backend",
            link: "https://dotnet.microsoft.com/"
        },
        {
            name: "Python",
            color: "text-yellow-500",
            icon: FaPython,
            description: "Writing clean, versatile, and high-level code for various application domains",
            category: "backend",
            link: "https://www.python.org/"
        },
        {
            name: "Django",
            color: "text-green-700",
            icon: SiDjango,
            description: "Building secure and scalable web applications with Python's high-level framework",
            category: "backend",
            link: "https://www.djangoproject.com/"
        },
        {
            name: "FastAPI",
            color: "text-teal-500",
            icon: SiFastapi,
            description: "Creating fast and modern APIs with Python, powered by asynchronous capabilities",
            category: "backend",
            link: "https://fastapi.tiangolo.com/"
        },
        {
            name: "SeriLogger",
            color: "text-yellow-600",
            icon: FaFileAlt,
            description: "Logging framework for .NET applications, providing structured logging capabilities",
            category: "devops",
            link: "https://serilog.net/"
        },
        {
            name: "GraphQL",
            color: "text-pink-500",
            icon: SiGraphql,
            description: "Querying APIs efficiently with a flexible and powerful schema-based approach",
            category: "backend",
            link: "https://graphql.org/"
        },
        {
            name: "REST APIs",
            color: "text-blue-600",
            icon: FaServer,
            description: "Designing conventional web services using stateless HTTP methods and endpoints",
            category: "backend",
            link: "https://restfulapi.net/"
        },
        {
            name: "UI/UX Design",
            color: "text-purple-500",
            icon: GiSkills,
            description: "Crafting intuitive and user-centered designs to improve product usability and experience",
            category: "learning",
            link: "#"
        }        
    ];
    
    const frontendItems = techItems.filter(item => item.category === 'frontend');
    const backendItems = techItems.filter(item => item.category === 'backend');
    const learningItems = techItems.filter(item => item.category === 'learning');

    return (
        <section className="relative w-full z-50 transition-all duration-300 mt-15">
            <div className="container items-center container mx-auto justify-center px-8 lg:px-60 py-10">
                <h2 className="text-3xl font-bold mb-10 text-gray-700">my tech stack</h2>

                {/* Frontend Section */}
                <div className="mb-3">
                    <h3 className="font-bold mb-4 flex items-center">
                      <span className="mr-2 text-gray-800">●</span>
                      <span>Frontend</span>
                    </h3>
                    <ul className="space-y-1 pl-3">
                        {frontendItems.map((item, index) => (
                            <li key={index} className="pb-3">
                                <div className="flex items-baseline gap-2 items-start">
                                    <span className="text-lg"><item.icon className={item.color} /></span>
                                    <div>
                                        <div className="flex items-center gap-1">
                                            <span className="font-xs">{item.name}</span>
                                            <span className="font-medium text-black">
                                                <Link href={item.link || '#'} target="_blank" rel="noopener noreferrer" className="text-black hover:text-gray-500">
                                                    {" • "}Technology
                                                </Link>
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-500 mt-1">{item.description}</p>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Backend Section */}
                <div className="mb-3">
                    <h3 className="font-bold mb-4 flex items-center">
                      <span className="mr-2 text-gray-800">●</span>
                      <span>Backend</span>
                    </h3>
                    <ul className="space-y-1 pl-3">
                        {backendItems.map((item, index) => (
                            <li key={index} className="pb-3">
                                <div className="flex items-baseline gap-2 items-start">
                                    <span className="text-lg"><item.icon className={item.color} /></span>
                                    <div>
                                        <div className="flex items-center gap-1">
                                            <span className="font-xs">{item.name}</span>
                                            <span className="font-medium text-black">
                                                <Link href={item.link || '#'} target="_blank" rel="noopener noreferrer" className="text-black hover:text-gray-500">
                                                    {" • "}Technology
                                                </Link>
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-500 mt-1">{item.description}</p>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Database Section */}
                <div className="mb-3">
                    <h3 className="font-bold mb-4 flex items-center">
                      <span className="mr-2 text-gray-800">●</span>
                      <span>Database</span>
                    </h3>
                    <ul className="space-y-1 pl-3">
                        {techItems.filter(item => item.category === 'database').map((item, index) => (
                            <li key={index} className="pb-3">
                                <div className="flex items-baseline gap-2 items-start">
                                    <span className="text-lg"><item.icon className={item.color} /></span>
                                    <div>
                                        <div className="flex items-center gap-1">
                                            <span className="font-xs">{item.name}</span>
                                            <span className="font-medium text-black">
                                                <Link href={item.link || '#'} target="_blank" rel="noopener noreferrer" className="text-black hover:text-gray-500">
                                                    {" • "}Technology
                                                </Link>
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-500 mt-1">{item.description}</p>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* DevOps Section */}
                <div className="mb-3">
                    <h3 className="font-bold mb-4 flex items-center">
                      <span className="mr-2 text-gray-800">●</span>
                      <span>DevOps</span>
                    </h3>
                    <ul className="space-y-1 pl-3">
                        {techItems.filter(item => item.category === 'devops').map((item, index) => (
                            <li key={index} className="pb-3">
                                <div className="flex items-baseline gap-2 items-start">
                                    <span className="text-lg"><item.icon className={item.color} /></span>
                                    <div>
                                        <div className="flex items-center gap-1">
                                            <span className="font-xs">{item.name}</span>
                                            <span className="font-medium text-black">
                                                <Link href={item.link || '#'} target="_blank" rel="noopener noreferrer" className="text-black hover:text-gray-500">
                                                    {" • "}Technology
                                                </Link>
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-500 mt-1">{item.description}</p>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Currently Learning Section */}
                <div>
                    <h3 className="font-bold mb-4 flex items-center">
                      <span className="mr-2 text-gray-800">●</span>
                      <span>Currently Learning</span>
                    </h3>
                    <ul className="space-y-1 pl-3">
                        {learningItems.map((item, index) => (
                            <li key={index} className="pb-3">
                                <div className="flex items-baseline gap-2 items-start">
                                    <span className="text-lg"><item.icon className={item.color} /></span>
                                    <div>
                                        <div className="flex items-center gap-1">
                                            <span className="font-xs">{item.name}</span>
                                            <span className="font-medium text-black">
                                                <Link href={item.link || '#'} target="_blank" rel="noopener noreferrer" className="text-black hover:text-gray-500">
                                                    {" • "}Focus Area
                                                </Link>
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-500 mt-1">{item.description}</p>
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