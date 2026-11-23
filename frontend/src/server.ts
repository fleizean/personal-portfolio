import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';
import express from 'express';
import { join } from 'node:path';

const browserDistFolder = join(import.meta.dirname, '../browser');

const app = express();
const angularApp = new AngularNodeAppEngine();

// Kullanılan sunucu yazılımını ifşa etme
app.disable('x-powered-by');

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

/** Geri kalan her istek Angular SSR ile render edilir */
app.use((req, res, next) => {
  angularApp
    .handle(req)
    .then((response) => (response ? writeResponseToNodeResponse(response, res) : next()))
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
