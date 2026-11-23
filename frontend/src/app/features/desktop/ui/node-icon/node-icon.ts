import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import {
  type LucideIcon,
  LucideDynamicIcon,
  LucideFileText,
  LucideFolderKanban,
  LucideGraduationCap,
  LucideHouse,
  LucideLayers,
  LucideLink2,
  LucideMusic,
  LucidePenLine,
  LucideRoute,
  LucideSettings,
  LucideSquareTerminal,
  LucideTrash2,
} from '@lucide/angular';
import type { Glyph, IconKind } from '../../model/desktop.types';

const GLYPHS: Partial<Record<Glyph, LucideIcon>> = {
  home: LucideHouse,
  projects: LucideFolderKanban,
  journey: LucideRoute,
  stack: LucideLayers,
  school: LucideGraduationCap,
  blog: LucidePenLine,
  text: LucideFileText,
  script: LucideSquareTerminal,
  link: LucideLink2,
  settings: LucideSettings,
  terminal: LucideSquareTerminal,
  music: LucideMusic,
};

/** Uygulama ikonlarının arka planı */
const APP_BACKGROUND: Partial<Record<Glyph, string>> = {
  terminal: 'linear-gradient(135deg, #2b2f38, #11131a)',
  music: 'linear-gradient(135deg, #b46ef0, #6b4dff)',
  settings: 'linear-gradient(135deg, #5a6478, #2f3542)',
};

const FILE_ACCENT: Partial<Record<Glyph, string>> = {
  pdf: '#e5484d',
  script: '#30a46c',
  link: '#3e8bff',
  text: '#8b93a7',
};

/** Klasör, dosya ve çöp kutusu ikonları; masaüstü, dosya yöneticisi ve panelde ortak */
@Component({
  selector: 'app-node-icon',
  imports: [LucideDynamicIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'relative inline-block shrink-0',
    '[style.width.px]': 'size()',
    '[style.height.px]': 'size()',
    'aria-hidden': 'true',
  },
  templateUrl: './node-icon.html',
})
export class NodeIcon {
  readonly kind = input<IconKind>('file');
  readonly glyph = input<Glyph | undefined>(undefined);
  readonly size = input(48);

  protected readonly trashIcon = LucideTrash2;

  protected readonly variant = computed(() =>
    this.glyph() === 'trash' ? 'trash' : this.kind(),
  );
  protected readonly inner = computed(() => {
    const glyph = this.glyph();
    return glyph ? (GLYPHS[glyph] ?? null) : null;
  });
  protected readonly accent = computed(() => FILE_ACCENT[this.glyph() ?? 'text'] ?? '#8b93a7');
  protected readonly appBackground = computed(
    () => APP_BACKGROUND[this.glyph() ?? 'settings'] ?? APP_BACKGROUND['settings'],
  );
}
