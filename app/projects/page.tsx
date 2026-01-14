import React from 'react';
import { Metadata } from 'next';
import ProjectsContent from '@/components/ProjectsContent/page';

export const metadata: Metadata = {
  title: 'Projects',
  description:
    'Explore my portfolio of web applications, software projects, and creative solutions. From full-stack development to system design, discover what I have built.',
  alternates: {
    canonical: '/projects',
  },
};

export default function Project() {
  return <ProjectsContent />;
}
