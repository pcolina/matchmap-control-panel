import { provideZonelessChangeDetection, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { provideIcons } from '@ng-icons/core';
import * as icons from '@ng-icons/tabler-icons';
import { provideTranslateService, TranslateLoader, TranslateService } from '@ngx-translate/core';
import { beforeEach, describe, expect, it } from 'vitest';
import { catalogueLoader } from '../../../core/i18n/catalogues';
import { SIDEBAR_STORAGE, SidebarState } from '../../../core/preferences/sidebar-storage';
import { Viewport } from '../../../core/viewport/breakpoint';
import { MainLayout } from './main-layout';

describe('MainLayout', () => {
  let fixture: ComponentFixture<MainLayout>;
  let narrow: ReturnType<typeof signal<boolean>>;

  beforeEach(() => {
    narrow = signal(true);
    const memory: Record<string, SidebarState> = {};
    TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        provideRouter([{ path: '**', children: [] }]),
        provideHttpClient(),
        provideHttpClientTesting(),
        provideIcons(icons),
        provideTranslateService({
          fallbackLang: 'en',
          loader: { provide: TranslateLoader, useValue: catalogueLoader },
        }),
        { provide: Viewport, useValue: { narrow } },
        {
          provide: SIDEBAR_STORAGE,
          useValue: {
            read: (userId: string) => memory[userId] ?? 'expanded',
            write: (userId: string, state: SidebarState) => {
              memory[userId] = state;
            },
          },
        },
      ],
    });
    TestBed.inject(TranslateService).use('en');
    fixture = TestBed.createComponent(MainLayout);
    fixture.detectChanges();
  });

  const el = (): HTMLElement => fixture.nativeElement;
  const menuButton = (): HTMLButtonElement =>
    el().querySelector('.topbar__menu') as HTMLButtonElement;
  const drawer = (): HTMLElement | null => el().querySelector('#cp-drawer');

  it('shows a closed menu button and no drawer on narrow screens', () => {
    expect(menuButton().getAttribute('aria-expanded')).toBe('false');
    expect(drawer()).toBeNull();
    expect(el().querySelector('app-sidebar')).toBeNull();
  });

  it('opens the drawer as a modal dialog with the eight items', async () => {
    menuButton().click();
    fixture.detectChanges();
    await fixture.whenStable();
    expect(menuButton().getAttribute('aria-expanded')).toBe('true');
    expect(drawer()?.getAttribute('role')).toBe('dialog');
    expect(drawer()?.getAttribute('aria-modal')).toBe('true');
    expect(drawer()?.querySelectorAll('a.sidebar__link')).toHaveLength(8);
  });

  it('closes on Escape and returns focus to the menu button', async () => {
    menuButton().click();
    fixture.detectChanges();
    await fixture.whenStable();
    drawer()?.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    fixture.detectChanges();
    expect(drawer()).toBeNull();
    expect(document.activeElement).toBe(menuButton());
  });

  it('closes when a backdrop is clicked', async () => {
    menuButton().click();
    fixture.detectChanges();
    await fixture.whenStable();
    (el().querySelector('.backdrop') as HTMLElement).click();
    fixture.detectChanges();
    expect(drawer()).toBeNull();
  });

  it('closes when a drawer item is activated', async () => {
    menuButton().click();
    fixture.detectChanges();
    await fixture.whenStable();
    (drawer()?.querySelector('a.sidebar__link') as HTMLElement).click();
    fixture.detectChanges();
    expect(drawer()).toBeNull();
  });

  it('wraps Tab inside the drawer', async () => {
    menuButton().click();
    fixture.detectChanges();
    await fixture.whenStable();
    const focusables = Array.from(
      drawer()?.querySelectorAll<HTMLElement>('a[href], button:not([disabled])') ?? [],
    );
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    last.focus();
    drawer()?.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', bubbles: true }));
    expect(document.activeElement).toBe(first);
  });

  it('places the breadcrumb trail inside the content area above the page outlet', () => {
    const content = el().querySelector('main.content') as HTMLElement;
    const trail = content.querySelector('app-breadcrumbs') as HTMLElement;
    const outlet = content.querySelector('router-outlet') as HTMLElement;
    expect(trail).not.toBeNull();
    expect(trail.compareDocumentPosition(outlet) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });

  it('keeps the drawer during the slide-out and removes it when the animation ends', async () => {
    menuButton().click();
    fixture.detectChanges();
    await fixture.whenStable();
    const panel = drawer() as HTMLElement & { getAnimations?: () => Animation[] };
    panel.getAnimations = () => [];
    panel.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    fixture.detectChanges();
    expect(drawer()).not.toBeNull();
    expect(drawer()?.classList.contains('drawer--closing')).toBe(true);
    expect(el().querySelector('.backdrop')?.classList.contains('backdrop--closing')).toBe(true);
    drawer()?.dispatchEvent(new Event('animationend', { bubbles: false }));
    fixture.detectChanges();
    expect(drawer()).toBeNull();
    expect(menuButton().getAttribute('aria-expanded')).toBe('false');
  });

  it('closes at once when the Web Animations API is not available', async () => {
    menuButton().click();
    fixture.detectChanges();
    await fixture.whenStable();
    drawer()?.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    fixture.detectChanges();
    expect(drawer()).toBeNull();
  });

  it('closes the drawer when the viewport becomes wide', async () => {
    menuButton().click();
    fixture.detectChanges();
    await fixture.whenStable();
    narrow.set(false);
    fixture.detectChanges();
    await fixture.whenStable();
    expect(drawer()).toBeNull();
    expect(el().querySelector('app-sidebar')).not.toBeNull();
  });
});
