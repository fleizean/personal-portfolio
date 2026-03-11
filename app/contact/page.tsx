import React from 'react';
import { Metadata } from 'next';
import ContactContent from '@/components/ContactContent/page';
import { getPageMetadata } from '@/lib/getPageMetadata';

export async function generateMetadata(): Promise<Metadata> {
  return getPageMetadata('contact', '/contact');
}

export default function Contact() {
  return <ContactContent />;
}
