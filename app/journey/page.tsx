import React from 'react';
import { Metadata } from 'next';
import JourneyContent from '@/components/JourneyContent/page';
import { getPageMetadata } from '@/lib/getPageMetadata';

export async function generateMetadata(): Promise<Metadata> {
  return getPageMetadata('journey', '/journey');
}

export default function Journey() {
  return <JourneyContent />;
}
