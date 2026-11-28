import { Component, provideZonelessChangeDetection, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { provideTranslateService, TranslateLoader, TranslateService } from '@ngx-translate/core';
import { describe, expect, it, beforeEach } from 'vitest';
import { catalogueLoader } from '../../../core/i18n/catalogues';
import { NAV_ITEMS } from '../../../core/nav/nav-items';
import { Sidebar } from './sidebar';
import * as icons from '@ng-icons/tabler-icons';

@Component({
  imports: [Sidebar],
  template: `<app-sidebar
    [items]="items"
    [collapsed]="collapsed()"
    (toggle)="toggled = toggled + 1"
  />`,
})
class Host {
  items = NAV_ITEMS;
  collapsed = signal(false);
  toggled = 0;
}

describe('Sidebar', () => {
  let fixture: ComponentFixture<Host>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        provideRouter([]),
        provideIcons(icons),
        provideTranslateService({
          fallbackLang: 'en',
          loader: { provide: TranslateLoader, useValue: catalogueLoader },
        }),
      ],
    });
    TestBed.inject(TranslateService).use('en');
    fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
  });

  const links = (): HTMLAnchorElement[] =>
    Array.from(fixture.nativeElement.querySelectorAll('a.sidebar__link'));

  it('places the sign-out control after the links, behind a divider', () => {
    const list = fixture.nativeElement.querySelector('.sidebar__list') as HTMLElement;
    const divider = fixture.nativeElement.querySelector('.sidebar__divider') as HTMLElement;
    const signOut = fixture.nativeElement.querySelector('app-sign-out') as HTMLElement;
    expect(divider).not.toBeNull();
    expect(list.compareDocumentPosition(divider) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(
      divider.compareDocumentPosition(signOut) & Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
  });

  it('renders eight links in the defined order with accessible names', () => {
    const names = links().map((link) => link.getAttribute('aria-label'));
    expect(names).toEqual([
      'Home',
      'Masters',
      'Statistics',
      'Users',
      'Profiles',
      'Marketing',
      'Benefits',
      'Settings',
    ]);
  });

  it('keeps the brand logo outside any link', () => {
    expect(fixture.nativeElement.querySelector('.sidebar__brand a')).toBeNull();
    expect(fixture.nativeElement.querySelector('.sidebar__brand img')).not.toBeNull();
  });

  it('hides the text labels when collapsed but keeps the accessible names', () => {
    fixture.componentInstance.collapsed.set(true);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.sidebar__label')).toBeNull();
    expect(fixture.nativeElement.querySelector('.sidebar__name')).toBeNull();
    expect(links()[0].getAttribute('aria-label')).toBe('Home');
  });

  it('sets aria-expanded on the toggle from the collapsed state', () => {
    const toggle = (): HTMLButtonElement =>
      fixture.nativeElement.querySelector('.sidebar__brand-toggle');
    expect(toggle().getAttribute('aria-expanded')).toBe('true');
    fixture.componentInstance.collapsed.set(true);
    fixture.detectChanges();
    expect(toggle().getAttribute('aria-expanded')).toBe('false');
  });

  it('shows the subtitle under the brand name and the version in the footer', () => {
    const subtitle = fixture.nativeElement.querySelector('.sidebar__brand .sidebar__subtitle');
    expect(subtitle?.textContent.trim()).toBe('Control Panel');
    const version = fixture.nativeElement.querySelector('.sidebar__footer .sidebar__version');
    expect(version?.textContent.trim()).toBe('Version 1.0.0');
  });

  it('hides the subtitle and the version in the rail', () => {
    fixture.componentInstance.collapsed.set(true);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.sidebar__subtitle')).toBeNull();
    expect(fixture.nativeElement.querySelector('.sidebar__version')).toBeNull();
  });

  it('names the brand control by the change it makes', () => {
    const label = (): string | null =>
      fixture.nativeElement.querySelector('.sidebar__brand-toggle').getAttribute('aria-label');
    expect(label()).toBe('Collapse sidebar');
    fixture.componentInstance.collapsed.set(true);
    fixture.detectChanges();
    expect(label()).toBe('Expand sidebar');
  });

  it('emits toggle when the toggle is pressed', () => {
    fixture.nativeElement.querySelector('.sidebar__brand-toggle').click();
    expect(fixture.componentInstance.toggled).toBe(1);
  });
});
