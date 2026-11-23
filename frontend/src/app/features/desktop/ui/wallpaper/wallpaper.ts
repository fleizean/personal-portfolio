import { ChangeDetectionStrategy, Component } from '@angular/core';

interface Shard {
  points: string;
  fill: string;
  opacity: number;
}

interface Slab {
  /** Blok merkezi ve boyutu (viewBox 1600x900 biriminde) */
  cx: number;
  cy: number;
  w: number;
  h: number;
  /** Derece; bloklar sola yatık durur */
  rotate: number;
  /** Ön yüz gradyanı */
  face: 'slab-face' | 'slab-face-light' | 'slab-face-deep';
  /** Kalınlık (alt-sol kenarda görünen yan yüz) */
  depth: number;
}

/** Sunucu ve tarayıcı aynı deseni üretsin diye tohumlu, deterministik rastgele sayı üreteci */
function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Sol alttaki koyu, kristal kırıklı doku */
function buildShards(): Shard[] {
  const random = mulberry32(42);
  const fills = ['#0b2a5c', '#0f3a7a', '#123f86', '#0a2350', '#1a4fa0', '#0d6b8f'];
  const shards: Shard[] = [];
  for (let i = 0; i < 170; i++) {
    // Sol alt köşeye doğru yoğunlaşan dağılım
    const x = Math.pow(random(), 1.4) * 760;
    const y = 900 - Math.pow(random(), 1.2) * 620;
    if (y < 900 - (760 - x) * 0.9) continue;
    const size = 14 + random() * 46;
    const a = random() * Math.PI * 2;
    const p = [0, 1, 2].map((k) => {
      const angle = a + (k * Math.PI * 2) / 3 + (random() - 0.5) * 0.9;
      const r = size * (0.5 + random() * 0.6);
      return `${(x + Math.cos(angle) * r).toFixed(1)},${(y + Math.sin(angle) * r).toFixed(1)}`;
    });
    shards.push({
      points: p.join(' '),
      fill: fills[Math.floor(random() * fills.length)],
      opacity: 0.35 + random() * 0.5,
    });
  }
  return shards;
}

const SLABS: Slab[] = [
  // Sol üstteki büyük açık blok
  { cx: 380, cy: 60, w: 1000, h: 640, rotate: -26, face: 'slab-face-light', depth: 18 },
  // Sağdaki dev blok
  { cx: 1210, cy: 360, w: 720, h: 760, rotate: -24, face: 'slab-face', depth: 22 },
  // Soldaki uzun blok
  { cx: 250, cy: 560, w: 300, h: 520, rotate: -22, face: 'slab-face', depth: 16 },
  // Ortadaki küçük blok
  { cx: 640, cy: 470, w: 220, h: 200, rotate: -26, face: 'slab-face-light', depth: 12 },
  // Alt ortadaki camgöbeği blok
  { cx: 840, cy: 860, w: 420, h: 420, rotate: -24, face: 'slab-face-deep', depth: 20 },
];

/**
 * Masaüstü duvar kâğıdı: eğik 3B mavi bloklar, sol altta kristal doku, sağ altta mor
 * parlama ve ortada `fleizean` işareti. Tamamen SVG; görsel dosyası ve WebGL yok.
 */
@Component({
  selector: 'app-wallpaper',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'pointer-events-none absolute inset-0 overflow-hidden', 'aria-hidden': 'true' },
  templateUrl: './wallpaper.html',
  styleUrl: './wallpaper.css',
})
export class Wallpaper {
  protected readonly shards = buildShards();
  protected readonly slabs = SLABS;

  /** Bloğun ön yüzü (dönmeden önceki dikdörtgen) */
  protected faceX = (s: Slab) => s.cx - s.w / 2;
  protected faceY = (s: Slab) => s.cy - s.h / 2;

  /** Yan yüz: ön yüzün sol ve alt kenarından aşağı-sola uzanan kalınlık */
  protected sidePoints(s: Slab): string {
    const x0 = s.cx - s.w / 2;
    const y0 = s.cy - s.h / 2;
    const x1 = x0 + s.w;
    const y1 = y0 + s.h;
    const d = s.depth;
    return [
      `${x0},${y0}`,
      `${x0 - d},${y0 + d}`,
      `${x0 - d},${y1 + d}`,
      `${x1 - d},${y1 + d}`,
      `${x1},${y1}`,
      `${x0},${y1}`,
    ].join(' ');
  }
}
