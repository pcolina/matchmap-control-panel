import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface SessionTokens {
  readonly tokenType: string;
  readonly accessToken: string;
  readonly expiresIn: number;
}

const WEB_CLIENT = new HttpHeaders({ 'X-Client': 'web' });

@Injectable({ providedIn: 'root' })
export class AuthApi {
  private readonly http = inject(HttpClient);
  private readonly base = environment.apiBaseUrl;

  login(email: string, password: string): Observable<SessionTokens> {
    return this.http.post<SessionTokens>(
      `${this.base}/api/auth/login`,
      { email, password },
      { headers: WEB_CLIENT },
    );
  }

  refresh(): Observable<SessionTokens> {
    return this.http.post<SessionTokens>(`${this.base}/api/auth/refresh`, null, {
      headers: WEB_CLIENT,
    });
  }

  logout(): Observable<void> {
    return this.http.post<void>(`${this.base}/api/auth/logout`, null, { headers: WEB_CLIENT });
  }

  me(accessToken: string): Observable<string | null> {
    return this.http
      .post<{ data?: { me?: { role?: string } } }>(
        `${this.base}/graphql`,
        { query: 'query Me { me { role } }' },
        { headers: new HttpHeaders({ Authorization: `Bearer ${accessToken}` }) },
      )
      .pipe(map((body) => body.data?.me?.role ?? null));
  }
}
