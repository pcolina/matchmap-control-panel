import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideTranslateService, TranslateLoader } from '@ngx-translate/core';
import { beforeEach, describe, expect, it } from 'vitest';
import { catalogueLoader } from './core/i18n/catalogues';
import { App } from './app';

describe('App', () => {
  let fixture: ComponentFixture<App>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        provideRouter([]),
        provideTranslateService({
          fallbackLang: 'en',
          loader: { provide: TranslateLoader, useValue: catalogueLoader },
        }),
      ],
    });
    fixture = TestBed.createComponent(App);
    fixture.detectChanges();
  });

  it('renders the toast once, next to the router outlet and outside the pages', () => {
    const host = fixture.nativeElement as HTMLElement;
    const toasts = host.querySelectorAll('app-toast');
    expect(toasts).toHaveLength(1);
    expect(toasts[0].parentElement).toBe(host);
  });
});
