import type { Observable } from 'rxjs';
import type { Language } from '../models/language';
import type { PortfolioContent } from '../models/portfolio-content';

/**
 * İçerik kaynağının portu. Özellikler (features) yalnızca bu soyut sınıfa bağlıdır;
 * verinin statik JSON'dan mı yoksa API'den mi geldiğini bilmez.
 * Hangi implementasyonun kullanılacağı app.config.ts içinde seçilir.
 */
export abstract class ContentRepository {
  abstract getContent(language: Language): Observable<PortfolioContent>;
}
