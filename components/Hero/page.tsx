import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaGithub, FaLinkedin, FaTwitter } from 'react-icons/fa';

const Hero = () => {
    return (
        <section className="py-16 md:py-24">
            <div className="container mx-auto px-60">
                <div className="flex flex-col md:flex-row items-center justify-between">
                    {/* Left Column - Text Content */}
                    <div className="md:w-1/2 flex flex-col items-start space-y-6">
                        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-white">
                            Hi, I&apos;m Enes.
                        </h1>
                        
                        <h2 className="text-xl md:text-2xl font-medium text-gray-600 dark:text-gray-300">
                            junior full stack developer at <span className="text-blue-600 dark:text-blue-400">[looking]</span>
                        </h2>
                        
                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed lowercase">
                            crafting digital experiences through code and design.
                            exploring the balance between functionality and aesthetics.
                            turning 0s into 1s with passion and precision. so let&apos;s connect and create something amazing together!
                        </p>
                        
                        {/* Social Links */}
                        <div className="flex space-x-5 pt-4">
                            <Link href="https://github.com/fleizean" target="_blank" rel="noopener noreferrer"
                                className="text-gray-700 hover:text-black dark:text-gray-300 dark:hover:text-white transition-colors">
                                <FaGithub className="text-2xl" />
                            </Link>
                            <Link href="https://linkedin.com/in/yourprofile" target="_blank" rel="noopener noreferrer"
                                className="text-gray-700 hover:text-blue-700 dark:text-gray-300 dark:hover:text-blue-400 transition-colors">
                                <FaLinkedin className="text-2xl" />
                            </Link>
                            <Link href="https://twitter.com/yourhandle" target="_blank" rel="noopener noreferrer"
                                className="text-gray-700 hover:text-blue-500 dark:text-gray-300 dark:hover:text-blue-400 transition-colors">
                                <FaTwitter className="text-2xl" />
                            </Link>
                        </div>
                    </div>
                    
                    {/* Right Column - Image */}
                    <div className="md:w-1/2 flex justify-end md:justify-center lg:justify-end">
                        <div className="relative w-64 h-64 md:w-80 md:h-80 overflow-hidden border-4 border-gray-200 dark:border-gray-700 shadow-lg mr-0 md:mr-4 lg:mr-8">
                            <Image 
                                src="/hero.png" 
                                alt="its me btw" 
                                fill
                                className="object-cover"
                                priority
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;