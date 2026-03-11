import React from 'react';
import { Metadata } from 'next';
import CVContent from '@/components/CVContent/page';
import { getPageMetadata } from '@/lib/getPageMetadata';

export async function generateMetadata(): Promise<Metadata> {
  return getPageMetadata('cv', '/cv');
}

export default function CV() {
  return <CVContent />;
}
