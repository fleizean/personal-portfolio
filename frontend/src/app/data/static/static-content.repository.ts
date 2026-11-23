import { Injectable } from '@angular/core';
import { type Observable, of } from 'rxjs';
import { ContentRepository, type Language, type PortfolioContent } from '@domain';
import contentTr from './content.tr.json';
import contentEn from './content.en.json';

const CONTENT: Record<Language, PortfolioContent> = {
  tr: contentTr as PortfolioContent,
  en: contentEn as PortfolioContent,
};

/**
 * Uygulamayla birlikte paketlenen statik içerik.
 * .NET API hazır olduğunda yerine HttpContentRepository geçecek.
 */
@Injectable()
export class StaticContentRepository extends ContentRepository {
  override getContent(language: Language): Observable<PortfolioContent> {
    return of(CONTENT[language]);
  }
}
