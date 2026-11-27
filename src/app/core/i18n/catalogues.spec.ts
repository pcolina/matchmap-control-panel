import { describe, expect, it } from 'vitest';
import { CATALOGUES } from './catalogues';

describe('CATALOGUES', () => {
  it('has the same keys in en and es', () => {
    expect(Object.keys(CATALOGUES.es).sort()).toEqual(Object.keys(CATALOGUES.en).sort());
  });

  it('has no empty values', () => {
    for (const lang of ['en', 'es'] as const) {
      for (const value of Object.values(CATALOGUES[lang])) {
        expect(value.trim()).not.toBe('');
      }
    }
  });
});
