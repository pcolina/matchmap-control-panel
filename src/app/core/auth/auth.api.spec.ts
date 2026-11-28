import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { environment } from '../../../environments/environment';
import { AuthApi } from './auth.api';

describe('AuthApi', () => {
  let api: AuthApi;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    api = TestBed.inject(AuthApi);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('logs in with email and password as a web client', () => {
    let response: unknown;
    api.login('ana@example.com', 'secret').subscribe((value) => (response = value));

    const request = http.expectOne(`${environment.apiBaseUrl}/api/auth/login`);
    expect(request.request.method).toBe('POST');
    expect(request.request.headers.get('X-Client')).toBe('web');
    expect(request.request.body).toEqual({ email: 'ana@example.com', password: 'secret' });
    request.flush({ tokenType: 'Bearer', accessToken: 'token-1', expiresIn: 900 });

    expect(response).toEqual({ tokenType: 'Bearer', accessToken: 'token-1', expiresIn: 900 });
  });

  it('refreshes the session as a web client with no body', () => {
    api.refresh().subscribe();

    const request = http.expectOne(`${environment.apiBaseUrl}/api/auth/refresh`);
    expect(request.request.method).toBe('POST');
    expect(request.request.headers.get('X-Client')).toBe('web');
    expect(request.request.body).toBeNull();
    request.flush({ tokenType: 'Bearer', accessToken: 'token-2', expiresIn: 900 });
  });

  it('logs out as a web client', () => {
    api.logout().subscribe();

    const request = http.expectOne(`${environment.apiBaseUrl}/api/auth/logout`);
    expect(request.request.method).toBe('POST');
    expect(request.request.headers.get('X-Client')).toBe('web');
    request.flush(null);
  });

  it('reads the role of the signed-in account with its access token', () => {
    let role: unknown;
    api.me('token-1').subscribe((value) => (role = value));

    const request = http.expectOne(`${environment.apiBaseUrl}/graphql`);
    expect(request.request.headers.get('Authorization')).toBe('Bearer token-1');
    request.flush({ data: { me: { role: 'ADMIN' } } });

    expect(role).toBe('ADMIN');
  });
});
