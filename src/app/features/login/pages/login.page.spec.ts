import { HttpErrorResponse } from '@angular/common/http';
import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, provideRouter, Router } from '@angular/router';
import { provideIcons } from '@ng-icons/core';
import * as icons from '@ng-icons/tabler-icons';
import { provideTranslateService, TranslateLoader, TranslateService } from '@ngx-translate/core';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { catalogueLoader } from '../../../core/i18n/catalogues';
import { AuthStore } from '../../../core/auth/auth.store';
import { LoginPage } from './login.page';

describe('LoginPage', () => {
  let fixture: ComponentFixture<LoginPage>;
  let login: ReturnType<typeof vi.fn>;
  let router: Router;

  const text = () => fixture.nativeElement.textContent as string;

  beforeEach(() => {
    login = vi.fn(async () => undefined);
    TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        provideRouter([]),
        provideIcons(icons),
        provideTranslateService({
          fallbackLang: 'en',
          loader: { provide: TranslateLoader, useValue: catalogueLoader },
        }),
        { provide: AuthStore, useValue: { login } },
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { queryParamMap: { get: () => null } } },
        },
      ],
    });
    TestBed.inject(TranslateService).use('en');
    router = TestBed.inject(Router);
    vi.spyOn(router, 'navigateByUrl').mockResolvedValue(true);
    fixture = TestBed.createComponent(LoginPage);
    fixture.detectChanges();
  });

  it('signs in with the email and password typed', async () => {
    fixture.componentInstance.email.set('ana@example.com');
    fixture.componentInstance.password.set('secret');

    await fixture.componentInstance.submit();

    expect(login).toHaveBeenCalledWith('ana@example.com', 'secret');
  });

  it('opens the home page after signing in when there is no return address', async () => {
    fixture.componentInstance.email.set('ana@example.com');
    fixture.componentInstance.password.set('secret');

    await fixture.componentInstance.submit();

    expect(router.navigateByUrl).toHaveBeenCalledWith('/home');
  });

  it('shows the generic error and stays on the page when the credentials are wrong', async () => {
    login.mockRejectedValueOnce(
      new HttpErrorResponse({
        status: 401,
        error: { error: 'invalid_credentials' },
      }),
    );
    fixture.componentInstance.email.set('ana@example.com');
    fixture.componentInstance.password.set('wrong');

    await fixture.componentInstance.submit();
    fixture.detectChanges();

    expect(text()).toContain('The email or password is not valid.');
    expect(router.navigateByUrl).not.toHaveBeenCalled();
  });
});
