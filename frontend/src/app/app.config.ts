import { type ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import {
  provideClientHydration,
  withEventReplay,
  withNoHttpTransferCache,
} from '@angular/platform-browser';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { ContentRepository } from '@domain';
import { HttpContentRepository } from '@data/http/http-content.repository';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes, withComponentInputBinding()),
    // İçerik TransferState ile kendimiz aktarıyoruz; HTTP yanıtları ikinci kez gömülmesin
    provideClientHydration(withEventReplay(), withNoHttpTransferCache()),
    provideHttpClient(withFetch()),
    // İçerik kaynağı burada seçilir. API'ye ulaşılamazsa HttpContentRepository
    // paketlenmiş statik içeriğe düşer.
    { provide: ContentRepository, useClass: HttpContentRepository },
  ],
};
