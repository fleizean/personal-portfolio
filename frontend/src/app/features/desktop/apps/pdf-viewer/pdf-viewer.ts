import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { LucideDownload, LucideExternalLink } from '@lucide/angular';
import { I18n } from '@core/i18n/i18n.service';

/** Uygulamayla gelen PDF'ler için yalın görüntüleyici */
@Component({
  selector: 'app-pdf-viewer',
  imports: [LucideExternalLink, LucideDownload],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'flex h-full flex-col' },
  templateUrl: './pdf-viewer.html',
})
export class PdfViewer {
  /** Yalnızca uygulamanın kendi /cv/ klasöründeki dosyalar gösterilir */
  readonly src = input.required<string>();

  protected readonly i18n = inject(I18n);
  private readonly sanitizer = inject(DomSanitizer);

  protected readonly safeSrc = computed(() => {
    const src = this.src();
    if (!/^\/cv\/[\w-]+\.pdf$/.test(src)) throw new Error(`Unexpected PDF source: ${src}`);
    return this.sanitizer.bypassSecurityTrustResourceUrl(src);
  });
}
