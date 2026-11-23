import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  afterNextRender,
  computed,
  inject,
  input,
  signal,
} from '@angular/core';
import { LucideMoon, LucideSun } from '@lucide/angular';
import { I18n } from '@core/i18n/i18n.service';
import { ThemeService } from '@core/theme/theme.service';
import type { Glyph } from '../../model/desktop.types';
import { WindowManagerStore } from '../../state/window-manager.store';
import { NodeIcon } from '../node-icon/node-icon';

export interface MenuEntry {
  label: string;
  kind: 'dir' | 'file';
  glyph: Glyph;
  select: () => void;
}

const WORKSPACES = [1, 2, 3, 4];

/** Üst panel: sistem menüsü, başlatıcılar, çalışma alanları, açık pencereler, tepsi ve saat */
@Component({
  selector: 'app-panel',
  imports: [NodeIcon, LucideMoon, LucideSun],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './panel.html',
  host: {
    class:
      'relative z-[1000] flex h-[34px] shrink-0 items-center gap-1 border-b border-black/10 bg-[#eceff4]/90 px-1 text-[13px] text-slate-700 backdrop-blur-md dark:border-black/40 dark:bg-[#1c1f26]/90 dark:text-slate-200',
    '(document:pointerdown)': 'closeMenuOnOutsideClick($event)',
    '(document:keydown.escape)': 'menuOpen.set(false)',
  },
})
export class Panel {
  readonly menu = input.required<MenuEntry[]>();
  readonly launchers = input.required<MenuEntry[]>();

  protected readonly i18n = inject(I18n);
  protected readonly theme = inject(ThemeService);
  protected readonly store = inject(WindowManagerStore);
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);

  protected readonly workspaces = WORKSPACES;
  protected readonly menuOpen = signal(false);
  private readonly now = signal<Date | null>(null);

  private readonly locale = computed(() => (this.i18n.language() === 'tr' ? 'tr-TR' : 'en-GB'));
  protected readonly time = computed(
    () => this.now()?.toLocaleTimeString(this.locale(), { hour: '2-digit', minute: '2-digit' }) ?? '',
  );
  protected readonly date = computed(
    () =>
      this.now()?.toLocaleDateString(this.locale(), {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }) ?? '',
  );

  constructor() {
    // Saat sunucuda render edilmez; hidrasyon uyuşmazlığı olmasın diye ilk çizimden sonra dolar
    const destroyRef = inject(DestroyRef);
    afterNextRender(() => {
      this.now.set(new Date());
      const id = setInterval(() => this.now.set(new Date()), 15_000);
      destroyRef.onDestroy(() => clearInterval(id));
    });
  }

  protected select(entry: MenuEntry): void {
    this.menuOpen.set(false);
    entry.select();
  }

  protected closeMenuOnOutsideClick(event: PointerEvent): void {
    if (!this.menuOpen()) return;
    const menu = this.host.nativeElement.querySelector('[data-system-menu]');
    if (menu && !menu.contains(event.target as Node)) this.menuOpen.set(false);
  }
}
