import {
  ChangeDetectionStrategy,
  Component,
  DOCUMENT,
  afterNextRender,
  computed,
  inject,
  signal,
} from '@angular/core';
import {
  LucideArrowDown,
  LucideArrowUp,
  LucideLock,
  LucideLogOut,
  LucidePlus,
} from '@lucide/angular';
import {
  AdminRepository,
  type AdminCollectionKey,
  type AdminError,
  type AdminRecord,
  type AdminSectionKey,
  type AdminUser,
} from '@domain';
import { type Observable, map } from 'rxjs';
import { HttpAdminRepository } from '@data/http/http-admin.repository';
import { I18n } from '@core/i18n/i18n.service';
import { BrandIcon } from '@shared/ui/brand-icon/brand-icon';
import { ADMIN_SECTIONS, type SectionDef } from './model/admin-sections';
import { RecordEditor } from './ui/record-editor/record-editor';

type Phase = 'checking' | 'locked' | 'ready';

/** Seçili kayıt: mevcut bir kaydın id'si ya da yeni kayıt */
type Selection = number | 'new' | null;

/**
 * fleizeanOS içindeki "Yönetim" uygulaması. Yalnızca /admin adresinden açılır ve kodu
 * ayrı bir pakette, pencere açıldığında yüklenir; ziyaretçilere hiç inmez.
 */
@Component({
  selector: 'app-admin-app',
  imports: [RecordEditor, BrandIcon, LucideLock, LucideLogOut, LucidePlus, LucideArrowUp, LucideArrowDown],
  providers: [{ provide: AdminRepository, useClass: HttpAdminRepository }],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './admin-app.html',
  host: { class: 'flex h-full min-h-0 flex-col bg-[#f6f7f9] dark:bg-[#22252c]' },
})
export class AdminApp {
  protected readonly i18n = inject(I18n);
  private readonly repository = inject(AdminRepository);
  private readonly document = inject(DOCUMENT);

  protected readonly sections = ADMIN_SECTIONS;
  protected readonly phase = signal<Phase>('checking');
  protected readonly user = signal<AdminUser | null>(null);
  protected readonly loginAvailable = signal(true);
  protected readonly loginDenied = signal(false);

  protected readonly sectionKey = signal<AdminSectionKey>('profile');
  protected readonly section = computed(
    () => this.sections.find((s) => s.key === this.sectionKey()) ?? this.sections[0],
  );
  protected readonly items = signal<AdminRecord[]>([]);
  protected readonly selection = signal<Selection>(null);
  protected readonly loading = signal(false);
  protected readonly busy = signal(false);
  protected readonly errors = signal<Record<string, string>>({});
  protected readonly notice = signal<{ kind: 'ok' | 'error'; text: string } | null>(null);

  /** Düzenleyicide açık kayıt */
  protected readonly current = computed<AdminRecord | null>(() => {
    const section = this.section();
    const selection = this.selection();
    if (section.single) return this.items()[0] ?? null;
    if (selection === 'new') return section.blank();
    return this.items().find((item) => item.id === selection) ?? null;
  });

  constructor() {
    // Oturum kontrolü yalnızca tarayıcıda (SSR'da çerez yok, panel de render edilmez)
    afterNextRender(() => {
      this.loginDenied.set(new URLSearchParams(this.document.location.search).get('login') === 'denied');
      this.checkSession();
    });
  }

  protected login(): void {
    this.document.location.href = this.repository.loginUrl;
  }

  protected logout(): void {
    this.repository.logout().subscribe({
      complete: () => {
        this.user.set(null);
        this.phase.set('locked');
      },
      error: () => this.phase.set('locked'),
    });
  }

  protected open(section: SectionDef): void {
    this.sectionKey.set(section.key);
    this.selection.set(null);
    this.errors.set({});
    this.notice.set(null);
    this.load();
  }

  protected select(selection: Selection): void {
    this.selection.set(selection);
    this.errors.set({});
    this.notice.set(null);
  }

  protected save(record: AdminRecord): void {
    const section = this.section();
    const selection = this.selection();
    this.busy.set(true);
    this.errors.set({});
    const request = section.single
      ? this.repository.saveProfile(record)
      : selection === 'new' || selection === null
        ? this.repository.create(section.key as AdminCollectionKey, record)
        : this.repository.update(section.key as AdminCollectionKey, selection, record);

    request.subscribe({
      next: (saved) => {
        this.busy.set(false);
        this.notice.set({ kind: 'ok', text: this.i18n.t('admin.saved') });
        if (section.single) {
          this.items.set([saved]);
        } else {
          this.load(saved.id ?? null);
        }
      },
      error: (error: AdminError) => this.fail(error),
    });
  }

  protected remove(): void {
    const selection = this.selection();
    if (typeof selection !== 'number') return;
    this.busy.set(true);
    this.repository.remove(this.sectionKey() as AdminCollectionKey, selection).subscribe({
      next: () => {
        this.busy.set(false);
        this.notice.set({ kind: 'ok', text: this.i18n.t('admin.deleted') });
        this.load();
      },
      error: (error: AdminError) => this.fail(error),
    });
  }

  /** Kaydı listede bir yukarı/aşağı taşır ve yeni sırayı kaydeder */
  protected move(index: number, delta: -1 | 1): void {
    const items = [...this.items()];
    const target = index + delta;
    if (target < 0 || target >= items.length) return;
    [items[index], items[target]] = [items[target], items[index]];
    this.items.set(items);
    this.repository
      .reorder(this.sectionKey() as AdminCollectionKey, items.map((item) => item.id as number))
      .subscribe({ error: (error: AdminError) => this.fail(error, true) });
  }

  private checkSession(): void {
    this.repository.me().subscribe({
      next: (user) => {
        this.user.set(user);
        this.phase.set('ready');
        this.load();
      },
      error: () => {
        this.phase.set('locked');
        this.repository.loginAvailable().subscribe({
          next: (available) => this.loginAvailable.set(available),
          error: () => this.loginAvailable.set(false),
        });
      },
    });
  }

  private load(select: number | null = null): void {
    const section = this.section();
    this.loading.set(true);
    const request: Observable<AdminRecord[]> = section.single
      ? this.repository.getProfile().pipe(map((profile) => [profile]))
      : this.repository.list(section.key as AdminCollectionKey);
    request.subscribe({
      next: (result) => {
        this.items.set(result);
        if (select !== null) this.selection.set(select);
        else if (!section.single && typeof this.selection() === 'number') {
          // Silinen kayıt seçiliyse seçimi kaldır
          const stillThere = this.items().some((item) => item.id === this.selection());
          if (!stillThere) this.selection.set(null);
        }
        this.loading.set(false);
      },
      error: (error: AdminError) => this.fail(error, true),
    });
  }

  private fail(error: AdminError, reload = false): void {
    this.busy.set(false);
    this.loading.set(false);
    if (error.code === 'UNAUTHORIZED') {
      // Oturum düştü: kilit ekranına dön
      this.user.set(null);
      this.phase.set('locked');
      return;
    }
    this.errors.set(error.fields ?? {});
    this.notice.set({ kind: 'error', text: error.message });
    if (reload) this.load();
  }
}
