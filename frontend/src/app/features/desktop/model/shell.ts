import type { Profile } from '@domain';
import type { Doc, FsDir, FsFile, FsNode } from './desktop.types';

/** Terminal ekranındaki tek satır; tür renklendirmeyi belirler */
export interface ShellLine {
  kind: 'out' | 'err' | 'dir' | 'file' | 'exec' | 'accent' | 'muted';
  text: string;
}

/** Komutun masaüstünden istediği iş */
export type ShellEffect =
  | { type: 'open-file'; file: FsFile }
  | { type: 'open-folder'; path: string[]; dir: FsDir }
  | { type: 'open-app'; app: 'music' }
  | { type: 'language'; language: 'tr' | 'en' }
  | { type: 'theme' }
  | { type: 'clear' }
  | { type: 'exit' };

export interface ShellResult {
  lines: ShellLine[];
  effects: ShellEffect[];
}

export interface ShellContext {
  home: FsDir;
  profile: Profile | null;
  t: (key: string, params?: Record<string, string | number>) => string;
}

export const HOME_PATH = '/home/fleizean';

const COMMANDS = [
  'help', 'ls', 'cd', 'pwd', 'cat', 'open', 'tree', 'clear', 'whoami', 'hostname',
  'date', 'echo', 'neofetch', 'music', 'lang', 'theme', 'history', 'exit', 'sudo',
] as const;

/** Tırnaklı argümanları da ayırır: open "2025 BKPrime Technology.md" */
export function tokenize(line: string): string[] {
  const tokens: string[] = [];
  const pattern = /"([^"]*)"|'([^']*)'|(\S+)/g;
  for (const match of line.matchAll(pattern)) tokens.push(match[1] ?? match[2] ?? match[3]);
  return tokens;
}

/** Göreli/mutlak yolu ev dizinine göre segmentlere çevirir; ev dizininin dışına çıkılamaz */
export function resolvePath(cwd: string[], input: string | undefined): string[] {
  if (!input || input === '~') return [];
  let path = [...cwd];
  let rest = input;
  if (rest.startsWith('~/')) {
    path = [];
    rest = rest.slice(2);
  } else if (rest.startsWith(HOME_PATH)) {
    path = [];
    rest = rest.slice(HOME_PATH.length);
  } else if (rest.startsWith('/')) {
    path = [];
  }
  for (const segment of rest.split('/')) {
    if (!segment || segment === '.') continue;
    if (segment === '..') path.pop();
    else path.push(segment);
  }
  return path;
}

export function findNode(home: FsDir, path: string[]): FsNode | null {
  let node: FsNode = home;
  for (const segment of path) {
    if (node.kind !== 'dir') return null;
    const next: FsNode | undefined = node.children.find((child) => child.name === segment);
    if (!next) return null;
    node = next;
  }
  return node;
}

export const displayPath = (path: string[]) => (path.length ? `~/${path.join('/')}` : '~');

/** Tab tamamlama: son kelimeyi komut ya da yol olarak tamamlar */
export function complete(context: ShellContext, cwd: string[], line: string): string {
  const endsWithSpace = /\s$/.test(line);
  const tokens = tokenize(line);
  const partial = endsWithSpace ? '' : (tokens.at(-1) ?? '');
  const head = endsWithSpace ? line : line.slice(0, line.length - partial.length);

  if (tokens.length <= 1 && !endsWithSpace) {
    const matches = COMMANDS.filter((c) => c.startsWith(partial));
    return matches.length === 1 ? `${matches[0]} ` : line;
  }

  const slash = partial.lastIndexOf('/');
  const dirPart = slash >= 0 ? partial.slice(0, slash + 1) : '';
  const namePart = slash >= 0 ? partial.slice(slash + 1) : partial;
  const dir = findNode(context.home, resolvePath(cwd, dirPart || '.'));
  if (!dir || dir.kind !== 'dir') return line;

  const matches = dir.children.filter((child) => child.name.startsWith(namePart));
  if (matches.length !== 1) return line;
  const match = matches[0];
  const name = match.name.includes(' ') ? `"${dirPart}${match.name}` : `${dirPart}${match.name}`;
  const suffix = match.kind === 'dir' ? '/' : match.name.includes(' ') ? '" ' : ' ';
  return `${head}${name}${suffix}`;
}

