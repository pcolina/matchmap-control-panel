import { describe, expect, it } from 'vitest';
import { canEnterPanel } from './can-enter-panel';

describe('canEnterPanel', () => {
  it('admits an ADMIN account', () => {
    expect(canEnterPanel('ADMIN')).toBe(true);
  });

  it('rejects a USER account', () => {
    expect(canEnterPanel('USER')).toBe(false);
  });

  it('rejects a missing, null or empty role', () => {
    expect(canEnterPanel(null)).toBe(false);
    expect(canEnterPanel(undefined)).toBe(false);
    expect(canEnterPanel('')).toBe(false);
    expect(canEnterPanel('   ')).toBe(false);
  });
});
