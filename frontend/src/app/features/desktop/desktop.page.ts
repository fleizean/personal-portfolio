import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  PLATFORM_ID,
  afterNextRender,
  computed,
  effect,
  inject,
  signal,
  untracked,
} from '@angular/core';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { rxResource } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { ContentRepository } from '@domain';
import { I18n } from '@core/i18n/i18n.service';
import { SeoService } from '@core/seo/seo.service';
import type { DesktopRouteData } from './desktop.routes';
import type {
  FsDir,
  FsFile,
  FsLocation,
  FsNode,
  OpenRequest,
  WindowState,
} from './model/desktop.types';
import { buildHome, buildTrash, cvSrc } from './model/filesystem';
import { WindowManagerStore } from './state/window-manager.store';
import { Panel, type MenuEntry } from './ui/panel/panel';
import { Wallpaper } from './ui/wallpaper/wallpaper';
import { WindowFrame } from './ui/window-frame/window-frame';
import { NodeIcon } from './ui/node-icon/node-icon';
import { FileManager } from './apps/file-manager/file-manager';
import { DocViewer } from './apps/doc-viewer/doc-viewer';
import { About } from './apps/about/about';
import { PdfViewer } from './apps/pdf-viewer/pdf-viewer';

const ABOUT_WINDOW: OpenRequest = {
  id: 'about',
  title: 'README.md',
  glyph: 'text',
  content: { app: 'about' },
  w: 760,
  h: 400,
};

interface DesktopIcon {
  key: string;
  label: string;
  node: FsNode;
  location: FsLocation;
}

/** Ana sayfa: masaüstü, panel ve pencereler */
@Component({
  selector: 'app-desktop-page',
  imports: [Panel, Wallpaper, WindowFrame, NodeIcon, FileManager, DocViewer, About, PdfViewer],
  providers: [WindowManagerStore],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './desktop.page.html',
  host: { class: 'os-root fixed inset-0 flex flex-col overflow-hidden text-[13px] font-os' },
})
export class DesktopPage {
  protected readonly i18n = inject(I18n);
  protected readonly store = inject(WindowManagerStore);
  private readonly repository = inject(ContentRepository);
  private readonly document = inject(DOCUMENT);

  /** Mobilde pencereler tam ekran açılır ve ikonlar tek dokunuşla açılır */
  protected readonly compact = signal(false);
  protected readonly selectedIcon = signal<string | null>(null);
  private windowCounter = 0;

  private readonly content = rxResource({
    params: () => this.i18n.language(),
    stream: ({ params }) => this.repository.getContent(params),
  });

  protected readonly profile = computed(() => this.content.value()?.profile ?? null);

  protected readonly home = computed<FsDir | null>(() => {
    const content = this.content.value();
    return content ? buildHome(content, this.i18n.language(), (key) => this.i18n.t(key)) : null;
  });

  protected readonly trash = computed(() => buildTrash((key) => this.i18n.t(key)));

  protected readonly desktopIcons = computed<DesktopIcon[]>(() => {
    const home = this.home();
    if (!home) return [];
    const pick = ['projects', 'README.md', 'cv.pdf', 'contact.sh'].flatMap((name) => {
      const node = home.children.find((c) => c.name === name);
      return node ? [{ key: name, label: name, node, location: { root: 'home' as const, path: [name] } }] : [];
    });
    return [
      {
        key: 'trash',
        label: this.i18n.t('os.places.trash'),
        node: this.trash(),
        location: { root: 'trash', path: [] },
      },
      { key: 'home', label: this.i18n.t('os.desktop.home'), node: home, location: { root: 'home', path: [] } },
      ...pick,
    ];
  });

