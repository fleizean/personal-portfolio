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
  LucidePenLine,
  LucideRoute,
  LucideSquareTerminal,
  LucideTrash2,
} from '@lucide/angular';
import type { Glyph } from '../../model/desktop.types';

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
  readonly kind = input<'dir' | 'file'>('file');
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
}
