import {
  type JourneyEntry,
  type Language,
  type PortfolioContent,
  type Project,
  TECH_CATEGORIES,
} from '@domain';
import type { FsDir, FsFile, FsLocation, FsNode } from './desktop.types';

/** Çeviri fonksiyonu; dosya sistemi kurulurken klasör ve etiket adları için kullanılır */
export type Translate = (key: string) => string;

const fileName = (name: string, ext: string) => `${name.replace(/[/\\]/g, '-').trim()}.${ext}`;

const hostOf = (url: string) => url.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '');

export const cvSrc = (language: Language) =>
  language === 'tr' ? '/cv/ENES_YAGIZ_TR.pdf' : '/cv/ENES_YAGIZ_EN.pdf';

const projectFile = (t: Translate, p: Project): FsFile => ({
  kind: 'file',
  name: fileName(p.name, 'md'),
  glyph: 'text',
  open: {
    type: 'doc',
    doc: {
      title: p.name,
      subtitle: p.year,
      meta: [{ label: 'status', value: t(`project.status.${p.status}`) }],
      body: p.description,
      tags: p.techStack,
      links: [
        ...(p.githubUrl ? [{ label: t('project.links.github'), href: p.githubUrl }] : []),
        ...(p.liveUrl ? [{ label: t('project.links.live_demo'), href: p.liveUrl }] : []),
      ],
      image: p.image,
    },
  },
});

const journeyFile = (j: JourneyEntry): FsFile => ({
  kind: 'file',
  name: fileName(`${j.period.slice(0, 4)} ${j.place}`, 'md'),
  glyph: 'text',
  open: {
    type: 'doc',
    doc: {
      title: j.title,
      subtitle: `${j.place} · ${j.period}`,
      body: j.description,
      links: j.link ? [{ label: hostOf(j.link), href: j.link }] : [],
      image: j.image,
    },
  },
});

/** Domain içeriğinden masaüstündeki sanal ev klasörünü kurar */
export function buildHome(content: PortfolioContent, language: Language, t: Translate): FsDir {
  const { profile, projects, journey, technologies, school } = content;

  const projectsDir: FsDir = {
    kind: 'dir',
    name: 'projects',
    glyph: 'projects',
    children: [
      {
        kind: 'dir',
        name: t('os.folders.current'),
        children: projects.filter((p) => p.current).map((p) => projectFile(t, p)),
      },
      {
        kind: 'dir',
        name: t('os.folders.archive'),
        children: projects.filter((p) => !p.current).map((p) => projectFile(t, p)),
      },
    ],
  };

  const stackDir: FsDir = {
    kind: 'dir',
    name: 'stack',
    glyph: 'stack',
    children: TECH_CATEGORIES.map<FsDir>((category) => ({
      kind: 'dir',
      name: t(`tech.categories.${category}`).toLowerCase().replace(/\s+/g, '-'),
      children: technologies
        .filter((item) => item.category === category)
        .map<FsFile>((item) => ({
          kind: 'file',
          name: fileName(item.name, 'md'),
          glyph: 'text',
          open: {
            type: 'doc',
            doc: {
              title: item.name,
              subtitle: t(`tech.categories.${category}`),
              body: item.description,
              links: item.link ? [{ label: hostOf(item.link), href: item.link }] : [],
            },
          },
        })),
    })),
  };

  const schoolDir: FsDir = {
    kind: 'dir',
    name: 'school',
    glyph: 'school',
    children: school.map<FsFile>((s) => ({
      kind: 'file',
      name: fileName(s.title, 'md'),
      glyph: 'text',
      open: {
        type: 'doc',
        doc: {
          title: s.title,
          subtitle: s.period,
          body: s.description,
          list: s.highlights,
          links: s.link ? [{ label: hostOf(s.link), href: s.link }] : [],
          image: s.image,
        },
      },
    })),
  };

  const contact: FsFile = {
    kind: 'file',
    name: 'contact.sh',
    glyph: 'script',
    open: {
      type: 'doc',
      doc: {
        title: profile.contactTitle,
        body: profile.contactText,
        meta: [
          { label: t('contact.email'), value: profile.email },
          { label: t('contact.location'), value: profile.location },
        ],
        links: [
          { label: t('contact.send_email'), href: `mailto:${profile.email}` },
          ...profile.socials
            .filter((s) => s.kind === 'github' || s.kind === 'linkedin')
            .map((s) => ({ label: s.label, href: s.url })),
        ],
      },
    },
  };

  return {
    kind: 'dir',
    name: 'fleizean',
    glyph: 'home',
    children: [
      projectsDir,
      { kind: 'dir', name: 'journey', glyph: 'journey', children: journey.map(journeyFile) },
      stackDir,
      schoolDir,
      {
        kind: 'dir',
        name: 'blog',
        glyph: 'blog',
        children: [
          {
            kind: 'file',
            name: 'medium.url',
            glyph: 'link',
            open: { type: 'external', href: 'https://medium.com/@fleizean' },
          },
        ],
      },
      { kind: 'file', name: 'README.md', glyph: 'text', open: { type: 'about' } },
      { kind: 'file', name: 'cv.pdf', glyph: 'pdf', open: { type: 'pdf', src: cvSrc(language) } },
      contact,
    ],
  };
}

export const buildTrash = (t: Translate): FsDir => ({
  kind: 'dir',
  name: t('os.places.trash'),
  glyph: 'trash',
  children: [],
  emptyText: t('os.files.trash_empty'),
});

export function resolveDir(root: FsDir, path: string[]): FsDir | null {
  let current: FsDir = root;
  for (const segment of path) {
    const next: FsNode | undefined = current.children.find(
      (child) => child.kind === 'dir' && child.name === segment,
    );
    if (!next || next.kind !== 'dir') return null;
    current = next;
  }
  return current;
}

export const sameLocation = (a: FsLocation, b: FsLocation) =>
  a.root === b.root && a.path.join('/') === b.path.join('/');
