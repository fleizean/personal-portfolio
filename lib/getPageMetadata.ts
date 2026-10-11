import { Metadata } from 'next';
import { getLanguage } from '@/lib/getLanguage';
import commonEN from '@/public/locales/en/common.json';
import commonTR from '@/public/locales/tr/common.json';

type PageKey = 'home' | 'journey' | 'school_life' | 'blog' | 'contact' | 'cv' | 'projects' | 'tech_stack';

export async function getPageMetadata(page: PageKey, canonical: string): Promise<Metadata> {
  const lang = await getLanguage();

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
