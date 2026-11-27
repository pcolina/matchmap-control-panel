import { describe, expect, it } from 'vitest';
import { isNarrow, NARROW_BREAKPOINT_PX, NARROW_MEDIA_QUERY } from './breakpoint';

describe('isNarrow', () => {
  it('uses 768 px as the breakpoint', () => {
    expect(NARROW_BREAKPOINT_PX).toBe(768);
  });

  it('is true below 768 px and false at 768 px', () => {
    expect(isNarrow(320)).toBe(true);
    expect(isNarrow(767)).toBe(true);
    expect(isNarrow(768)).toBe(false);
    expect(isNarrow(1280)).toBe(false);
  });

  it('builds a media query that matches the same breakpoint', () => {
    expect(NARROW_MEDIA_QUERY).toBe('(max-width: 767.98px)');
  });
});