  protected readonly menu = computed<MenuEntry[]>(() => [
    {
      label: this.i18n.t('os.menu.files'),
      kind: 'dir',
      glyph: 'home',
      select: () => this.openHome(),
    },
    { label: 'README.md', kind: 'file', glyph: 'text', select: () => this.store.open(ABOUT_WINDOW) },
    { label: this.i18n.t('os.menu.cv'), kind: 'file', glyph: 'pdf', select: () => this.openNamedFile('cv.pdf') },
    {
      label: this.i18n.t('os.menu.contact'),
      kind: 'file',
      glyph: 'script',
      select: () => this.openNamedFile('contact.sh'),
    },
  ]);

  protected readonly launchers = computed(() => this.menu().slice(0, 3));

  protected readonly cvSrc = computed(() => cvSrc(this.i18n.language()));

  constructor() {
    this.store.seed([ABOUT_WINDOW]);

    const route = inject(ActivatedRoute).snapshot;
    const data = route.data as DesktopRouteData;
    const path = `/${route.url.map((segment) => segment.path).join('/')}`;

    // Başlık, açıklama, canonical ve OG etiketleri dile göre güncellenir; sunucuda da render edilir
    const seo = inject(SeoService);
    effect(() => seo.apply(data.page, path));

    // /projects, /cv gibi adreslerde ilgili pencere içerik hazır olunca bir kez açılır
    let initialOpened = false;
    effect(() => {
      const home = this.home();
      if (initialOpened || !home || !data.open) return;
      initialOpened = true;
      const open = data.open;
      untracked(() => {
        if ('file' in open) {
          this.openNamedFile(open.file);
          return;
        }
        const dir = home.children.find(
          (c): c is FsDir => c.kind === 'dir' && c.name === open.folder,
        );
        if (dir) this.openFolder({ root: 'home', path: [dir.name] }, dir);
      });
    });

    if (isPlatformBrowser(inject(PLATFORM_ID))) {
      const destroyRef = inject(DestroyRef);
      afterNextRender(() => {
        const query = this.document.defaultView?.matchMedia('(max-width: 767px)');
        if (!query) return;
        const update = () => this.compact.set(query.matches);
        update();
        query.addEventListener('change', update);
        destroyRef.onDestroy(() => query.removeEventListener('change', update));
      });
    }
  }

  protected openIcon(icon: DesktopIcon): void {
    if (icon.node.kind === 'dir') this.openFolder(icon.location, icon.node);
    else this.openFile(icon.node);
  }

  protected clickIcon(icon: DesktopIcon): void {
    if (this.compact()) this.openIcon(icon);
    else this.selectedIcon.set(icon.key);
  }

  protected clearIconSelection(event: Event): void {
    if (event.target === event.currentTarget) this.selectedIcon.set(null);
  }

  protected openFile(file: FsFile): void {
    const action = file.open;
    switch (action.type) {
      case 'about':
        this.store.open(ABOUT_WINDOW);
        break;
      case 'doc':
        this.store.open({
          id: `doc:${file.name}`,
          title: file.name,
          glyph: file.glyph,
          content: { app: 'doc', doc: action.doc },
          w: 640,
          h: 480,
        });
        break;
      case 'pdf':
        this.store.open({ id: 'pdf', title: file.name, glyph: 'pdf', content: { app: 'pdf' }, w: 760, h: 640 });
        break;
      case 'external':
        this.document.defaultView?.open(action.href, '_blank', 'noopener,noreferrer');
        break;
    }
  }

  protected onNavigated(win: WindowState, event: { location: FsLocation; dir: FsDir }): void {
    this.store.navigate(win.id, event.dir.name, { app: 'files', location: event.location });
  }

  protected openNamedFile(name: string): void {
    const file = this.home()?.children.find((c): c is FsFile => c.kind === 'file' && c.name === name);
    if (file) this.openFile(file);
  }

  private openHome(): void {
    const home = this.home();
    if (home) this.openFolder({ root: 'home', path: [] }, home);
  }

  private openFolder(location: FsLocation, dir: FsDir): void {
    this.windowCounter += 1;
    this.store.open({
      id: `files-${this.windowCounter}`,
      title: dir.name,
      glyph: dir.glyph ?? 'folder',
      content: { app: 'files', location },
      w: 820,
      h: 520,
    });
  }
}
