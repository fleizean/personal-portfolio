import Link from 'next/link';
import React from 'react';
import Image from 'next/image';
import { JourneyItem } from '@/types/journeyitem';

const JourneyContent: React.FC = () => {
    const presentItems: JourneyItem[] = [
        // Existing present items
        {
            title: "Junior Full Stack Developer",
            place: "Searching for opportunities",
            year: "Present",
            description: "Actively seeking opportunities to contribute to innovative projects and teams.",
            type: "work",
            emoji: "🔍",
            link: "https://www.linkedin.com/in/fleizean/"
        },
        {
            title: "CEO / Developer",
            place: "nasilbifirma",
            year: "2025 - Present",
            description: "Leading development and strategy for a personal tech venture.",
            type: "work",
            emoji: "🚀",
            link: "https://nasilbifirma.com",
            photo: "/nasilbifirma.png"
        },
    ];

    const pastItems: JourneyItem[] = [
        // Existing past items remain unchanged
        {
            title: "Full Stack Developer",
            place: "Solvent Yazılım",
            year: "2024 - 2025",
            description: "Developed and maintained full-stack web applications with modern frameworks.",
            type: "work",
            emoji: "💻",
            link: "https://solventyazilim.com",
            photo: "/solvent.png"
        },
        {
            title: "Software Engineer",
            place: "Ecole 42",
            year: "2024",
            description: "Graduated from a peer-to-peer learning program focused on software development and computer science.",
            type: "education",
            emoji: "🧩",
            link: "https://www.42.fr/en/",
            photo: "/42.png"
        },
        {
            title: "Information Management",
            place: "Dumlupinar University",
            year: "2024",
            description: "Bachelor's degree with focus on information systems and management.",
            type: "education",
            emoji: "📊",
            link: "https://www.kutahya.edu.tr/en"
        },
        {
            title: "Freelance Developer",
            place: "MEBS",
            year: "2018",
            description: "Worked on infirmary management system and other projects as a freelance developer.",
            type: "work",
            emoji: "🌐",
            link: "https://tr.wikipedia.org/wiki/MEBS_Okulu_ve_E%C4%9Fitim_Merkezi"
        },
        {
            title: "IT Intern",
            place: "Türk Telekom",
            year: "2018 - 2019",
            description: "Assisted in IT operations and development tasks.",
            type: "work",
            emoji: "📱",
            link: "https://www.turktelekom.com.tr",
            photo: "/turk-telekom.png"
        },
        {
            title: "Computer Science",
            place: "İzmit Mesleki ve Teknik Anadolu Lisesi",
            year: "2019",
            description: "High school degree with technical focus on computer science and programming.",
            type: "education",
            emoji: "🖥️",
            link: "https://www.izmitmtal.k12.tr"
        },
        {
            title: "Hello World",
            place: "Planet Earth",
            year: "2002",
            description: "Started my journey in this world.",
            type: "personal",
            emoji: "👶",
            link: "https://en.wikipedia.org/wiki/2002"
        },
    ];

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
        <section className="relative w-full z-50 transition-all duration-300 mt-15">
            <div className="container mx-auto px-4 sm:px-6 md:px-10 lg:px-20 xl:px-60 py-6 sm:py-10">
                <h2 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-10 text-gray-700">my journey</h2>

                {/* Present Section */}
                <div className="mb-8">
                    <h3 className="font-bold mb-4">Present</h3>
                    <ul className="space-y-4">
                        {presentItems.map((item, index) => (
                            <li key={index} className="pb-3">
                                <div className="flex flex-col sm:flex-row items-start justify-between">
                                    {/* Left content */}
                                    <div className="flex items-baseline gap-2 w-full sm:w-auto">
                                        <span className="text-lg">{item.emoji || getDefaultEmoji(item.type)}</span>
                                        <div className="w-full">
                                            <div className="flex flex-wrap items-center gap-1">
                                                <span className="font-xs">{item.title} at </span>
                                                <span className="font-medium text-black">
                                                    <Link href={`${item.link}`} target="_blank" rel="noopener noreferrer" className="text-black hover:text-gray-500">{item.place}</Link>
                                                    <span> • {item.year}</span>
                                                </span>
                                            </div>
                                            <p className="text-sm text-gray-500 mt-1">{item.description}</p>
                                        </div>
                                    </div>
                                    
                                    {/* Photo area */}
                                    {item.photo && (
                                        <div className="flex items-center mt-3 sm:mt-0">
                                            <div className="hidden sm:block h-14 border-l border-gray-200 mx-4"></div>
                                            <Link
                                                href={item.link || '#'}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                title={item.title}
                                            >
                                                <Image
                                                    src={item.photo}
                                                    alt={item.title}
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

                {/* Past Section */}
                <div>
                    <h3 className="font-bold mb-4">Past</h3>
                    <ul className="space-y-4">
                        {pastItems.map((item, index) => (
                            <li key={index} className="pb-3">
                                <div className="flex flex-col sm:flex-row items-start justify-between">
                                    <div className="flex items-baseline gap-2 w-full sm:w-auto">
                                        <span className="text-lg">{item.emoji || getDefaultEmoji(item.type)}</span>
                                        <div className="w-full">
                                            <div className="flex flex-wrap items-center gap-1">
                                                <span className="font-xs">{item.title} at</span>
                                                <span className="font-medium text-black">
                                                    <Link href={`${item.link}`} target="_blank" rel="noopener noreferrer" className="text-black hover:text-gray-500">{item.place}</Link>
                                                    <span> • {item.year}</span>
                                                </span>
                                            </div>
                                            <p className="text-sm text-gray-500 mt-1">{item.description}</p>
                                        </div>
                                    </div>
                                    {item.photo && (
                                        <div className="flex items-center mt-3 sm:mt-0">
                                            <div className="hidden sm:block h-14 border-l border-gray-200 mx-4"></div>
                                            <Link
                                                href={item.link || '#'}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                title={item.title}
                                            >
                                                <Image
                                                    src={item.photo}
                                                    alt={item.title}
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
            </div>
        </section>
    );
};

export default JourneyContent;