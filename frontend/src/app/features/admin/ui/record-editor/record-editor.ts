import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  linkedSignal,
  output,
  signal,
} from '@angular/core';
import { LucidePlus, LucideTrash2, LucideUpload, LucideX } from '@lucide/angular';
import { AdminRepository, type AdminError, type AdminRecord, type Language } from '@domain';
import { I18n } from '@core/i18n/i18n.service';
import { SOCIAL_KINDS, type FieldDef, type SectionDef } from '../../model/admin-sections';

interface SocialRow {
  kind: string;
  label: string;
  url: string;
}

/**
 * Şemadan form çizen genel düzenleyici. Kaydın bir kopyası üzerinde çalışır; "Kaydet"e
 * basılana kadar asıl kayıt değişmez. Dile bağlı alanlar TR/EN sekmesiyle düzenlenir.
 */
@Component({
  selector: 'app-record-editor',
  imports: [LucidePlus, LucideTrash2, LucideUpload, LucideX],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './record-editor.html',
  host: { class: 'flex h-full min-h-0 flex-col' },
})
export class RecordEditor {
  readonly section = input.required<SectionDef>();
  readonly record = input.required<AdminRecord>();
  readonly errors = input<Record<string, string>>({});
  readonly busy = input(false);
  readonly deletable = input(false);

  readonly saved = output<AdminRecord>();
  readonly deleted = output<void>();

  protected readonly i18n = inject(I18n);
  private readonly repository = inject(AdminRepository);

  protected readonly languages: Language[] = ['tr', 'en'];
  protected readonly socialKinds = SOCIAL_KINDS;
  protected readonly language = signal<Language>('tr');
  protected readonly confirmingDelete = signal(false);
  protected readonly uploading = signal<string | null>(null);
  protected readonly uploadError = signal<string | null>(null);

  /** Kayıt değişince (başka kayıt seçilince) taslak sıfırlanır */
  protected readonly draft = linkedSignal(() => structuredClone(this.record()));

  protected readonly hasTranslatable = computed(() => this.section().fields.some((f) => f.translatable));

  /** Sekmede hata işareti: o dildeki alanlardan biri hatalı mı */
  protected readonly languageHasError = (language: Language) =>
    Object.keys(this.errors()).some((key) => key.startsWith(`${language}.`));

  protected path(field: FieldDef): string {
    return field.translatable ? `${this.language()}.${field.key}` : field.key;
  }

  protected error(field: FieldDef): string | null {
    const errors = this.errors();
    const own = errors[this.path(field)];
    if (own) return own;
    // Liste alanlarında ilk satır hatası (ör. "socials[1].url", "techStack[0]")
    const prefix = `${this.path(field)}[`;
    const nested = Object.keys(errors).find((key) => key.startsWith(prefix));
    return nested ? `${nested.slice(this.path(field).length)}: ${errors[nested]}` : null;
  }

  /** API hata kodunu okunur metne çevirir (ör. INVALID_URL); bilinmeyen kod olduğu gibi gösterilir */
  protected errorText(code: string): string {
    const key = `admin.errors.${code}`;
    const text = this.i18n.t(key);
    return text === key ? code : text;
  }

  protected value(field: FieldDef): unknown {
    const draft = this.draft();
    return field.translatable ? draft[this.language()]?.[field.key] : draft[field.key];
  }

  protected text(field: FieldDef): string {
    const value = this.value(field);
    if (Array.isArray(value)) return value.join(field.type === 'lines' ? '\n' : ', ');
    return typeof value === 'string' ? value : '';
  }

  protected set(field: FieldDef, value: unknown): void {
    const language = this.language();
    this.draft.update((draft) => {
      const next = structuredClone(draft);
      if (field.translatable) next[language] = { ...(next[language] ?? {}), [field.key]: value };
      else next[field.key] = value;
      return next;
    });
  }

  protected setFromInput(field: FieldDef, event: Event): void {
    const target = event.target as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;
    switch (field.type) {
      case 'checkbox':
        this.set(field, (target as HTMLInputElement).checked);
        break;
      case 'tags':
        this.set(field, target.value.split(',').map((v) => v.trim()).filter(Boolean));
        break;
      case 'lines':
        this.set(field, target.value.split('\n').map((v) => v.trim()).filter(Boolean));
        break;
      default:
        this.set(field, target.value);
    }
  }

  protected socials(field: FieldDef): SocialRow[] {
    const value = this.value(field);
    return Array.isArray(value) ? (value as SocialRow[]) : [];
  }

  protected updateSocial(field: FieldDef, index: number, key: keyof SocialRow, event: Event): void {
    const rows = this.socials(field).map((row, i) =>
      i === index ? { ...row, [key]: (event.target as HTMLInputElement).value } : row,
    );
    this.set(field, rows);
  }

  protected addSocial(field: FieldDef): void {
    this.set(field, [...this.socials(field), { kind: 'github', label: '', url: 'https://' }]);
  }

  protected removeSocial(field: FieldDef, index: number): void {
    this.set(field, this.socials(field).filter((_, i) => i !== index));
  }

  protected upload(field: FieldDef, event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    input.value = '';
    if (!file) return;
    this.uploading.set(field.key);
    this.uploadError.set(null);
    this.repository.uploadImage(file).subscribe({
      next: (path) => {
        this.set(field, path);
        this.uploading.set(null);
      },
      error: (error: AdminError) => {
        this.uploadError.set(error.fields?.['file'] ?? error.message);
        this.uploading.set(null);
      },
    });
  }

  protected save(event: Event): void {
    event.preventDefault();
    this.saved.emit(this.draft());
  }

  protected requestDelete(): void {
    if (this.confirmingDelete()) {
      this.confirmingDelete.set(false);
      this.deleted.emit();
    } else {
      this.confirmingDelete.set(true);
    }
  }
}
