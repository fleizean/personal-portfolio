import { ImageResponse } from 'next/og';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

export const alt = 'Enes Yağız — full stack developer';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

// Sosyal medya önizleme görseli; build sırasında bir kez üretilir
export default async function OpengraphImage() {
  const portrait = await readFile(join(process.cwd(), 'public/hero/hero.png'));
  const portraitSrc = `data:image/png;base64,${portrait.toString('base64')}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 90px',
          background: 'linear-gradient(135deg, #0a0a0a 0%, #2a2a2a 60%, #555555 100%)',
          color: '#ededed',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', maxWidth: 600 }}>
          <div style={{ fontSize: 30, color: '#9ca3af' }}>fleizean.dev</div>
          <div style={{ fontSize: 84, fontWeight: 700, marginTop: 20, lineHeight: 1.05 }}>
            Enes Yağız
          </div>
          <div style={{ fontSize: 38, marginTop: 24, color: '#d1d5db' }}>full stack developer</div>
          <div style={{ fontSize: 26, marginTop: 20, color: '#9ca3af' }}>
            software, design and my life
          </div>
        </div>
        <img
          src={portraitSrc}
          alt=""
          width={380}
          height={380}
          style={{ objectFit: 'cover', border: '6px solid #ededed' }}
        />
      </div>
    ),
    size
  );
}
