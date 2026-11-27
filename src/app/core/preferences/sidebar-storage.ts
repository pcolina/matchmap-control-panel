import { InjectionToken } from '@angular/core';

export type SidebarState = 'collapsed' | 'expanded';

export interface SidebarStorage {
  read(userId: string): SidebarState;
  write(userId: string, state: SidebarState): void;
}

const keyFor = (userId: string): string => `control-panel.sidebar.${userId}`;

export const createLocalSidebarStorage = (getStorage: () => Storage): SidebarStorage => ({
  read(userId) {
    try {
      return getStorage().getItem(keyFor(userId)) === 'collapsed' ? 'collapsed' : 'expanded';
    } catch {
      return 'expanded';
    }
  },
  write(userId, state) {
    try {
      getStorage().setItem(keyFor(userId), state);
    } catch {
      return;
    }
  },
});

export const SIDEBAR_STORAGE = new InjectionToken<SidebarStorage>('SIDEBAR_STORAGE', {
  providedIn: 'root',
  factory: () => createLocalSidebarStorage(() => globalThis.localStorage),
});
