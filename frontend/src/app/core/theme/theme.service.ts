import { DOCUMENT, Injectable, PLATFORM_ID, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export type Theme = 'light' | 'dark';

const STORAGE_KEY = 'theme';

/**
 * Tema sınıfını ilk boyamadan önce index.html'deki satır içi betik ekler
 * (localStorage, yoksa sistem tercihi). Servis yalnızca o durumu okur ve değiştirir;
 * görünüm tarafı Tailwind'in `dark:` varyantıyla çözülür.
 */
@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly document = inject(DOCUMENT);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  readonly theme = signal<Theme>(
    this.isBrowser && this.document.documentElement.classList.contains('dark') ? 'dark' : 'light',
  );

  toggle(): void {
    this.apply(this.theme() === 'dark' ? 'light' : 'dark');
  }

  private apply(theme: Theme): void {
    this.theme.set(theme);
    const root = this.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      // Gizli sekme vb. durumlarda depolama kapalı olabilir; tema yine de uygulanır.
    }
  }
}
