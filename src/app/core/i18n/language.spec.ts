import { describe, expect, it } from 'vitest';
import { pickLanguage } from './language';

describe('pickLanguage', () => {
  it('returns es for Spanish browser languages', () => {
    expect(pickLanguage('es-ES')).toBe('es');
    expect(pickLanguage('es')).toBe('es');
  });

  it('returns en for English browser languages', () => {
    expect(pickLanguage('en-US')).toBe('en');
  });

  it('returns en for any other or missing language', () => {
    expect(pickLanguage('fr-FR')).toBe('en');
    expect(pickLanguage('')).toBe('en');
    expect(pickLanguage(undefined)).toBe('en');
  });
});
