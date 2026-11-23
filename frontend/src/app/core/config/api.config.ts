import { InjectionToken } from '@angular/core';

/**
 * API'nin taban adresi. Tarayıcıda boş: istekler aynı alan adındaki /api'ye gider (nginx).
 * Sunucuda (SSR) docker ağı içindeki adres verilir; bkz. app.config.server.ts.
 */
export const API_BASE_URL = new InjectionToken<string>('API_BASE_URL', {
  providedIn: 'root',
  factory: () => '',
});
