import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, provideRouter } from '@angular/router';
import { Apollo } from 'apollo-angular';
import { provideIcons } from '@ng-icons/core';
import * as icons from '@ng-icons/tabler-icons';
import { provideTranslateService, TranslateLoader } from '@ngx-translate/core';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { of } from 'rxjs';
import { catalogueLoader } from '../../../core/i18n/catalogues';
import { NotificationStore } from '../../../core/notifications/notification.store';
import { MastersPage } from './masters.page';

describe('MastersPage', () => {
  let show: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    show = vi.fn();
    TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        provideRouter([]),
        provideIcons(icons),
        provideTranslateService({
          fallbackLang: 'en',
          loader: { provide: TranslateLoader, useValue: catalogueLoader },
        }),
        {
          provide: Apollo,
          useValue: {
            watchQuery: () => ({
              valueChanges: of({ loading: false, error: new Error('boom'), data: undefined }),
            }),
          },
        },
        { provide: ActivatedRoute, useValue: { data: of({ master: 'countries' }) } },
        { provide: NotificationStore, useValue: { show } },
      ],
    });
  });

  it('reports a failed load as an error notification', () => {
    TestBed.createComponent(MastersPage);

    expect(show).toHaveBeenCalledWith('error', 'masters.error');
  });
});
