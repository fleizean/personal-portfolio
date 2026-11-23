import type { Observable } from 'rxjs';
import type { AdminCollectionKey, AdminRecord, AdminUser } from '../models/admin';

/** Admin panelinin veri portu. Hatalar AdminError biçiminde fırlatılır. */
export abstract class AdminRepository {
  /** GitHub girişi sunucuda yapılandırılmış mı */
  abstract loginAvailable(): Observable<boolean>;
  /** Oturum açıksa kullanıcı; değilse UNAUTHORIZED hatası */
  abstract me(): Observable<AdminUser>;
  /** Giriş için tarayıcının gideceği adres */
  abstract readonly loginUrl: string;
  abstract logout(): Observable<void>;

  abstract getProfile(): Observable<AdminRecord>;
  abstract saveProfile(profile: AdminRecord): Observable<AdminRecord>;

  abstract list(section: AdminCollectionKey): Observable<AdminRecord[]>;
  abstract create(section: AdminCollectionKey, record: AdminRecord): Observable<AdminRecord>;
  abstract update(section: AdminCollectionKey, id: number, record: AdminRecord): Observable<AdminRecord>;
  abstract remove(section: AdminCollectionKey, id: number): Observable<void>;
  abstract reorder(section: AdminCollectionKey, ids: number[]): Observable<void>;

  /** Görseli yükler; kayıtların görsel alanına yazılacak yolu döndürür */
  abstract uploadImage(file: File): Observable<string>;
}
