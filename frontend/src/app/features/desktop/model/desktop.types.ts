export type Glyph =
  | 'home'
  | 'folder'
  | 'projects'
  | 'journey'
  | 'stack'
  | 'school'
  | 'blog'
  | 'trash'
  | 'text'
  | 'pdf'
  | 'script'
  | 'link';

/** Metin görüntüleyicide açılan bir dosyanın içeriği */
export interface Doc {
  title: string;
  subtitle?: string;
  meta?: { label: string; value: string }[];
  body?: string;
  list?: string[];
  tags?: string[];
  links?: { label: string; href: string }[];
  image?: string;
}

export type OpenAction =
  | { type: 'about' }
  | { type: 'doc'; doc: Doc }
  | { type: 'pdf'; src: string }
  | { type: 'external'; href: string };

export interface FsDir {
  kind: 'dir';
  name: string;
  glyph?: Glyph;
  children: FsNode[];
  emptyText?: string;
}

export interface FsFile {
  kind: 'file';
  name: string;
  glyph: Glyph;
  open: OpenAction;
}

export type FsNode = FsDir | FsFile;

/** Dosya yöneticisinin gezebildiği kökler */
export type FsRoot = 'home' | 'trash';

export interface FsLocation {
  root: FsRoot;
  path: string[];
}

export type WindowContent =
  | { app: 'files'; location: FsLocation }
  | { app: 'about' }
  | { app: 'doc'; doc: Doc }
  | { app: 'pdf' };

export interface WindowState {
  id: string;
  title: string;
  glyph: Glyph;
  content: WindowContent;
  workspace: number;
  /** null: çalışma alanında ortalanır; sürüklenince piksele çevrilir */
  x: number | null;
  y: number | null;
  w: number;
  h: number;
  z: number;
  minimized: boolean;
  maximized: boolean;
}

export type OpenRequest = Pick<WindowState, 'id' | 'title' | 'glyph' | 'content' | 'w' | 'h'> &
  Partial<Pick<WindowState, 'x' | 'y'>>;
