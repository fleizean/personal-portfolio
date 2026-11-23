import type { PageKey } from '@core/seo/seo.service';

/** Route'tan masaüstüne gelen bilgi: hangi sayfanın SEO metni, açılışta hangi pencere */
export interface DesktopRouteData {
  page: PageKey;
  open?: { folder: string } | { file: string } | { app: 'admin' };
}
