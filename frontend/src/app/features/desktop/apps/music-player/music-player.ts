import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  linkedSignal,
  signal,
} from '@angular/core';
import { DomSanitizer, type SafeResourceUrl } from '@angular/platform-browser';
import { LucideMusic, LucidePlay } from '@lucide/angular';
import type { MusicTrack } from '@domain';
import { I18n } from '@core/i18n/i18n.service';

const YOUTUBE_ID = /^[\w-]{11}$/;

@Component({
  selector: 'app-music-player',
  imports: [LucidePlay, LucideMusic],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './music-player.html',
  host: { class: 'flex h-full min-h-0 bg-[#1a1c21] text-slate-200' },
})
export class MusicPlayer {
  protected readonly i18n = inject(I18n);
  private readonly sanitizer = inject(DomSanitizer);

  /**
   * Parçalar içerikten gelir (admin panelinden yönetilir) ve YouTube'un resmi gömülü
   * oynatıcısıyla çalar; dosya indirilip barındırılmaz.
   */
  readonly tracks = input<MusicTrack[]>([]);

  /** Liste değişince seçili parça listede kaldıysa korunur, yoksa ilk parçaya geçilir */
  protected readonly current = linkedSignal<MusicTrack[], MusicTrack | null>({
    source: this.tracks,
    computation: (tracks, previous) =>
      tracks.find((t) => t.videoId === previous?.value?.videoId) ?? tracks[0] ?? null,
  });
  /** Oynatıcı yalnızca kullanıcı onaylayınca yüklenir; parça değişince yeniden onay gerekmez */
  protected readonly started = signal(false);

  protected readonly embedUrl = computed<SafeResourceUrl | null>(() => {
    const videoId = this.current()?.videoId;
    if (!videoId || !YOUTUBE_ID.test(videoId)) return null;
    return this.sanitizer.bypassSecurityTrustResourceUrl(
      `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0`,
    );
  });

  protected select(track: MusicTrack): void {
    this.current.set(track);
  }

  protected start(): void {
    this.started.set(true);
  }
}