function docLines(doc: Doc): ShellLine[] {
  const lines: ShellLine[] = [{ kind: 'accent', text: `# ${doc.title}` }];
  if (doc.subtitle) lines.push({ kind: 'muted', text: `> ${doc.subtitle}` });
  for (const meta of doc.meta ?? []) lines.push({ kind: 'out', text: `${meta.label}: ${meta.value}` });
  if (doc.body) lines.push({ kind: 'out', text: '' }, { kind: 'out', text: doc.body });
  for (const item of doc.list ?? []) lines.push({ kind: 'out', text: `- ${item}` });
  if (doc.tags?.length) lines.push({ kind: 'exec', text: doc.tags.map((t) => `\`${t}\``).join(' ') });
  for (const link of doc.links ?? []) lines.push({ kind: 'muted', text: `[${link.label}](${link.href})` });
  return lines;
}

function treeLines(dir: FsDir, prefix = '', depth = 0): ShellLine[] {
  const lines: ShellLine[] = [];
  dir.children.forEach((child, index) => {
    const last = index === dir.children.length - 1;
    lines.push({
      kind: child.kind === 'dir' ? 'dir' : 'file',
      text: `${prefix}${last ? '└── ' : '├── '}${child.name}${child.kind === 'dir' ? '/' : ''}`,
    });
    if (child.kind === 'dir' && depth < 2) {
      lines.push(...treeLines(child, `${prefix}${last ? '    ' : '│   '}`, depth + 1));
    }
  });
  return lines;
}

const NEOFETCH_LOGO = [
  '      ______  ',
  '     / ____/  ',
  '    / /_      ',
  '   / __/      ',
  '  /_/   OS    ',
  '              ',
];

