import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { environment } from '../../../environments/environment';
import { AuthStore } from './auth.store';

const base = environment.apiBaseUrl;
const tokenBody = (accessToken: string) => ({ tokenType: 'Bearer', accessToken, expiresIn: 900 });

const settle = (): Promise<void> => new Promise((resolve) => setTimeout(resolve, 0));

describe('AuthStore', () => {
  let store: InstanceType<typeof AuthStore>;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    store = TestBed.inject(AuthStore);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    http.verify();
    vi.restoreAllMocks();
  });

  it('keeps the access token in memory only after sign-in', async () => {
    const setItem = vi.spyOn(Storage.prototype, 'setItem');
    const promise = store.login('ana@example.com', 'secret');

    http.expectOne(`${base}/api/auth/login`).flush(tokenBody('token-1'));
    await settle();
    http.expectOne(`${base}/graphql`).flush({ data: { me: { role: 'ADMIN' } } });
    await promise;

    expect(store.accessToken()).toBe('token-1');
    expect(store.status()).toBe('signedIn');
    expect(store.role()).toBe('ADMIN');
    expect(setItem).not.toHaveBeenCalled();
  });

  it('sends one refresh for several parallel restores', async () => {
    const first = store.restore();
    const second = store.restore();
    const third = store.restore();

    const refreshes = http.match(`${base}/api/auth/refresh`);
    expect(refreshes).toHaveLength(1);
    refreshes[0].flush(tokenBody('token-2'));
    await settle();
    http.expectOne(`${base}/graphql`).flush({ data: { me: { role: 'USER' } } });
    await Promise.all([first, second, third]);

    expect(store.status()).toBe('signedIn');
  });

  it('marks the session as signed out when the refresh fails', async () => {
    const restore = store.restore();

    http
      .expectOne(`${base}/api/auth/refresh`)
      .flush({ error: 'invalid_refresh_token' }, { status: 401, statusText: 'Unauthorized' });
    await restore;

    expect(store.status()).toBe('signedOut');
    expect(store.accessToken()).toBeNull();
  });

  it('clears the token and the role when signing out', async () => {
    const promise = store.login('ana@example.com', 'secret');
    http.expectOne(`${base}/api/auth/login`).flush(tokenBody('token-1'));
    await settle();
    http.expectOne(`${base}/graphql`).flush({ data: { me: { role: 'ADMIN' } } });
    await promise;

    const logout = store.logout();
    http.expectOne(`${base}/api/auth/logout`).flush(null);
    await logout;

    expect(store.status()).toBe('signedOut');
    expect(store.accessToken()).toBeNull();
    expect(store.role()).toBeNull();
  });

  it('refreshes the token on demand and reports whether it worked', async () => {
    const refreshed = store.refresh();
    http.expectOne(`${base}/api/auth/refresh`).flush(tokenBody('token-3'));
    await settle();
    http.expectOne(`${base}/graphql`).flush({ data: { me: { role: 'ADMIN' } } });

    expect(await refreshed).toBe(true);
    expect(store.accessToken()).toBe('token-3');
  });
});
