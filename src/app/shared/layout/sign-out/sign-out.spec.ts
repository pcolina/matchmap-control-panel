import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { provideIcons } from '@ng-icons/core';
import * as icons from '@ng-icons/tabler-icons';
import { provideTranslateService, TranslateLoader, TranslateService } from '@ngx-translate/core';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { catalogueLoader } from '../../../core/i18n/catalogues';
import { AuthStore } from '../../../core/auth/auth.store';
import { SignOut } from './sign-out';

describe('SignOut', () => {
  let fixture: ComponentFixture<SignOut>;
  let logout: ReturnType<typeof vi.fn>;
  let router: Router;

  beforeEach(() => {
    logout = vi.fn(async () => undefined);
    TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        provideRouter([]),
        provideIcons(icons),
        provideTranslateService({
          fallbackLang: 'en',
          loader: { provide: TranslateLoader, useValue: catalogueLoader },
        }),
        { provide: AuthStore, useValue: { logout } },
      ],
    });
    TestBed.inject(TranslateService).use('en');
    router = TestBed.inject(Router);
    vi.spyOn(router, 'navigateByUrl').mockResolvedValue(true);
    fixture = TestBed.createComponent(SignOut);
    fixture.detectChanges();
  });

  it('ends the session and shows the sign-in page when the button is pressed', async () => {
    const button = fixture.nativeElement.querySelector('button') as HTMLButtonElement;
    button.click();
    await fixture.whenStable();

    expect(logout).toHaveBeenCalledTimes(1);
    expect(router.navigateByUrl).toHaveBeenCalledWith('/login');
  });

  it('labels the button with the sign-out text', () => {
    const button = fixture.nativeElement.querySelector('button') as HTMLButtonElement;
    expect(button.textContent?.trim()).toBe('Sign out');
  });
});
