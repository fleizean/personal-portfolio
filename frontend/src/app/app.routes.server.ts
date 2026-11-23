import { RenderMode, type ServerRoute } from '@angular/ssr';

/**
 * Dil tercihi çerezden okunduğu için sayfalar istek anında render edilir;
 * önceden üretilmiş (prerender) tek bir HTML iki dili birden karşılayamaz.
 */
export const serverRoutes: ServerRoute[] = [{ path: '**', renderMode: RenderMode.Server }];
