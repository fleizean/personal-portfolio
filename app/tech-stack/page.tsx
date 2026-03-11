import React from 'react';
import { Metadata } from 'next';
import TechStackContent from '@/components/TechStackContent/page';
import { getPageMetadata } from '@/lib/getPageMetadata';

export async function generateMetadata(): Promise<Metadata> {
  return getPageMetadata('tech_stack', '/tech-stack');
}

export default function TechStack() {
  return <TechStackContent />;
}
