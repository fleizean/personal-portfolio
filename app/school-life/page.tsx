import React from 'react';
import { Metadata } from 'next';
import SchoolLifeContent from '@/components/SchoolLifeContent/page';

export const metadata: Metadata = {
    title: 'School Life',
    description: 'Explore my academic experiences, educational projects, and school activities that shaped my journey. From coursework to extracurricular achievements.',
    alternates: {
        canonical: '/school-life',
    },
};


export default function SchoolLife() {
    return (
        <SchoolLifeContent />
    )
}