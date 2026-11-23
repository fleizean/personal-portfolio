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
import { LucideChevronLeft, LucideChevronRight, LucideMoon, LucideSun } from '@lucide/angular';
import { I18n } from '@core/i18n/i18n.service';
import { ThemeService } from '@core/theme/theme.service';
import { iconKindOf, type Glyph, type IconKind, type WindowState } from '../../model/desktop.types';
import { WindowManagerStore } from '../../state/window-manager.store';
import { NodeIcon } from '../node-icon/node-icon';

export interface MenuEntry {
  label: string;
  kind: IconKind;
  glyph: Glyph;
  select: () => void;
}

const WORKSPACES = [1, 2, 3, 4];

/** Üst panel: sistem menüsü, başlatıcılar, çalışma alanları, açık pencereler, tepsi ve saat */
@Component({
  selector: 'app-panel',
  imports: [NodeIcon, LucideMoon, LucideSun, LucideChevronLeft, LucideChevronRight],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './panel.html',
  host: {
    class:
      'relative z-[1000] flex h-[34px] shrink-0 items-center gap-1 border-b border-black/10 bg-[#eceff4]/90 px-1 text-[13px] text-slate-700 backdrop-blur-md dark:border-black/40 dark:bg-[#1c1f26]/90 dark:text-slate-200',
    '(document:pointerdown)': 'closeMenuOnOutsideClick($event)',
    '(document:keydown.escape)': 'menuOpen.set(false); clockOpen.set(false)',
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
  protected readonly clockOpen = signal(false);
  /** Takvimde gösterilen ayın ilk günü */
  protected readonly calendarMonth = signal(new Date(new Date().getFullYear(), new Date().getMonth(), 1));
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

  protected readonly longTime = computed(
    () =>
      this.now()?.toLocaleTimeString(this.locale(), { hour: '2-digit', minute: '2-digit', second: '2-digit' }) ?? '',
  );

  protected readonly monthTitle = computed(() =>
    this.calendarMonth().toLocaleDateString(this.locale(), { month: 'long', year: 'numeric' }),
  );

  /** Pazartesiyle başlayan kısa gün adları (dile göre) */
  protected readonly weekdays = computed(() => {
    const monday = new Date(2024, 0, 1);
    return Array.from({ length: 7 }, (_, i) =>
      new Date(monday.getFullYear(), monday.getMonth(), monday.getDate() + i).toLocaleDateString(this.locale(), {
        weekday: 'short',
      }),
    );
  });

  /** Ay görünümü: 6 hafta x 7 gün; önceki/sonraki aydan taşan günler soluk gösterilir */
  protected readonly calendarDays = computed(() => {
    const first = this.calendarMonth();
    const today = this.now() ?? new Date();
    const offset = (first.getDay() + 6) % 7;
    return Array.from({ length: 42 }, (_, i) => {
      const date = new Date(first.getFullYear(), first.getMonth(), 1 - offset + i);
      return {
        key: date.toISOString(),
        day: date.getDate(),
        inMonth: date.getMonth() === first.getMonth(),
        today: date.toDateString() === today.toDateString(),
      };
    });
  });

  protected toggleClock(): void {
    const open = !this.clockOpen();
    this.clockOpen.set(open);
    this.menuOpen.set(false);
    if (open) {
      const now = this.now() ?? new Date();
      this.calendarMonth.set(new Date(now.getFullYear(), now.getMonth(), 1));
    }
  }

  protected shiftMonth(delta: number): void {
    const month = this.calendarMonth();
    this.calendarMonth.set(new Date(month.getFullYear(), month.getMonth() + delta, 1));
  }

  constructor() {
    // Saat sunucuda render edilmez; hidrasyon uyuşmazlığı olmasın diye ilk çizimden sonra dolar
    const destroyRef = inject(DestroyRef);
    afterNextRender(() => {
      this.now.set(new Date());
      const id = setInterval(() => this.now.set(new Date()), 1_000);
      destroyRef.onDestroy(() => clearInterval(id));
    });
  }

  protected iconKind(win: WindowState): IconKind {
    return iconKindOf(win.content);
  }

  protected select(entry: MenuEntry): void {
    this.menuOpen.set(false);
    entry.select();
  }

  /** Açık menü ya da saat paneli dışına tıklanınca kapanır */
  protected closeMenuOnOutsideClick(event: PointerEvent): void {
    const target = event.target as Node;
    const outside = (selector: string) => !this.host.nativeElement.querySelector(selector)?.contains(target);
    if (this.menuOpen() && outside('[data-system-menu]')) this.menuOpen.set(false);
    if (this.clockOpen() && outside('[data-clock]')) this.clockOpen.set(false);
  }
}
