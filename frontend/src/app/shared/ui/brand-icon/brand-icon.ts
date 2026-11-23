import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { si42, siGithub, siYoutube } from 'simple-icons';
import type { SocialKind } from '@domain';

const PATHS: Partial<Record<SocialKind, string>> = {
  github: siGithub.path,
  youtube: siYoutube.path,
  intra42: si42.path,
};

/** Sosyal bağlantı ikonları. LinkedIn simple-icons'ta olmadığı için sade bir "in" rozeti çizilir. */
@Component({
  selector: 'app-brand-icon',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'inline-block shrink-0', 'aria-hidden': 'true' },
  templateUrl: './brand-icon.html',
})
export class BrandIcon {
  readonly kind = input.required<SocialKind>();
  protected readonly path = computed(() => PATHS[this.kind()] ?? null);
}
