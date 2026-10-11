import { cookies, headers } from 'next/headers';
import { Language, LANGUAGE_KEY, isLanguage } from '@/lib/language';

// Önce kullanıcının seçtiği dil (çerez), yoksa tarayıcının birincil dili
export async function getLanguage(): Promise<Language> {
  const saved = (await cookies()).get(LANGUAGE_KEY)?.value;
  if (isLanguage(saved)) {
    return saved;
  }

  const acceptLanguage = (await headers()).get('accept-language');
  return acceptLanguage?.trim().toLowerCase().startsWith('tr') ? 'tr' : 'en';
}
