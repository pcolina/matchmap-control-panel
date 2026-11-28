import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideIcons } from '@ng-icons/core';
import * as icons from '@ng-icons/tabler-icons';
import { provideTranslateService, TranslateLoader, TranslateService } from '@ngx-translate/core';
import { beforeEach, describe, expect, it } from 'vitest';
import { catalogueLoader } from '../../../core/i18n/catalogues';
import { NoPermissionsPage } from './no-permissions.page';

describe('NoPermissionsPage', () => {
  let fixture: ComponentFixture<NoPermissionsPage>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        provideIcons(icons),
        provideTranslateService({
          fallbackLang: 'en',
          loader: { provide: TranslateLoader, useValue: catalogueLoader },
        }),
      ],
    });
    TestBed.inject(TranslateService).use('en');
    fixture = TestBed.createComponent(NoPermissionsPage);
    fixture.detectChanges();
  });

  it('says the account has no permission to use the panel', () => {
    expect(fixture.nativeElement.textContent).toContain(
      'You do not have permission to use this control panel.',
    );
  });

  it('renders no panel content', () => {
    expect(fixture.nativeElement.querySelector('app-master-table')).toBeNull();
    expect(fixture.nativeElement.querySelector('app-sign-out')).toBeNull();
  });
});
