import React from 'react';
import { Metadata } from 'next';
import TechStackContent from '@/components/TechStackContent/page';

export const metadata: Metadata = {
    title: 'Tech Stack',
    description: 'this is my tech stack page, showcasing the technologies I use in my projects.',
    keywords: 'tech stack, technologies, programming languages, frameworks, tools',
};


export default function TechStack() {
    return (
        <TechStackContent />
    )
}