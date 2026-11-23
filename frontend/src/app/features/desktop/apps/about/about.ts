import { ChangeDetectionStrategy, Component, computed, inject, input, output } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import type { Profile } from '@domain';
import { I18n } from '@core/i18n/i18n.service';
import { BrandIcon } from '@shared/ui/brand-icon/brand-icon';
import { EasterEggStore } from '../../state/easter-egg.store';

/** README.md: tanıtım içeriği, editör görünümünde */
@Component({
  selector: 'app-about',
  imports: [NgOptimizedImage, BrandIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class:
      'block h-full overflow-y-auto bg-white px-6 py-6 text-slate-700 sm:px-8 dark:bg-[#1a1c21] dark:text-slate-300',
  },
  templateUrl: './about.html',
  styleUrl: './about.css',
})
export class About {
  readonly profile = input.required<Profile>();
  readonly openCv = output();
  readonly openContact = output();

  protected readonly i18n = inject(I18n);
  /** Mr. Robot sürprizi açıldıysa (terminalde shutdown -r) portre değişir */
  protected readonly easterEgg = inject(EasterEggStore);
  protected readonly portrait = computed(() =>
    this.easterEgg.unlocked() ? '/hero/hero-2.png' : '/hero/hero.png',
  );

  protected readonly linkedinUrl = () =>
    this.profile().socials.find((s) => s.kind === 'linkedin')?.url ?? '#';
}
