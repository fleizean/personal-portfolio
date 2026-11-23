import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  computed,
  inject,
  input,
} from '@angular/core';
import { LucideMaximize2, LucideMinimize2, LucideMinus, LucideX } from '@lucide/angular';
import { I18n } from '@core/i18n/i18n.service';
import type { WindowState } from '../../model/desktop.types';
import { WindowManagerStore } from '../../state/window-manager.store';
import { NodeIcon } from '../node-icon/node-icon';

const MIN_W = 320;
const MIN_H = 200;

/** Pencere çerçevesi: başlık çubuğu, sürükleme, boyutlama, küçült/büyüt/kapat */
@Component({
  selector: 'app-window-frame',
  imports: [NodeIcon, LucideMinus, LucideMaximize2, LucideMinimize2, LucideX],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './window-frame.html',
  host: {
    role: 'dialog',
    '[attr.aria-label]': 'win().title',
    '[attr.aria-hidden]': 'win().minimized',
    '[class]': 'hostClass()',
    '[style]': 'hostStyle()',
    '(pointerdown)': 'onFocus()',
  },
})
export class WindowFrame {
  readonly win = input.required<WindowState>();
  readonly focused = input(false);
  /** Mobilde pencereler tam ekran açılır ve sürüklenmez */
  readonly compact = input(false);

  protected readonly i18n = inject(I18n);
  private readonly store = inject(WindowManagerStore);
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly cleanups: (() => void)[] = [];

  constructor() {
    inject(DestroyRef).onDestroy(() => this.cleanups.forEach((fn) => fn()));
  }

  protected readonly maximized = computed(() => this.win().maximized || this.compact());
  protected readonly isFolder = computed(() => this.win().content.app === 'files');

  protected readonly hostClass = computed(() =>
    [
      'absolute flex-col overflow-hidden border text-[13px] shadow-2xl',
      'bg-[#f6f7f9] text-slate-800 dark:bg-[#22252c] dark:text-slate-200',
      this.win().minimized ? 'hidden' : 'flex',
      this.maximized() ? '' : 'rounded-lg',
      this.focused()
        ? 'border-slate-300 dark:border-[#3a3f4b]'
        : 'border-slate-300/70 dark:border-[#2b2f38]',
    ].join(' '),
  );

  /**
   * Her durumda aynı uzun-biçim özellikler verilir. `inset` gibi kısayollar Angular'ın
   * stil farkı hesabında left/top silinirken onları da götürüp pencereyi kaydırıyordu.
   */
  protected readonly hostStyle = computed(() => {
    const w = this.win();
    if (this.maximized()) {
      return {
        left: '0',
        top: '0',
        right: '0',
        bottom: '0',
        width: 'auto',
        height: 'auto',
        transform: 'none',
        'max-width': 'none',
        'max-height': 'none',
        'z-index': w.z,
      };
    }
    const centered = w.x === null || w.y === null;
    return {
      left: centered ? '50%' : `${w.x}px`,
      top: centered ? '50%' : `${w.y}px`,
      right: 'auto',
      bottom: 'auto',
      width: `${w.w}px`,
      height: `${w.h}px`,
      transform: centered ? 'translate(-50%, -50%)' : 'none',
      'max-width': '100%',
      'max-height': '100%',
      'z-index': w.z,
    };
  });

  protected onFocus(): void {
    if (!this.focused()) this.store.focus(this.win().id);
  }

  protected minimize(): void {
    this.store.minimize(this.win().id);
  }

  protected toggleMaximize(): void {
    if (!this.compact()) this.store.toggleMaximize(this.win().id);
  }

  protected close(): void {
    this.store.close(this.win().id);
  }

  protected startDrag(event: PointerEvent): void {
    if (this.maximized() || event.button !== 0) return;
    if ((event.target as HTMLElement).closest('button')) return;
    const rect = this.currentRect();
    if (!rect) return;
    const start = { px: event.clientX, py: event.clientY, ...rect };
    const id = this.win().id;

    this.track(event, (ev) => {
      const x = start.x + ev.clientX - start.px;
      const y = start.y + ev.clientY - start.py;
      // Başlık çubuğu her zaman tutulabilir kalsın
      this.store.move(
        id,
        Math.min(Math.max(x, 80 - start.w), start.pw - 80),
        Math.min(Math.max(y, 0), start.ph - 40),
      );
    });
  }

  protected startResize(event: PointerEvent): void {
    if (this.maximized() || event.button !== 0) return;
    event.stopPropagation();
    const rect = this.currentRect();
    if (!rect) return;
    const win = this.win();
    // Ortalanmış pencere boyutlanırken yerinden kaymasın diye önce konumu sabitle
    if (win.x === null || win.y === null) this.store.move(win.id, rect.x, rect.y);
    const start = { px: event.clientX, py: event.clientY, w: rect.w, h: rect.h };

    this.track(event, (ev) =>
      this.store.resize(
        win.id,
        Math.max(MIN_W, start.w + ev.clientX - start.px),
        Math.max(MIN_H, start.h + ev.clientY - start.py),
      ),
    );
  }

  /** Çalışma alanına göre pencerenin o anki konumu (ortalanmış pencerede de piksel verir) */
  private currentRect() {
    const el = this.host.nativeElement;
    const parent = el.offsetParent as HTMLElement | null;
    if (!parent) return null;
    const r = el.getBoundingClientRect();
    const p = parent.getBoundingClientRect();
    return { x: r.left - p.left, y: r.top - p.top, w: r.width, h: r.height, pw: p.width, ph: p.height };
  }

  /** İşaretçi bırakılana kadar hareketleri izler */
  private track(event: PointerEvent, onMove: (ev: PointerEvent) => void): void {
    event.preventDefault();
    const view = this.host.nativeElement.ownerDocument.defaultView;
    if (!view) return;
    const stop = () => {
      view.removeEventListener('pointermove', onMove);
      view.removeEventListener('pointerup', stop);
      view.removeEventListener('pointercancel', stop);
    };
    view.addEventListener('pointermove', onMove);
    view.addEventListener('pointerup', stop);
    view.addEventListener('pointercancel', stop);
    this.cleanups.push(stop);
  }
}
