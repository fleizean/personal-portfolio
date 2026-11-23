import { type ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { ContentRepository } from '@domain';
import { StaticContentRepository } from '@data/static/static-content.repository';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes, withComponentInputBinding()),
    provideClientHydration(withEventReplay()),
    // İçerik kaynağı burada seçilir; API hazır olunca yalnızca bu satır değişir.
    { provide: ContentRepository, useClass: StaticContentRepository },
  ],
};
