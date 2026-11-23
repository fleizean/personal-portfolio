import { DOCUMENT, Injectable, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { I18n } from '@core/i18n/i18n.service';

export const SITE_URL = 'https://fleizean.dev';
const OG_IMAGE = `${SITE_URL}/hero/hero.png`;

export type PageKey =
  | 'home'
  | 'journey'
  | 'school_life'
  | 'blog'
  | 'contact'
  | 'cv'
  | 'projects'
  | 'tech_stack'
  | 'admin';

/** Sayfa başlığı, açıklama, canonical ve sosyal önizleme etiketleri; sunucuda da render edilir */
@Injectable({ providedIn: 'root' })
export class SeoService {
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);
  private readonly document = inject(DOCUMENT);
  private readonly i18n = inject(I18n);

  apply(page: PageKey, path: string): void {
    const pageTitle = this.i18n.t(`meta.${page}.title`);
    const title = page === 'home' ? pageTitle : `${pageTitle} — fleizean`;
    const description = this.i18n.t(`meta.${page}.description`);
    const url = `${SITE_URL}${path === '/' ? '' : path}`;
    const locale = this.i18n.language() === 'tr' ? 'tr_TR' : 'en_US';

    this.title.setTitle(title);
    const tags: Record<string, string> = {
      description,
      'og:type': 'website',
      'og:site_name': 'fleizean',
      'og:title': title,
      'og:description': description,
      'og:url': url,
      'og:image': OG_IMAGE,
      'og:locale': locale,
      'twitter:card': 'summary',
      'twitter:site': '@onlyflei',
      'twitter:title': title,
      'twitter:description': description,
      'twitter:image': OG_IMAGE,
    };
    for (const [key, content] of Object.entries(tags)) {
      const attr = key.startsWith('og:') ? 'property' : 'name';
      this.meta.updateTag({ [attr]: key, content }, `${attr}="${key}"`);
    }
    this.meta.updateTag(
      { name: 'robots', content: page === 'admin' ? 'noindex, nofollow' : 'index, follow, max-image-preview:large' },
      'name="robots"',
    );
    this.setCanonical(url);
  }

  private setCanonical(url: string): void {
    let link = this.document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!link) {
      link = this.document.createElement('link');
      link.setAttribute('rel', 'canonical');
      this.document.head.appendChild(link);
    }
    link.setAttribute('href', url);
  }
}
