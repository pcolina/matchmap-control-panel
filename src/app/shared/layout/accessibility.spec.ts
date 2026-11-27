import { provideZonelessChangeDetection, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideIcons } from '@ng-icons/core';
import * as icons from '@ng-icons/tabler-icons';
import { provideTranslateService, TranslateLoader, TranslateService } from '@ngx-translate/core';
import axe from 'axe-core';
import { beforeEach, describe, expect, it } from 'vitest';
import { catalogueLoader } from '../../core/i18n/catalogues';
import { SIDEBAR_STORAGE } from '../../core/preferences/sidebar-storage';
import { Viewport } from '../../core/viewport/breakpoint';
import { MainLayout } from './main-layout/main-layout';

const WCAG_AA = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'];

const runAxe = async (element: HTMLElement) => {
  const result = await axe.run(element, {
    runOnly: { type: 'tag', values: WCAG_AA },
    rules: { 'color-contrast': { enabled: false } },
  });
  return result.violations.map((v) => `${v.id}: ${v.help}`);
};

describe('control panel shell accessibility', () => {
  let fixture: ComponentFixture<MainLayout>;
  let narrow: ReturnType<typeof signal<boolean>>;

  beforeEach(() => {
    narrow = signal(false);
    TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        provideRouter([{ path: '**', children: [] }]),
        provideIcons(icons),
        provideTranslateService({
          fallbackLang: 'en',
          loader: { provide: TranslateLoader, useValue: catalogueLoader },
        }),
        { provide: Viewport, useValue: { narrow } },
        { provide: SIDEBAR_STORAGE, useValue: { read: () => 'expanded', write: () => undefined } },
      ],
    });
    TestBed.inject(TranslateService).use('en');
    fixture = TestBed.createComponent(MainLayout);
    document.body.appendChild(fixture.nativeElement);
    fixture.detectChanges();
  });

  it('has no WCAG AA violations when expanded', async () => {
    expect(await runAxe(fixture.nativeElement)).toEqual([]);
  });

  it('has no WCAG AA violations when collapsed to the rail', async () => {
    fixture.nativeElement.querySelector('.sidebar__toggle').click();
    fixture.detectChanges();
    await fixture.whenStable();
    expect(await runAxe(fixture.nativeElement)).toEqual([]);
  });

  it('has no WCAG AA violations with the drawer open on a narrow screen', async () => {
    narrow.set(true);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.nativeElement.querySelector('.topbar__menu').click();
    fixture.detectChanges();
    await fixture.whenStable();
    expect(await runAxe(fixture.nativeElement)).toEqual([]);
  });
});
