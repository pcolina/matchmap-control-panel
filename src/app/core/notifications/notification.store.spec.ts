import { TestBed } from '@angular/core/testing';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { NotificationStore } from './notification.store';

describe('NotificationStore', () => {
  let store: InstanceType<typeof NotificationStore>;

  beforeEach(() => {
    vi.useFakeTimers();
    store = TestBed.inject(NotificationStore);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('adds a notification with its kind and message, and dismisses it', () => {
    store.show('error', 'login.error');

    const [item] = store.items();
    expect(item).toMatchObject({ kind: 'error', message: 'login.error' });

    store.dismiss(item.id);
    expect(store.items()).toEqual([]);
  });

  it('removes a notification 7 seconds after it was shown', () => {
    store.show('info', 'hello');

    vi.advanceTimersByTime(6999);
    expect(store.items()).toHaveLength(1);

    vi.advanceTimersByTime(1);
    expect(store.items()).toHaveLength(0);
  });

  it('a later notification does not reset the timer of the first one', () => {
    store.show('info', 'first');
    vi.advanceTimersByTime(4000);
    store.show('warning', 'second');

    vi.advanceTimersByTime(3000);
    expect(store.items().map((item) => item.message)).toEqual(['second']);

    vi.advanceTimersByTime(4000);
    expect(store.items()).toEqual([]);
  });
});

describe('NotificationStore repeated messages', () => {
  let store: InstanceType<typeof NotificationStore>;

  beforeEach(() => {
    vi.useFakeTimers();
    store = TestBed.inject(NotificationStore);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('does not add a second notification with the same kind and message', () => {
    store.show('error', 'login.error');
    store.show('error', 'login.error');

    expect(store.items()).toHaveLength(1);
  });

  it('still adds a notification with a different message', () => {
    store.show('error', 'login.error');
    store.show('error', 'masters.error');

    expect(store.items()).toHaveLength(2);
  });

  it('adds the same message again once the first one has gone', () => {
    store.show('error', 'login.error');
    vi.advanceTimersByTime(7000);
    store.show('error', 'login.error');

    expect(store.items()).toHaveLength(1);
  });
});
