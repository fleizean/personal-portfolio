import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { SchoolExperience } from '@/types/schoolexperience';

const SchoolLifeContent: React.FC = () => {
    const schoolExperiences: SchoolExperience[] = [
        {
            title: "Ecole 42",
            period: "2021 - 2024",
            description: "Ecole 42 was a transformative journey that shaped both my technical skills and personal growth. This peer-to-peer learning environment pushed me beyond my comfort zone and taught me how to approach complex problems with creativity and perseverance.",
            highlights: [
                "Mastered C, C++, and various programming paradigms through intensive projects",
                "Built strong collaboration skills through team projects and peer evaluations",
                "Developed problem-solving abilities through the unique &apos;learn by doing&apos; approach",
                "Formed lasting friendships with peers from diverse backgrounds",
                "Gained experience in system administration, networks, and web development",
                "Learned to work under pressure and meet challenging deadlines"
            ],
            image: "/42.png",
            link: "https://www.42.fr/en/"
        }
    ];

    return (
        <section className="relative w-full z-50 transition-all duration-300 mt-15">
            <div className="container mx-auto px-4 sm:px-6 md:px-12 lg:px-20 xl:px-60 py-10">
                <h2 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-10 text-gray-700">my school life</h2>

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
                                                <h4 className="font-semibold mb-2">Key Experiences:</h4>
                                                <ul className="list-disc pl-5 space-y-1">
                                                    {experience.highlights.map((highlight, i) => (
                                                        <li key={i} className="text-sm text-gray-600">{highlight}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                            
                                            <div className="mt-6">
                                                <h4 className="font-semibold mb-2">Personal Reflection:</h4>
                                                <p className="text-sm text-gray-600 italic">
                                                    &ldquo;My time at 42 wasn&apos;t just about coding—it was about discovering my potential, building lifelong connections, and developing the resilience to tackle any challenge. The countless nights spent debugging, the collaborative problem-solving sessions, and the shared victories formed the foundation of not just my technical skills, but my approach to life&apos;s challenges.&ldquo;
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
                    <h3 className="font-bold mb-4">Looking back...</h3>
                    <div className="flex items-baseline gap-2">
                        <span className="text-lg flex-shrink-0">✨</span>
                        <p className="text-sm text-gray-600">
                            School life at Ecole 42 taught me that true learning happens outside of comfort zones. The peer-to-peer model, the intensity of projects, and the supportive community created an environment where growth was inevitable. These experiences have been instrumental in shaping who I am today, both as a developer and as a person.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default SchoolLifeContent;