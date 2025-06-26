import React from 'react';
import { Metadata } from 'next';
import ContactContent from '@/components/ContactContent/page';

export const metadata: Metadata = {
    title: 'Contact',
    description: 'this is my contact page',
    keywords: 'contact, email, phone, address',
};


export default function Contact() {
    return (
        <ContactContent />
    )
}