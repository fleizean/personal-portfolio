import { Metadata } from 'next';
import { headers } from 'next/headers';
import commonEN from '@/public/locales/en/common.json';
import commonTR from '@/public/locales/tr/common.json';

type PageKey = 'home' | 'journey' | 'school_life' | 'blog' | 'contact' | 'cv' | 'projects' | 'tech_stack';

function detectLanguage(acceptLanguage: string | null): 'tr' | 'en' {
  if (!acceptLanguage) return 'en';
  return acceptLanguage.toLowerCase().includes('tr') ? 'tr' : 'en';
}

export async function getPageMetadata(page: PageKey, canonical: string): Promise<Metadata> {
  const headersList = await headers();
  const acceptLanguage = headersList.get('accept-language');
  const lang = detectLanguage(acceptLanguage);

  const locale = lang === 'tr' ? commonTR : commonEN;
  const meta = locale.meta[page];

  return {
    title: meta.title,
    description: meta.description,
    alternates: {
      canonical,
    },
  };
}
