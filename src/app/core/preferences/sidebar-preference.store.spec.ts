import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { SidebarPreferenceStore } from './sidebar-preference.store';
import { SIDEBAR_STORAGE, SidebarState, SidebarStorage } from './sidebar-storage';

const fakeStorage = (initial: Record<string, SidebarState> = {}) => {
  const data = { ...initial };
  const port: SidebarStorage = {
    read: (userId) => data[userId] ?? 'expanded',
    write: (userId, state) => {
      data[userId] = state;
    },
  };
  return { port, data };
};

const setup = (initial?: Record<string, SidebarState>) => {
  const fake = fakeStorage(initial);
  TestBed.configureTestingModule({
    providers: [{ provide: SIDEBAR_STORAGE, useValue: fake.port }],
  });
  return { store: TestBed.inject(SidebarPreferenceStore), data: fake.data };
};

describe('SidebarPreferenceStore', () => {
  it('starts expanded', () => {
    const { store } = setup();
    expect(store.collapsed()).toBe(false);
  });

  it('restores the saved state of the loaded user', () => {
    const { store } = setup({ u1: 'collapsed' });
    store.load('u1');
    expect(store.collapsed()).toBe(true);
  });

  it('does not show another user state', () => {
    const { store } = setup({ u1: 'collapsed' });
    store.load('u2');
    expect(store.collapsed()).toBe(false);
  });

  it('toggles and saves the state for the loaded user', () => {
    const { store, data } = setup();
    store.load('u1');
    store.toggle();
    expect(store.collapsed()).toBe(true);
    expect(data['u1']).toBe('collapsed');
    store.toggle();
    expect(store.collapsed()).toBe(false);
    expect(data['u1']).toBe('expanded');
  });
});
