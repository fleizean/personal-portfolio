import type { Language } from './language';

export type AdminSectionKey = 'profile' | 'projects' | 'journey' | 'technologies' | 'school' | 'tracks';

/** Koleksiyon bölümleri (profil tek kayıttır, sıralanmaz) */
export type AdminCollectionKey = Exclude<AdminSectionKey, 'profile'>;

/**
 * Admin paneli kaydı: dilden bağımsız alanlar kökte, dile bağlı metinler "tr" ve "en" altında.
 * Alanlar bölüm şemasından okunduğu için tip burada genel tutulur; biçimi API doğrular.
 */
export type AdminRecord = Record<string, unknown> & {
  id?: number;
} & Partial<Record<Language, Record<string, unknown>>>;

export interface AdminUser {
  login: string;
  name?: string;
  avatarUrl?: string;
}

/** API'nin hata zarfı; fields anahtarları alan yollarıdır (ör. "tr.title", "githubUrl") */
export interface AdminError {
  code: string;
  message: string;
  fields?: Record<string, string>;
}
