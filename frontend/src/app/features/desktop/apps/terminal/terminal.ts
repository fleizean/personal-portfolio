import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  afterNextRender,
  afterRenderEffect,
  computed,
  inject,
  input,
  output,
  signal,
  viewChild,
} from '@angular/core';
import type { Profile } from '@domain';
import { I18n } from '@core/i18n/i18n.service';
import { ThemeService } from '@core/theme/theme.service';
import type { FsDir, FsFile, FsLocation } from '../../model/desktop.types';
import {
  type ShellContext,
  type ShellLine,
  complete,
  displayPath,
  execute,
} from '../../model/shell';

interface Entry {
  /** Girilen komut (istem satırıyla birlikte gösterilir); çıktı satırlarında yok */
  command?: { cwd: string; text: string };
  line?: ShellLine;
}

/** Sanal dosya sisteminde gezinilen terminal; komut yorumlama model/shell.ts içinde */
@Component({
  selector: 'app-terminal',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './terminal.html',
  host: {
    class: 'os-mono flex h-full flex-col bg-[#14161d] text-[13px] leading-relaxed text-slate-200',
    '(click)': 'focusInput()',
  },
})
export class Terminal {
  readonly home = input.required<FsDir>();
  readonly profile = input<Profile | null>(null);

  readonly fileOpened = output<FsFile>();
  readonly folderOpened = output<{ location: FsLocation; dir: FsDir }>();
  readonly musicOpened = output<void>();
  readonly easterEgg = output<void>();
  readonly closed = output<void>();

  protected readonly i18n = inject(I18n);
  private readonly theme = inject(ThemeService);
  private readonly screen = viewChild.required<ElementRef<HTMLElement>>('screen');
  private readonly field = viewChild.required<ElementRef<HTMLInputElement>>('field');

  /** Çıktı türüne göre renk (Kali terminal paleti) */
  protected readonly lineClass: Record<ShellLine['kind'], string> = {
    out: 'text-slate-200',
    err: 'text-[#ff6b6b]',
    dir: 'font-bold text-[#3e8bff]',
    file: 'text-white',
    exec: 'text-[#5fd38d]',
    accent: 'font-bold text-white',
    muted: 'text-slate-500',
  };

  protected readonly cwd = signal<string[]>([]);
  protected readonly entries = signal<Entry[]>([
    { line: { kind: 'accent', text: 'fleizeanOS 1.0 — fsh' } },
    { line: { kind: 'muted', text: '' } },
  ]);
  protected readonly draft = signal('');
  protected readonly prompt = computed(() => displayPath(this.cwd()));
  private readonly history: string[] = [];
  private historyIndex = -1;

  constructor() {
    // İlk açılışta yardım ipucu (dile göre)
    this.entries.update((entries) => [...entries, { line: { kind: 'muted', text: this.i18n.t('terminal.welcome') } }]);
    // Pencere açılır açılmaz yazılabilsin
    afterNextRender(() => this.field().nativeElement.focus({ preventScroll: true }));
    // Yeni çıktı gelince en alta kaydır
    afterRenderEffect(() => {
      this.entries();
      const screen = this.screen().nativeElement;
      screen.scrollTop = screen.scrollHeight;
    });
  }

  protected focusInput(): void {
    // Metin seçiliyken odağı çalma (kopyalamaya izin ver)
    if (this.field().nativeElement.ownerDocument.getSelection()?.toString()) return;
    this.field().nativeElement.focus({ preventScroll: true });
  }

  private context(): ShellContext {
    return { home: this.home(), profile: this.profile(), t: (key, params) => this.i18n.t(key, params) };
  }

  protected onKeydown(event: KeyboardEvent): void {
    switch (event.key) {
      case 'Enter':
        event.preventDefault();
        this.run(this.draft());
        break;
      case 'Tab':
        event.preventDefault();
        this.draft.set(complete(this.context(), this.cwd(), this.draft()));
        break;
      case 'ArrowUp':
        event.preventDefault();
        this.browseHistory(1);
        break;
      case 'ArrowDown':
        event.preventDefault();
        this.browseHistory(-1);
        break;
      case 'l':
        if (event.ctrlKey) {
          event.preventDefault();
          this.entries.set([]);
        }
        break;
      case 'c':
        if (event.ctrlKey && !this.field().nativeElement.ownerDocument.getSelection()?.toString()) {
          event.preventDefault();
          this.echo(`${this.draft()}^C`);
          this.draft.set('');
        }
        break;
    }
  }

  private browseHistory(step: number): void {
    if (this.history.length === 0) return;
    this.historyIndex = Math.min(Math.max(this.historyIndex + step, -1), this.history.length - 1);
    this.draft.set(this.historyIndex === -1 ? '' : this.history[this.history.length - 1 - this.historyIndex]);
  }

  private echo(text: string): void {
    this.entries.update((entries) => [...entries, { command: { cwd: this.prompt(), text } }]);
  }

  private run(text: string): void {
    this.echo(text);
    this.draft.set('');
    this.historyIndex = -1;
    if (text.trim()) this.history.push(text.trim());

    const result = execute(this.context(), this.cwd(), this.history, text);
    this.cwd.set(result.cwd);
    this.entries.update((entries) => [...entries, ...result.lines.map((line) => ({ line }))]);

    for (const effect of result.effects) {
      switch (effect.type) {
        case 'clear':
          this.entries.set([]);
          break;
        case 'exit':
          this.closed.emit();
          break;
        case 'open-file':
          this.fileOpened.emit(effect.file);
          break;
        case 'open-folder':
          this.folderOpened.emit({ location: { root: 'home', path: effect.path }, dir: effect.dir });
          break;
        case 'open-app':
          this.musicOpened.emit();
          break;
        case 'language':
          this.i18n.setLanguage(effect.language);
          break;
        case 'theme':
          this.theme.toggle();
          break;
        case 'easter-egg':
          this.easterEgg.emit();
          break;
      }
    }
  }
}
