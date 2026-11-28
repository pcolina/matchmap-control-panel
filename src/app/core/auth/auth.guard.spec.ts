import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Router, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { provideRouter } from '@angular/router';
import { describe, expect, it, vi } from 'vitest';
import { authGuard } from './auth.guard';
import { AuthStore } from './auth.store';

const state = { url: '/masters/countries' } as RouterStateSnapshot;
const route = {} as ActivatedRouteSnapshot;

const setup = (status: 'signedIn' | 'signedOut', role: string | null) => {
  const fake = {
    status: signal(status),
    role: signal(role),
    restore: vi.fn(async () => undefined),
  };
  TestBed.configureTestingModule({
    providers: [provideRouter([]), { provide: AuthStore, useValue: fake }],
  });
  return fake;
};

const decide = async () => {
  const result = await TestBed.runInInjectionContext(() => authGuard(route, state));
  return result;
};

describe('authGuard', () => {
  it('sends a visitor without a session to the sign-in page', async () => {
    setup('signedOut', null);

    const result = await decide();

    expect(result).not.toBe(true);
    expect(TestBed.inject(Router).serializeUrl(result as never)).toBe(
      '/login?returnUrl=%2Fmasters%2Fcountries',
    );
  });

  it('sends a USER account to the no-permissions page', async () => {
    setup('signedIn', 'USER');

    const result = await decide();

    expect(TestBed.inject(Router).serializeUrl(result as never)).toBe('/no-permissions');
  });

  it('allows an ADMIN account into the panel', async () => {
    setup('signedIn', 'ADMIN');

    expect(await decide()).toBe(true);
  });

  it('restores the session before deciding', async () => {
    const fake = setup('signedOut', null);

    await decide();

    expect(fake.restore).toHaveBeenCalledTimes(1);
  });
});
