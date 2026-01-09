import React from 'react';
import { Metadata } from 'next';
import CVContent from '@/components/CVContent/page';

export const metadata: Metadata = {
    title: 'CV / Resume',
    description: 'View and download my professional CV/Resume. Available in Turkish and English.',
    alternates: {
        canonical: '/cv',
    },
};

export default function CV() {
    return (
        <CVContent />
    )
}
