import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { type Observable, catchError, map, throwError } from 'rxjs';
import {
  AdminRepository,
  type AdminCollectionKey,
  type AdminError,
  type AdminRecord,
  type AdminUser,
} from '@domain';

/**
 * Yazma isteklerinde zorunlu başlık. Başka bir sitedeki sayfa bu başlığı CORS ön kontrolü
 * olmadan ekleyemez; API CORS'a izin vermediği için istek hiç ulaşmaz (CSRF koruması).
 */
const WRITE_HEADERS = new HttpHeaders({ 'X-Portfolio-Admin': '1' });

function toAdminError(error: unknown): AdminError {
  if (error instanceof HttpErrorResponse) {
    const body = error.error as { error?: AdminError } | null;
    if (body?.error?.code) return body.error;
    if (error.status === 401) return { code: 'UNAUTHORIZED', message: 'Authentication is required.' };
    if (error.status === 0) return { code: 'NETWORK', message: 'The server could not be reached.' };
  }
  return { code: 'UNKNOWN', message: 'Something went wrong.' };
}

/** Oturum çerezi aynı alan adında olduğu için tarayıcı onu kendiliğinden gönderir */
@Injectable()
export class HttpAdminRepository extends AdminRepository {
  private readonly http = inject(HttpClient);
  override readonly loginUrl = '/api/auth/login';

  private request<T>(source: Observable<T>): Observable<T> {
    return source.pipe(catchError((error: unknown) => throwError(() => toAdminError(error))));
  }

  override loginAvailable(): Observable<boolean> {
    return this.request(
      this.http.get<{ loginAvailable: boolean }>('/api/auth/status').pipe(map((s) => s.loginAvailable)),
    );
  }

  override me(): Observable<AdminUser> {
    return this.request(this.http.get<AdminUser>('/api/auth/me'));
  }

  override logout(): Observable<void> {
    return this.request(this.http.post<void>('/api/auth/logout', null, { headers: WRITE_HEADERS }));
  }

  override getProfile(): Observable<AdminRecord> {
    return this.request(this.http.get<AdminRecord>('/api/admin/profile'));
  }

  override saveProfile(profile: AdminRecord): Observable<AdminRecord> {
    return this.request(this.http.put<AdminRecord>('/api/admin/profile', profile, { headers: WRITE_HEADERS }));
  }

  override list(section: AdminCollectionKey): Observable<AdminRecord[]> {
    return this.request(this.http.get<AdminRecord[]>(`/api/admin/${section}`));
  }

  override create(section: AdminCollectionKey, record: AdminRecord): Observable<AdminRecord> {
    return this.request(
      this.http.post<AdminRecord>(`/api/admin/${section}`, { ...record, id: 0 }, { headers: WRITE_HEADERS }),
    );
  }

  override update(section: AdminCollectionKey, id: number, record: AdminRecord): Observable<AdminRecord> {
    return this.request(
      this.http.put<AdminRecord>(`/api/admin/${section}/${id}`, record, { headers: WRITE_HEADERS }),
    );
  }

  override remove(section: AdminCollectionKey, id: number): Observable<void> {
    return this.request(this.http.delete<void>(`/api/admin/${section}/${id}`, { headers: WRITE_HEADERS }));
  }

  override reorder(section: AdminCollectionKey, ids: number[]): Observable<void> {
    return this.request(
      this.http.put<void>(`/api/admin/${section}/order`, { ids }, { headers: WRITE_HEADERS }),
    );
  }

  override uploadImage(file: File): Observable<string> {
    const body = new FormData();
    body.append('file', file);
    return this.request(
      this.http
        .post<{ path: string }>('/api/admin/uploads', body, { headers: WRITE_HEADERS })
        .pipe(map((r) => r.path)),
    );
  }
}
