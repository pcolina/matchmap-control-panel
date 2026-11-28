import { Route } from '@angular/router';
import { describe, expect, it } from 'vitest';
import { routes } from './app.routes';
import { authGuard } from './core/auth/auth.guard';

describe('routes', () => {
  const shell = routes.find((route) => route.path === '') as Route;
  const children = shell.children ?? [];
  const pages = children.filter((child) => child.path !== '');

  it('mounts the eight pages under the main layout', () => {
    expect(shell.component).toBeDefined();
    expect(pages.map((page) => page.path)).toEqual([
      'home',
      'masters',
      'statistics',
      'users',
      'profiles',
      'marketing',
      'benefits',
      'settings',
    ]);
  });

  it('lazy-loads every page and declares its allowed profiles', () => {
    for (const page of pages.filter((page) => page.path !== 'masters')) {
      expect(typeof page.loadComponent).toBe('function');
      expect(page.data?.['allowedProfiles']).toEqual(['superadmin']);
    }
    const masters = pages.find((page) => page.path === 'masters');
    expect(masters?.data?.['allowedProfiles']).toEqual(['superadmin']);
  });

  it('opens masters on the first master and lazy-loads each master', () => {
    const masters = pages.find((page) => page.path === 'masters');
    const children = masters?.children ?? [];
    expect(children).toMatchObject([
      { path: '', pathMatch: 'full', redirectTo: 'prohibited-words' },
      { path: 'prohibited-words', data: { master: 'prohibited-words' } },
      { path: 'countries', data: { master: 'countries' } },
      { path: 'cities', data: { master: 'cities' } },
      { path: '**', redirectTo: 'prohibited-words' },
    ]);
    for (const child of children.slice(1, 4)) {
      expect(typeof child.loadComponent).toBe('function');
    }
  });

  it('redirects the root to home', () => {
    expect(children[0]).toMatchObject({ path: '', redirectTo: 'home' });
  });

  it('guards the main layout with the session check', () => {
    expect(shell.canActivate).toEqual([authGuard]);
  });

  it('keeps the sign-in and no-permissions pages public, outside the main layout', () => {
    const publicPaths = routes.filter((route) => route !== shell).map((route) => route.path);
    expect(publicPaths).toEqual(['login', 'no-permissions', '**']);
    expect(routes.find((route) => route.path === 'login')?.loadComponent).toBeTypeOf('function');
    expect(routes.find((route) => route.path === 'no-permissions')?.loadComponent).toBeTypeOf(
      'function',
    );
  });
});
