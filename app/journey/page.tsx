import React from 'react';
import { Metadata } from 'next';
import JourneyContent from '@/components/JourneyContent/page';

export const metadata: Metadata = {
    title: 'Journey',
    description: 'this is my journey page, where I share my experiences and milestones.',
    keywords: 'journey, experiences, milestones, personal growth',
};


export default function Journey() {
    return (
        <JourneyContent />
    )
}