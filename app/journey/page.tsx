import React from 'react';
import { Metadata } from 'next';
import JourneyContent from '@/components/JourneyContent/page';

export const metadata: Metadata = {
    title: 'Journey',
    description: 'Follow my professional journey from student to software engineer. Explore my experiences, milestones, career growth, and the path that shaped who I am today.',
    alternates: {
        canonical: '/journey',
    },
};


export default function Journey() {
    return (
        <JourneyContent />
    )
}