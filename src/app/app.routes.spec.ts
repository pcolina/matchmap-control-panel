import { describe, expect, it } from 'vitest';
import { routes } from './app.routes';

describe('routes', () => {
  const shell = routes[0];
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
    for (const page of pages) {
      expect(typeof page.loadComponent).toBe('function');
      expect(page.data?.['allowedProfiles']).toEqual(['superadmin']);
    }
  });

  it('redirects the root to home', () => {
    expect(children[0]).toMatchObject({ path: '', redirectTo: 'home' });
  });
});
