import { describe, expect, it } from 'vitest';
import { createLocalSidebarStorage } from './sidebar-storage';

const memoryStorage = (): Storage => {
  const data = new Map<string, string>();
  return {
    getItem: (key: string) => data.get(key) ?? null,
    setItem: (key: string, value: string) => void data.set(key, value),
  } as unknown as Storage;
};

describe('createLocalSidebarStorage', () => {
  it('reads expanded when nothing is stored', () => {
    expect(createLocalSidebarStorage(memoryStorage).read('u1')).toBe('expanded');
  });

  it('writes and reads back the state per user', () => {
    const backing = memoryStorage();
    const storage = createLocalSidebarStorage(() => backing);
    storage.write('u1', 'collapsed');
    expect(storage.read('u1')).toBe('collapsed');
    expect(storage.read('u2')).toBe('expanded');
  });

  it('treats an invalid stored value as expanded', () => {
    const backing = memoryStorage();
    backing.setItem('control-panel.sidebar.u1', 'weird');
    expect(createLocalSidebarStorage(() => backing).read('u1')).toBe('expanded');
  });

  it('does not throw when the storage throws', () => {
    const broken = {
      getItem: () => {
        throw new Error('blocked');
      },
      setItem: () => {
        throw new Error('blocked');
      },
    } as unknown as Storage;
    const storage = createLocalSidebarStorage(() => broken);
    expect(storage.read('u1')).toBe('expanded');
    expect(() => storage.write('u1', 'collapsed')).not.toThrow();
  });
});
