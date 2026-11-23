import { Injectable, computed, signal } from '@angular/core';
import type { OpenRequest, WindowContent, WindowState } from '../model/desktop.types';

const CASCADE_START = { x: 160, y: 40 };
const CASCADE_STEP = 28;

/**
 * Masaüstündeki pencerelerin durumu: açma, odaklama, küçültme, taşıma, boyutlama
 * ve çalışma alanları. DesktopPage seviyesinde sağlanır; her masaüstünün kendi örneği olur.
 */
@Injectable()
export class WindowManagerStore {
  private readonly state = signal<{ windows: WindowState[]; topZ: number }>({
    windows: [],
    topZ: 0,
  });

  readonly workspace = signal(1);

  /** Etkin çalışma alanındaki pencereler */
  readonly windows = computed(() =>
    this.state().windows.filter((w) => w.workspace === this.workspace()),
  );

  readonly focusedId = computed(() => {
    const open = this.windows().filter((w) => !w.minimized);
    if (open.length === 0) return null;
    return open.reduce((top, w) => (w.z > top.z ? w : top)).id;
  });

  /** Sayfa ilk açıldığında gösterilecek pencereler (ortalanmış olarak) */
  seed(requests: OpenRequest[]): void {
    this.state.set({
      windows: requests.map((request, i) => ({
        x: null,
        y: null,
        ...request,
        workspace: this.workspace(),
        z: i + 1,
        minimized: false,
        maximized: false,
      })),
      topZ: requests.length,
    });
  }

  open(request: OpenRequest): void {
    this.state.update(({ windows, topZ }) => {
      const z = topZ + 1;
      const existing = windows.find((w) => w.id === request.id);
      if (existing) {
        // Aynı pencere zaten açıksa yenisini açmak yerine öne getir
        this.workspace.set(existing.workspace);
        return {
          windows: windows.map((w) => (w.id === existing.id ? { ...w, z, minimized: false } : w)),
          topZ: z,
        };
      }
      const offset = (windows.length % 8) * CASCADE_STEP;
      const created: WindowState = {
        x: CASCADE_START.x + offset,
        y: CASCADE_START.y + offset,
        ...request,
        workspace: this.workspace(),
        z,
        minimized: false,
        maximized: false,
      };
      return { windows: [...windows, created], topZ: z };
    });
  }

  close(id: string): void {
    this.state.update((s) => ({ ...s, windows: s.windows.filter((w) => w.id !== id) }));
  }

  focus(id: string): void {
    this.state.update(({ windows, topZ }) => ({
      windows: windows.map((w) => (w.id === id ? { ...w, z: topZ + 1, minimized: false } : w)),
      topZ: topZ + 1,
    }));
  }

  minimize(id: string): void {
    this.patch(id, { minimized: true });
  }

  toggleMaximize(id: string): void {
    this.patch(id, (w) => ({ maximized: !w.maximized }));
  }

  move(id: string, x: number, y: number): void {
    this.patch(id, { x, y });
  }

  resize(id: string, w: number, h: number): void {
    this.patch(id, { w, h });
  }

  /** Dosya yöneticisinde klasör değişince pencere başlığı ve içeriği güncellenir */
  navigate(id: string, title: string, content: WindowContent): void {
    this.patch(id, { title, content });
  }

  /** Görev çubuğundaki düğme: öndeyse küçültür, değilse öne getirir */
  toggleFromTaskbar(id: string): void {
    const win = this.windows().find((w) => w.id === id);
    if (!win) return;
    if (this.focusedId() === id && !win.minimized) this.minimize(id);
    else this.focus(id);
  }

  private patch(id: string, change: Partial<WindowState> | ((w: WindowState) => Partial<WindowState>)) {
    this.state.update((s) => ({
      ...s,
      windows: s.windows.map((w) =>
        w.id === id ? { ...w, ...(typeof change === 'function' ? change(w) : change) } : w,
      ),
    }));
  }
}
