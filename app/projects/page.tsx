import React from 'react';
import { Metadata } from 'next';
import ProjectsContent from '@/components/ProjectsContent/page';
import { getPageMetadata } from '@/lib/getPageMetadata';

export async function generateMetadata(): Promise<Metadata> {
  return getPageMetadata('projects', '/projects');
}

export default function Project() {
  return <ProjectsContent />;
}
