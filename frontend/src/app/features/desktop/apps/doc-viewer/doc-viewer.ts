import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import type { Doc } from '../../model/desktop.types';

/** .md dosyalarını editör görünümünde, markdown sözdizimi renklendirilmiş halde gösterir */
@Component({
  selector: 'app-doc-viewer',
  imports: [NgOptimizedImage],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class:
      'os-mono block h-full overflow-y-auto bg-white px-5 py-4 text-[13px] leading-relaxed text-slate-700 dark:bg-[#1a1c21] dark:text-slate-300',
  },
  templateUrl: './doc-viewer.html',
})
export class DocViewer {
  readonly doc = input.required<Doc>();
}
