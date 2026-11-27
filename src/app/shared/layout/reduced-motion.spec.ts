import { describe, expect, it } from 'vitest';

type FsModule = { readFileSync(path: URL, encoding: 'utf8'): string };
const nodeFs = (
  globalThis as unknown as { process: { getBuiltinModule(id: 'node:fs'): FsModule } }
).process.getBuiltinModule('node:fs');

const readStyle = (file: string): string => {
  const css = nodeFs.readFileSync(new URL(file, import.meta.url), 'utf8');
  expect(css).toContain('prefers-reduced-motion: no-preference');
  return css;
};

const MOTION_BLOCK = /@media \(prefers-reduced-motion: no-preference\) \{[\s\S]*?\n\}/g;
const outsideMotionBlocks = (css: string): string => css.replace(MOTION_BLOCK, '');

describe('reduced motion', () => {
  it('declares sidebar transitions only under no-preference', () => {
    expect(outsideMotionBlocks(readStyle('./sidebar/sidebar.css'))).not.toMatch(
      /transition|animation/,
    );
  });

  it('declares drawer and backdrop animations only under no-preference', () => {
    expect(outsideMotionBlocks(readStyle('./main-layout/main-layout.css'))).not.toMatch(
      /transition|animation/,
    );
  });
});
