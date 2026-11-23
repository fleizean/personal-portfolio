import { Injectable, afterNextRender, signal } from '@angular/core';

const STORAGE_KEY = 'musicCompleted';
const GLITCH_MS = 1000;
const SWAP_AT_MS = 250;

/**
 * Mr. Robot sürprizi: terminalde `shutdown -r` ile açılır, README'deki portre glitch
 * efektiyle değişir. Seçim tarayıcıda saklanır (eski sitedeki anahtarla uyumlu).
 */
@Injectable()
export class EasterEggStore {
  readonly unlocked = signal(false);
  readonly glitching = signal(false);

  constructor() {
    // localStorage yalnızca tarayıcıda; hidrasyon bozulmasın diye ilk çizimden sonra okunur
    afterNextRender(() => {
      try {
        this.unlocked.set(localStorage.getItem(STORAGE_KEY) === 'true');
      } catch {
        // depolama kapalıysa sürpriz yalnızca bu oturumda görünür
      }
    });
  }

  unlock(): void {
    try {
      localStorage.setItem(STORAGE_KEY, 'true');
    } catch {
      // depolama kapalı olabilir
    }
    this.glitching.set(true);
    setTimeout(() => this.unlocked.set(true), SWAP_AT_MS);
    setTimeout(() => this.glitching.set(false), GLITCH_MS);
  }
}
