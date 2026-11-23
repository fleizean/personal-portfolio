import { DOCUMENT, Injectable, REQUEST, inject, signal } from '@angular/core';
import { DEFAULT_LANGUAGE, type Language, isLanguage } from '@domain';
import tr from './locales/tr.json';
import en from './locales/en.json';

type Dictionary = typeof tr;

const DICTIONARIES: Record<Language, Dictionary> = { tr, en };

/** Dil tercihi bu çerezde tutulur; sunucu da okur, böylece sayfa doğru dilde render edilir */
export const LANGUAGE_COOKIE = 'portfolio-language';
const ONE_YEAR = 60 * 60 * 24 * 365;

function readCookie(header: string | null | undefined, name: string): string | null {
  if (!header) return null;
  for (const part of header.split(';')) {
    const [key, ...rest] = part.trim().split('=');
    if (key === name) return decodeURIComponent(rest.join('='));
  }
  return null;
}

/**
 * Arayüz metinleri için sinyal tabanlı çeviri servisi.
 * Şablonda `i18n.t('os.menu.files')` çağrısı dil sinyalini okuduğu için
 * dil değişince ilgili görünümler kendiliğinden güncellenir.
 */
@Injectable({ providedIn: 'root' })
export class I18n {
  private readonly document = inject(DOCUMENT);
  private readonly request = inject(REQUEST, { optional: true });

  readonly language = signal<Language>(this.initialLanguage());

  constructor() {
    this.document.documentElement.lang = this.language();
  }

  /** Nokta ile ayrılmış anahtarın metnini döndürür; bulunamazsa anahtarın kendisini */
  t(key: string, params?: Record<string, string | number>): string {
    const value = this.lookup(key);
    if (typeof value !== 'string') return key;
    return params
      ? value.replace(/\{\{(\w+)\}\}/g, (_, name: string) => String(params[name] ?? ''))
      : value;
  }

  /** Dizi tipindeki çeviriler (ör. menü başlıkları) */
  list(key: string): string[] {
    const value = this.lookup(key);
    return Array.isArray(value) ? (value as string[]) : [];
  }

  setLanguage(language: Language): void {
    this.language.set(language);
    this.document.documentElement.lang = language;
    this.document.cookie = `${LANGUAGE_COOKIE}=${language}; path=/; max-age=${ONE_YEAR}; samesite=lax`;
  }

  toggle(): void {
    this.setLanguage(this.language() === 'tr' ? 'en' : 'tr');
  }

  private lookup(key: string): unknown {
    let current: unknown = DICTIONARIES[this.language()];
    for (const segment of key.split('.')) {
      if (current === null || typeof current !== 'object') return undefined;
      current = (current as Record<string, unknown>)[segment];
    }
    return current;
  }

  private initialLanguage(): Language {
    const header = this.request
      ? this.request.headers.get('cookie')
      : this.document.cookie;
    const fromCookie = readCookie(header, LANGUAGE_COOKIE);
    return isLanguage(fromCookie) ? fromCookie : DEFAULT_LANGUAGE;
  }
}
