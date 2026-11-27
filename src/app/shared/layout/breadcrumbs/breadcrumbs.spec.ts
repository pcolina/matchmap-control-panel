import { Component, provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { provideIcons } from '@ng-icons/core';
import * as icons from '@ng-icons/tabler-icons';
import { provideTranslateService, TranslateLoader, TranslateService } from '@ngx-translate/core';
import { beforeEach, describe, expect, it } from 'vitest';
import { catalogueLoader } from '../../../core/i18n/catalogues';
import { Breadcrumbs } from './breadcrumbs';

@Component({ template: '' })
class Blank {}

describe('Breadcrumbs', () => {
  let fixture: ComponentFixture<Breadcrumbs>;
  let router: Router;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        provideRouter([
          { path: 'home', component: Blank },
          { path: 'masters', component: Blank, children: [{ path: 'countries', component: Blank }] },
          { path: 'unknown', component: Blank, children: [{ path: 'xyz', component: Blank }] },
        ]),
        provideIcons(icons),
        provideTranslateService({
          fallbackLang: 'en',
          loader: { provide: TranslateLoader, useValue: catalogueLoader },
        }),
      ],
    });
    TestBed.inject(TranslateService).use('en');
    router = TestBed.inject(Router);
    fixture = TestBed.createComponent(Breadcrumbs);
    await router.navigateByUrl('/masters/countries');
    fixture.detectChanges();
    await fixture.whenStable();
  });

  const el = (): HTMLElement => fixture.nativeElement;

  it('is a navigation landmark with a localised name', () => {
    expect(el().querySelector('nav.breadcrumbs')?.getAttribute('aria-label')).toBe('Breadcrumb');
  });

  it('labels each segment from the navigation keys and capitalises unknown ones', () => {
    const texts = Array.from(el().querySelectorAll('.breadcrumbs__item')).map((item) =>
      item.textContent?.trim(),
    );
    expect(texts).toEqual(['Masters', 'Countries']);
  });

  it('shows the current page last, not as a link, with aria-current', () => {
    const current = el().querySelector('[aria-current="page"]') as HTMLElement;
    expect(current.textContent?.trim()).toBe('Countries');
    expect(current.tagName).not.toBe('A');
    expect(el().querySelectorAll('[aria-current]')).toHaveLength(1);
  });

  it('shows earlier crumbs as links to their own path', () => {
    const links = el().querySelectorAll<HTMLAnchorElement>('a.breadcrumbs__link');
    expect(links).toHaveLength(1);
    expect(links[0].getAttribute('href')).toBe('/masters');
  });

  it('hides the chevron separators from assistive technology', () => {
    const separators = el().querySelectorAll('.breadcrumbs__sep');
    expect(separators).toHaveLength(1);
    expect(separators[0].getAttribute('aria-hidden')).toBe('true');
  });

  it('shows a single current crumb on top-level pages', async () => {
    await router.navigateByUrl('/home');
    fixture.detectChanges();
    await fixture.whenStable();
    expect(el().querySelectorAll('a.breadcrumbs__link')).toHaveLength(0);
    expect(el().querySelector('[aria-current="page"]')?.textContent?.trim()).toBe('Home');
  });

  it('capitalises a segment that has no translation key', async () => {
    await router.navigateByUrl('/unknown/xyz');
    fixture.detectChanges();
    await fixture.whenStable();
    expect(el().querySelector('[aria-current="page"]')?.textContent?.trim()).toBe('Xyz');
  });
});
