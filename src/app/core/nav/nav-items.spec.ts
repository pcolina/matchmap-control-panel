import { describe, expect, it } from 'vitest';
import { NAV_ITEMS, visibleItems } from './nav-items';

describe('NAV_ITEMS', () => {
  it('lists the eight items in the defined order', () => {
    expect(NAV_ITEMS.map((item) => item.route)).toEqual([
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

  it('gives every item an icon, a label key and at least one allowed profile', () => {
    for (const item of NAV_ITEMS) {
      expect(item.icon).toMatch(/^tabler[A-Z]/);
      expect(item.labelKey).toMatch(/^nav\./);
      expect(item.allowedProfiles.length).toBeGreaterThan(0);
    }
  });
});

describe('visibleItems', () => {
  it('shows all eight items to superadmin', () => {
    expect(visibleItems(NAV_ITEMS, 'superadmin')).toHaveLength(8);
  });

  it('shows no item to a profile that is not allowed', () => {
    const items = [{ ...NAV_ITEMS[0], allowedProfiles: [] as const }];
    expect(visibleItems(items, 'superadmin')).toEqual([]);
  });
});
