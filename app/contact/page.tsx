import React from 'react';
import { Metadata } from 'next';
import ContactContent from '@/components/ContactContent/page';

export const metadata: Metadata = {
  title: 'Contact',
  description:
    'Get in touch with me for collaboration opportunities, project inquiries, or just to say hello. Connect via email, social media, or through the contact form.',
  alternates: {
    canonical: '/contact',
  },
};

export default function Contact() {
  return <ContactContent />;
}
