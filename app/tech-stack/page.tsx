import React from 'react';
import { Metadata } from 'next';
import TechStackContent from '@/components/TechStackContent/page';

export const metadata: Metadata = {
  title: 'Tech Stack',
  description:
    'Discover the technologies, programming languages, frameworks, and tools I use to build modern applications. From frontend to backend, explore my technical expertise.',
  alternates: {
    canonical: '/tech-stack',
  },
};

export default function TechStack() {
  return <TechStackContent />;
}
