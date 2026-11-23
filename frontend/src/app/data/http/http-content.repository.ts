import { HttpClient } from '@angular/common/http';
import { Injectable, PLATFORM_ID, TransferState, inject, makeStateKey } from '@angular/core';
import { isPlatformServer } from '@angular/common';
import { type Observable, catchError, of, tap, timeout } from 'rxjs';
import { ContentRepository, type Language, type PortfolioContent } from '@domain';
import { API_BASE_URL } from '@core/config/api.config';
import { StaticContentRepository } from '../static/static-content.repository';

const REQUEST_TIMEOUT_MS = 4000;

/**
 * İçeriği .NET API'den okur.
 * - SSR'da çekilen içerik sayfaya gömülür (TransferState); tarayıcı aynı isteği tekrarlamaz.
 * - API'ye ulaşılamazsa paketlenmiş statik içerik kullanılır; site boş kalmaz.
 */
@Injectable()
export class HttpContentRepository extends ContentRepository {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = inject(API_BASE_URL);
  private readonly transferState = inject(TransferState);
  private readonly isServer = isPlatformServer(inject(PLATFORM_ID));
  private readonly fallback = new StaticContentRepository();

  override getContent(language: Language): Observable<PortfolioContent> {
    const key = makeStateKey<PortfolioContent>(`content:${language}`);

    if (!this.isServer && this.transferState.hasKey(key)) {
      const content = this.transferState.get(key, null);
      // Yalnızca ilk yüklemede kullanılır; sonraki dil değişimleri API'ye gider
      this.transferState.remove(key);
      if (content) return of(content);
    }

    // Sunucuda API adresi tanımlı değilse (yerel geliştirme) beklemeden statik içerik
    if (this.isServer && !this.baseUrl) return this.fallback.getContent(language);

    return this.http.get<PortfolioContent>(`${this.baseUrl}/api/content/${language}`).pipe(
      timeout(REQUEST_TIMEOUT_MS),
      tap((content) => {
        if (this.isServer) this.transferState.set(key, content);
      }),
      catchError(() => this.fallback.getContent(language)),
    );
  }
}
