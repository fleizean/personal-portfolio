import { mergeApplicationConfig, type ApplicationConfig } from '@angular/core';
import { provideServerRendering, withRoutes } from '@angular/ssr';
import { API_BASE_URL } from '@core/config/api.config';
import { appConfig } from './app.config';
import { serverRoutes } from './app.routes.server';

const serverConfig: ApplicationConfig = {
  providers: [
    provideServerRendering(withRoutes(serverRoutes)),
    // SSR, API'ye docker ağı içinden ulaşır (ör. http://api:8080). Tanımlı değilse
    // (yerel geliştirme) içerik doğrudan paketlenmiş statik veriden gelir.
    { provide: API_BASE_URL, useValue: process.env['API_INTERNAL_URL'] ?? '' },
  ],
};

export const config = mergeApplicationConfig(appConfig, serverConfig);
