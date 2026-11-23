import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';
import express from 'express';
import { createHash } from 'node:crypto';
import { join } from 'node:path';

const browserDistFolder = join(import.meta.dirname, '../browser');

const app = express();
const angularApp = new AngularNodeAppEngine();

// Kullanılan sunucu yazılımını ifşa etme
app.disable('x-powered-by');

/** Çalıştırılabilir satır içi betikler; src'li betikler ve veri blokları (JSON) hariç */
const INLINE_SCRIPT = /<script(?![^>]*\ssrc=)([^>]*)>([\s\S]*?)<\/script>/gi;
const DATA_BLOCK_TYPE = /\stype=["']?application\/(?:ld\+)?json/i;

/**
 * İçerik güvenlik politikası. Satır içi betiklere yalnızca bu yanıttaki içeriklerinin
 * hash'iyle izin verilir; araya enjekte edilmiş bir betik çalışmaz. (Angular'ın autoCsp
 * özelliği SSR ile birlikte kullanılamadığı için hash'ler burada hesaplanır.)
 */
function contentSecurityPolicy(html: string): string {
  const hashes = new Set<string>();
  for (const [, attributes, body] of html.matchAll(INLINE_SCRIPT)) {
    if (DATA_BLOCK_TYPE.test(attributes) || !body.trim()) continue;
    hashes.add(`'sha256-${createHash('sha256').update(body).digest('base64')}'`);
  }
  return [
    "default-src 'self'",
    `script-src 'self' ${[...hashes].join(' ')}`.trim(),
    // Angular bileşen stilleri ve SSR'daki style öznitelikleri satır içi
    "style-src 'self' 'unsafe-inline'",
    // data: duvar kâğıdındaki grain dokusu; GitHub avatarı yönetim panelinde
    "img-src 'self' data: https://avatars.githubusercontent.com",
    "font-src 'self'",
    "connect-src 'self'",
    // Müzik çalar (YouTube gizlilik modu) ve CV PDF görüntüleyici
    "frame-src 'self' https://www.youtube-nocookie.com",
    "frame-ancestors 'self'",
    "base-uri 'self'",
    "form-action 'self'",
    "object-src 'none'",
  ].join('; ');
}

/**
 * Alan adı doğrulama dosyaları (ör. Discord). express.static nokta ile başlayan
 * klasörleri varsayılan olarak servis etmez; yalnızca bu klasör açıkça izinlidir.
 */
app.use(
  '/.well-known',
  express.static(join(browserDistFolder, '.well-known'), { index: false, redirect: false }),
);

/** Derlenmiş statik dosyalar (adları hash'li olduğu için uzun süre önbelleklenebilir) */
app.use(
  express.static(browserDistFolder, {
    maxAge: '1y',
    index: false,
    redirect: false,
  }),
);

/** Geri kalan her istek Angular SSR ile render edilir; HTML yanıtlarına CSP eklenir */
app.use((req, res, next) => {
  angularApp
    .handle(req)
    .then(async (response) => {
      if (!response) return next();
      if (!response.headers.get('content-type')?.includes('text/html')) {
        return writeResponseToNodeResponse(response, res);
      }
      const html = await response.text();
      const headers = new Headers(response.headers);
      headers.set('Content-Security-Policy', contentSecurityPolicy(html));
      headers.delete('content-length');
      return writeResponseToNodeResponse(
        new Response(html, { status: response.status, statusText: response.statusText, headers }),
        res,
      );
    })
    .catch(next);
});

if (isMainModule(import.meta.url) || process.env['pm_id']) {
  const port = process.env['PORT'] || 4000;
  app.listen(port, (error) => {
    if (error) {
      throw error;
    }

    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

/** Angular CLI (dev-server ve build) tarafından kullanılan istek işleyicisi */
export const reqHandler = createNodeRequestHandler(app);
