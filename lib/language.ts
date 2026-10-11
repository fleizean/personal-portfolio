export type Language = 'tr' | 'en';

// Dil tercihi hem localStorage'da hem çerezde bu adla tutulur;
// çerezi sunucu okur (lib/getLanguage.ts), böylece sayfa doğru dilde render edilir.
export const LANGUAGE_KEY = 'portfolio-language';

export function isLanguage(value: unknown): value is Language {
  return value === 'tr' || value === 'en';
}
