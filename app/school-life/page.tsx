import React from 'react';
import { Metadata } from 'next';
import SchoolLifeContent from '@/components/SchoolLifeContent/page';

export const metadata: Metadata = {
    title: 'School Life',
    description: 'Explore my school life experiences, projects, and activities that shaped my journey.',
    keywords: 'school life, projects, activities, experiences, education',
};


export default function SchoolLife() {
    return (
        <SchoolLifeContent />
    )
}