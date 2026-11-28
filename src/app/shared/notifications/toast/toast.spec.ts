import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideTranslateService, TranslateLoader } from '@ngx-translate/core';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { catalogueLoader } from '../../../core/i18n/catalogues';
import { NotificationStore } from '../../../core/notifications/notification.store';
import { Toast } from './toast';

describe('Toast', () => {
  let fixture: ComponentFixture<Toast>;
  let store: InstanceType<typeof NotificationStore>;

  const bars = (): HTMLElement[] =>
    Array.from(fixture.nativeElement.querySelectorAll('.toast__bar') as NodeListOf<HTMLElement>);

  beforeEach(() => {
    vi.useFakeTimers();
    TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        provideTranslateService({
          fallbackLang: 'en',
          loader: { provide: TranslateLoader, useValue: catalogueLoader },
        }),
      ],
    });
    store = TestBed.inject(NotificationStore);
    fixture = TestBed.createComponent(Toast);
    fixture.detectChanges();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('shows two notifications at the same time', () => {
    store.show('info', 'one');
    store.show('warning', 'two');
    fixture.detectChanges();

    expect(bars()).toHaveLength(2);
  });

  it('gives each kind its own colour class', () => {
    store.show('error', 'a');
    store.show('info', 'b');
    store.show('warning', 'c');
    fixture.detectChanges();

    const [error, info, warning] = bars();
    expect(error.classList).toContain('toast__bar--error');
    expect(info.classList).toContain('toast__bar--info');
    expect(warning.classList).toContain('toast__bar--warning');
  });

  it('announces an error as an alert and the other kinds as a status', () => {
    store.show('error', 'a');
    store.show('info', 'b');
    store.show('warning', 'c');
    fixture.detectChanges();

    const [error, info, warning] = bars();
    expect(error.getAttribute('role')).toBe('alert');
    expect(info.getAttribute('role')).toBe('status');
    expect(warning.getAttribute('role')).toBe('status');
  });

  it('ignores a click before 3 seconds and closes on a click after 3 seconds', () => {
    store.show('info', 'hello');
    fixture.detectChanges();

    vi.advanceTimersByTime(1000);
    bars()[0].click();
    fixture.detectChanges();
    expect(bars()).toHaveLength(1);

    vi.advanceTimersByTime(3000);
    bars()[0].click();
    fixture.detectChanges();
    expect(bars()).toHaveLength(0);
  });

  it('is pinned to the bottom of the viewport with 40 px bars', () => {
    store.show('info', 'hello');
    fixture.detectChanges();

    const container = fixture.nativeElement.querySelector('.toast') as HTMLElement;
    const style = getComputedStyle(container);
    expect(style.position).toBe('fixed');
    expect(style.bottom).toBe('0px');
    expect(getComputedStyle(bars()[0]).height).toBe('40px');
  });
});