/** Bir komut satırını çalıştırır; durum (cwd) dışarıda tutulur, sonuç saf veridir */
export function execute(
  context: ShellContext,
  cwd: string[],
  history: string[],
  line: string,
): ShellResult & { cwd: string[] } {
  const { t } = context;
  const [command, ...args] = tokenize(line.trim());
  const out = (lines: ShellLine[], effects: ShellEffect[] = [], nextCwd = cwd) => ({ lines, effects, cwd: nextCwd });
  const err = (text: string) => out([{ kind: 'err', text }]);

  if (!command) return out([]);

  switch (command) {
    case 'help':
      return out(
        COMMANDS.filter((c) => c !== 'sudo').map((c) => ({
          kind: 'out' as const,
          text: `  ${c.padEnd(10)} ${t(`terminal.help.${c}`)}`,
        })),
      );

    case 'ls': {
      const target = args.find((a) => !a.startsWith('-'));
      const node = findNode(context.home, resolvePath(cwd, target ?? '.'));
      if (!node) return err(t('terminal.errors.not_found', { cmd: 'ls', path: target ?? '.' }));
      if (node.kind === 'file') return out([{ kind: 'file', text: node.name }]);
      if (node.children.length === 0) return out([{ kind: 'muted', text: node.emptyText ?? '' }]);
      return out(
        node.children.map((child) => ({
          kind: child.kind === 'dir' ? ('dir' as const) : child.glyph === 'script' ? ('exec' as const) : ('file' as const),
          text: child.kind === 'dir' ? `${child.name}/` : child.name,
        })),
      );
    }

    case 'cd': {
      const path = resolvePath(cwd, args[0]);
      const node = findNode(context.home, path);
      if (!node) return err(t('terminal.errors.not_found', { cmd: 'cd', path: args[0] ?? '' }));
      if (node.kind !== 'dir') return err(t('terminal.errors.not_dir', { path: args[0] ?? '' }));
      return out([], [], path);
    }

    case 'pwd':
      return out([{ kind: 'out', text: cwd.length ? `${HOME_PATH}/${cwd.join('/')}` : HOME_PATH }]);

    case 'cat': {
      if (!args[0]) return err(t('terminal.errors.missing_operand', { cmd: 'cat' }));
      const node = findNode(context.home, resolvePath(cwd, args[0]));
      if (!node) return err(t('terminal.errors.not_found', { cmd: 'cat', path: args[0] }));
      if (node.kind === 'dir') return err(t('terminal.errors.is_dir', { cmd: 'cat', path: args[0] }));
      switch (node.open.type) {
        case 'doc':
          return out(docLines(node.open.doc));
        case 'external':
          return out([{ kind: 'out', text: `[InternetShortcut]` }, { kind: 'out', text: `URL=${node.open.href}` }]);
        case 'about': {
          const p = context.profile;
          if (!p) return out([]);
          return out([
            { kind: 'accent', text: `# ${p.greeting}` },
            { kind: 'out', text: `${p.role} ${p.company}` },
            { kind: 'out', text: '' },
            { kind: 'out', text: p.description },
            { kind: 'out', text: '' },
            ...p.socials.map((s) => ({ kind: 'muted' as const, text: `[${s.label}](${s.url})` })),
          ]);
        }
        case 'pdf':
          return err(t('terminal.errors.binary', { path: args[0] }));
      }
      return out([]);
    }

    case 'open': {
      if (!args[0]) return err(t('terminal.errors.missing_operand', { cmd: 'open' }));
      const path = resolvePath(cwd, args[0]);
      const node = findNode(context.home, path);
      if (!node) return err(t('terminal.errors.not_found', { cmd: 'open', path: args[0] }));
      return node.kind === 'dir'
        ? out([], [{ type: 'open-folder', path, dir: node }])
        : out([], [{ type: 'open-file', file: node }]);
    }

    case 'tree': {
      const node = findNode(context.home, resolvePath(cwd, args[0] ?? '.'));
      if (!node || node.kind !== 'dir') return err(t('terminal.errors.not_found', { cmd: 'tree', path: args[0] ?? '.' }));
      return out([{ kind: 'dir', text: args[0] ?? '.' }, ...treeLines(node)]);
    }

    case 'clear':
      return out([], [{ type: 'clear' }]);

    case 'whoami':
      return out([{ kind: 'out', text: 'guest' }]);

    case 'hostname':
      return out([{ kind: 'out', text: 'fleizeanOS' }]);

    case 'date':
      return out([{ kind: 'out', text: new Date().toString() }]);

    case 'echo':
      return out([{ kind: 'out', text: args.join(' ') }]);

    case 'history':
      return out(history.map((entry, i) => ({ kind: 'out' as const, text: `${String(i + 1).padStart(4)}  ${entry}` })));

    case 'neofetch': {
      const p = context.profile;
      const info = [
        `guest@fleizeanOS`,
        `----------------`,
        `OS: fleizeanOS (Angular 22)`,
        `Host: fleizean.dev`,
        `Shell: fsh 1.0`,
        `Owner: ${p?.name ?? 'Enes Yağız'}`,
        `Role: ${p ? `${p.role} ${p.company}` : 'full stack developer'}`,
        `Location: ${p?.location ?? ''}`,
      ];
      return out(
        info.map((text, i) => ({
          kind: i === 0 ? ('accent' as const) : ('out' as const),
          text: `${NEOFETCH_LOGO[i] ?? ''.padEnd(14)}${text}`,
        })),
      );
    }

    case 'music':
      return out([{ kind: 'muted', text: t('terminal.music') }], [{ type: 'open-app', app: 'music' }]);

    case 'lang': {
      const language = args[0];
      if (language !== 'tr' && language !== 'en') return err(t('terminal.errors.lang_usage'));
      return out([], [{ type: 'language', language }]);
    }

    case 'theme':
      return out([], [{ type: 'theme' }]);

    case 'exit':
      return out([], [{ type: 'exit' }]);

    case 'sudo':
      return err(t('terminal.errors.sudo'));

    default:
      return err(t('terminal.errors.unknown', { cmd: command }));
  }
}
