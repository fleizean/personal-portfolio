import React from 'react';
import { Metadata } from 'next';
import SchoolLifeContent from '@/components/SchoolLifeContent/page';
import { getPageMetadata } from '@/lib/getPageMetadata';

export async function generateMetadata(): Promise<Metadata> {
  return getPageMetadata('school_life', '/school-life');
}

export default function SchoolLife() {
  return <SchoolLifeContent />;
}
