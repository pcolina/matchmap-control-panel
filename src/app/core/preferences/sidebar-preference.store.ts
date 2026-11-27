import { inject } from '@angular/core';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { SIDEBAR_STORAGE } from './sidebar-storage';

export const SidebarPreferenceStore = signalStore(
  { providedIn: 'root' },
  withState({ collapsed: false, userId: null as string | null }),
  withMethods((store) => {
    const storage = inject(SIDEBAR_STORAGE);
    return {
      load(userId: string): void {
        patchState(store, { userId, collapsed: storage.read(userId) === 'collapsed' });
      },
      toggle(): void {
        const collapsed = !store.collapsed();
        patchState(store, { collapsed });
        const userId = store.userId();
        if (userId !== null) {
          storage.write(userId, collapsed ? 'collapsed' : 'expanded');
        }
      },
    };
  }),
);
