import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import {
  LucideArrowLeft,
  LucideArrowRight,
  LucideArrowUp,
  LucideChevronRight,
  LucideGlobe,
  LucideHouse,
} from '@lucide/angular';
import { I18n } from '@core/i18n/i18n.service';
import type { SocialLink } from '@domain';
import type { FsDir, FsFile, FsLocation, FsNode } from '../../model/desktop.types';
import { resolveDir, sameLocation } from '../../model/filesystem';
import { NodeIcon } from '../../ui/node-icon/node-icon';

/** Klasik masaüstü dosya yöneticisi: menü, gezinme, yol çubuğu, kenar çubuğu, ızgara */
@Component({
  selector: 'app-file-manager',
  imports: [
    NodeIcon,
    LucideArrowLeft,
    LucideArrowRight,
    LucideArrowUp,
    LucideHouse,
    LucideChevronRight,
    LucideGlobe,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './file-manager.html',
  host: { class: 'flex h-full flex-col' },
})
export class FileManager {
  readonly location = input.required<FsLocation>();
  readonly home = input.required<FsDir>();
  readonly trash = input.required<FsDir>();
  readonly network = input<SocialLink[]>([]);
  /** Dokunmatik ekranda tek dokunuşla açılır */
  readonly singleClick = input(false);

  readonly navigated = output<{ location: FsLocation; dir: FsDir }>();
  readonly fileOpened = output<FsFile>();

  protected readonly i18n = inject(I18n);
  private readonly history = signal<{ stack: FsLocation[]; index: number } | null>(null);
  protected readonly selected = signal<string | null>(null);

  private readonly rootDir = computed(() =>
    this.location().root === 'trash' ? this.trash() : this.home(),
  );
  protected readonly dir = computed(
    () => resolveDir(this.rootDir(), this.location().path) ?? this.rootDir(),
  );

  private readonly historyState = computed(
    () => this.history() ?? { stack: [this.location()], index: 0 },
  );
  protected readonly canGoBack = computed(() => this.historyState().index > 0);
  protected readonly canGoForward = computed(
    () => this.historyState().index < this.historyState().stack.length - 1,
  );

  protected readonly places = computed(() => {
    const home = this.home();
    return [
      { label: home.name, location: { root: 'home', path: [] } as FsLocation, node: home },
      ...home.children
        .filter((c): c is FsDir => c.kind === 'dir')
        .map((c) => ({ label: c.name, location: { root: 'home', path: [c.name] } as FsLocation, node: c })),
      {
        label: this.i18n.t('os.places.trash'),
        location: { root: 'trash', path: [] } as FsLocation,
        node: this.trash(),
      },
    ];
  });

  protected readonly crumbs = computed(() => {
    const { path } = this.location();
    return [
      { label: this.rootDir().name, path: [] as string[] },
      ...path.map((name, i) => ({ label: name, path: path.slice(0, i + 1) })),
    ];
  });

  protected readonly isCurrent = (location: FsLocation) => sameLocation(location, this.location());

  protected go(next: FsLocation, recordHistory = true): void {
    const target = resolveDir(next.root === 'trash' ? this.trash() : this.home(), next.path);
    if (!target) return;
    if (recordHistory && !sameLocation(next, this.location())) {
      const h = this.historyState();
      this.history.set({ stack: [...h.stack.slice(0, h.index + 1), next], index: h.index + 1 });
    }
    this.selected.set(null);
    this.navigated.emit({ location: next, dir: target });
  }

  protected step(delta: number): void {
    const h = this.historyState();
    const next = h.stack[h.index + delta];
    if (!next) return;
    this.history.set({ ...h, index: h.index + delta });
    this.go(next, false);
  }

  protected up(): void {
    const { root, path } = this.location();
    this.go({ root, path: path.slice(0, -1) });
  }

  protected goTo(path: string[]): void {
    this.go({ root: this.location().root, path });
  }

  protected open(node: FsNode): void {
    if (node.kind === 'dir') this.go({ root: this.location().root, path: [...this.location().path, node.name] });
    else this.fileOpened.emit(node);
  }

  protected click(node: FsNode): void {
    if (this.singleClick()) this.open(node);
    else this.selected.set(node.name);
  }

  protected clearSelection(event: Event): void {
    if (event.target === event.currentTarget) this.selected.set(null);
  }
}
