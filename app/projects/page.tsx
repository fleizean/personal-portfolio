import React from 'react';
import { Metadata } from 'next';
import ProjectsContent from '@/components/ProjectsContent/page';

export const metadata: Metadata = {
    title: 'Projects',
    description: 'this is my projects page, showcasing various projects I have worked on, including web applications, software development, and more.',
    keywords: 'projects, web development, software development, portfolio, applications',
};


export default function Project() {
    return (
        <ProjectsContent />
    )
}