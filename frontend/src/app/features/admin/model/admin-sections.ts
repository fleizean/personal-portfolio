import type { AdminRecord, AdminSectionKey } from '@domain';

export type FieldType =
  | 'text'
  | 'textarea'
  | 'url'
  | 'email'
  | 'select'
  | 'checkbox'
  /** Virgülle ayrılmış kısa değerler (ör. teknoloji listesi) */
  | 'tags'
  /** Her satırı bir madde olan liste */
  | 'lines'
  | 'image'
  | 'socials';

export interface FieldDef {
  key: string;
  type: FieldType;
  /** true ise değer "tr" / "en" altında, dil sekmesine göre düzenlenir */
  translatable?: boolean;
  options?: readonly string[];
}

export interface SectionDef {
  key: AdminSectionKey;
  /** Profil gibi tek kayıtlı bölümler listelenmez ve sıralanmaz */
  single?: boolean;
  fields: FieldDef[];
  /** Listede görünen başlık */
  titleOf: (record: AdminRecord) => string;
  /** "Yeni" ile açılan boş kayıt */
  blank: () => AdminRecord;
}

const text = (record: AdminRecord, ...path: string[]): string => {
  let value: unknown = record;
  for (const key of path) value = (value as Record<string, unknown> | undefined)?.[key];
  return typeof value === 'string' && value.trim() ? value : '—';
};

export const PROJECT_STATUSES = ['development', 'production', 'completed', 'ongoing'] as const;
export const JOURNEY_KINDS = ['work', 'education', 'project', 'personal', 'other'] as const;
export const TECH_CATEGORY_OPTIONS = ['frontend', 'backend', 'database', 'devops', 'learning'] as const;
export const SOCIAL_KINDS = ['github', 'linkedin', 'youtube', 'intra42'] as const;

export const ADMIN_SECTIONS: SectionDef[] = [
  {
    key: 'profile',
    single: true,
    titleOf: (r) => text(r, 'name'),
    blank: () => ({}),
    fields: [
      { key: 'name', type: 'text' },
      { key: 'email', type: 'email' },
      { key: 'greeting', type: 'text', translatable: true },
      { key: 'role', type: 'text', translatable: true },
      { key: 'company', type: 'text', translatable: true },
      { key: 'description', type: 'textarea', translatable: true },
      { key: 'portraitAlt', type: 'text', translatable: true },
      { key: 'location', type: 'text', translatable: true },
      { key: 'contactTitle', type: 'text', translatable: true },
      { key: 'contactText', type: 'textarea', translatable: true },
      { key: 'socials', type: 'socials' },
    ],
  },
  {
    key: 'projects',
    titleOf: (r) => text(r, 'name'),
    blank: () => ({
      name: '',
      year: String(new Date().getFullYear()),
      status: 'development',
      techStack: [],
      current: true,
      tr: { description: '' },
      en: { description: '' },
    }),
    fields: [
      { key: 'name', type: 'text' },
      { key: 'year', type: 'text' },
      { key: 'status', type: 'select', options: PROJECT_STATUSES },
      { key: 'current', type: 'checkbox' },
      { key: 'techStack', type: 'tags' },
      { key: 'githubUrl', type: 'url' },
      { key: 'liveUrl', type: 'url' },
      { key: 'image', type: 'image' },
      { key: 'description', type: 'textarea', translatable: true },
    ],
  },
  {
    key: 'journey',
    titleOf: (r) => `${text(r, 'tr', 'title')} · ${text(r, 'tr', 'place')}`,
    blank: () => ({
      kind: 'work',
      current: false,
      tr: { title: '', place: '', period: '', description: '' },
      en: { title: '', place: '', period: '', description: '' },
    }),
    fields: [
      { key: 'kind', type: 'select', options: JOURNEY_KINDS },
      { key: 'current', type: 'checkbox' },
      { key: 'link', type: 'url' },
      { key: 'image', type: 'image' },
      { key: 'title', type: 'text', translatable: true },
      { key: 'place', type: 'text', translatable: true },
      { key: 'period', type: 'text', translatable: true },
      { key: 'description', type: 'textarea', translatable: true },
    ],
  },
  {
    key: 'technologies',
    titleOf: (r) => text(r, 'name'),
    blank: () => ({ name: '', category: 'frontend', tr: { description: '' }, en: { description: '' } }),
    fields: [
      { key: 'name', type: 'text' },
      { key: 'category', type: 'select', options: TECH_CATEGORY_OPTIONS },
      { key: 'link', type: 'url' },
      { key: 'description', type: 'textarea', translatable: true },
    ],
  },
  {
    key: 'school',
    titleOf: (r) => text(r, 'tr', 'title'),
    blank: () => ({
      tr: { title: '', period: '', description: '', highlights: [] },
      en: { title: '', period: '', description: '', highlights: [] },
    }),
    fields: [
      { key: 'link', type: 'url' },
      { key: 'image', type: 'image' },
      { key: 'title', type: 'text', translatable: true },
      { key: 'period', type: 'text', translatable: true },
      { key: 'description', type: 'textarea', translatable: true },
      { key: 'highlights', type: 'lines', translatable: true },
      { key: 'reflection', type: 'textarea', translatable: true },
    ],
  },
  {
    key: 'tracks',
    titleOf: (r) => `${text(r, 'artist')} — ${text(r, 'title')}`,
    blank: () => ({ title: '', artist: '', youtube: '' }),
    fields: [
      { key: 'title', type: 'text' },
      { key: 'artist', type: 'text' },
      { key: 'youtube', type: 'url' },
    ],
  },
];
