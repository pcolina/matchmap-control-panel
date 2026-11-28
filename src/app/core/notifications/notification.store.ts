import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';

export type NotificationKind = 'info' | 'warning' | 'error';

export interface Notification {
  readonly id: number;
  readonly kind: NotificationKind;
  readonly message: string;
  readonly shownAt: number;
}

export const DISMISS_AFTER_MS = 7000;
export const CLICK_CLOSES_AFTER_MS = 3000;

export const NotificationStore = signalStore(
  { providedIn: 'root' },
  withState({ items: [] as Notification[] }),
  withMethods((store) => {
    const timers = new Map<number, ReturnType<typeof setTimeout>>();
    let nextId = 1;

    const dismiss = (id: number): void => {
      clearTimeout(timers.get(id));
      timers.delete(id);
      patchState(store, { items: store.items().filter((item) => item.id !== id) });
    };

    return {
      show(kind: NotificationKind, message: string): void {
        if (store.items().some((item) => item.kind === kind && item.message === message)) {
          return;
        }
        const id = nextId++;
        patchState(store, {
          items: [...store.items(), { id, kind, message, shownAt: Date.now() }],
        });
        timers.set(
          id,
          setTimeout(() => dismiss(id), DISMISS_AFTER_MS),
        );
      },
      dismiss,
    };
  }),
);
