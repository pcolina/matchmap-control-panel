import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { provideIcons } from '@ng-icons/core';
import * as icons from '@ng-icons/tabler-icons';
import { provideTranslateService, TranslateLoader, TranslateService } from '@ngx-translate/core';
import { beforeEach, describe, expect, it } from 'vitest';
import { catalogueLoader } from '../../../../core/i18n/catalogues';
import { MasterRow } from '../../master-rows';
import { MasterTable } from './master-table';

const cities = (count: number): MasterRow[] =>
  Array.from({ length: count }, (_, index) => ({
    id: String(index),
    country: index % 2 ? 'Spain' : 'France',
    city: index < 12 ? `Madrid ${index}` : `Lyon ${index}`,
    latitude: index,
    longitude: -index,
  }));

const settle = (): Promise<void> => new Promise((resolve) => setTimeout(resolve, 400));

describe('MasterTable', () => {
  let fixture: ComponentFixture<MasterTable>;
  const columns = ['country', 'city', 'latitude', 'longitude'];

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
    fixture = TestBed.createComponent(MasterTable);
    fixture.componentRef.setInput('columns', columns);
  });

  const host = (): HTMLElement => fixture.nativeElement as HTMLElement;
  const text = (): string => host().textContent ?? '';
  const bodyRows = (): HTMLElement[] =>
    Array.from(host().querySelectorAll<HTMLElement>('tbody tr')).filter(
      (row) => !row.querySelector('.master-table__empty'),
    );

  const render = async (rows: MasterRow[]): Promise<void> => {
    fixture.componentRef.setInput('rows', rows);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
  };

  const typeInFilter = async (label: string, value: string): Promise<void> => {
    const filter = host().querySelector<HTMLInputElement>(`input[aria-label="${label}"]`);
    expect(filter).not.toBeNull();
    filter!.value = value;
    filter!.dispatchEvent(new Event('input'));
    await settle();
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
  };

  it('shows the header and the empty message when the master has no rows', async () => {
    await render([]);
    expect(text()).toContain('No data in this master table');
    expect(text()).toContain('Country');
    expect(bodyRows()).toHaveLength(0);
  });

  it('paginates 10 rows by default', async () => {
    await render(cities(15));
    expect(bodyRows()).toHaveLength(10);
  });

  it('filters all rows, not only the visible page', async () => {
    await render(cities(15));
    await typeInFilter('Filter by City', 'lyon');
    expect(bodyRows()).toHaveLength(3);
    expect(text()).not.toContain('Madrid');
  });

  it('shows the no-match message when filters match nothing', async () => {
    await render(cities(3));
    await typeInFilter('Filter by City', 'nowhere');
    expect(text()).toContain('No results match the filters');
  });

  it('disables the toolbar and the row action buttons', async () => {
    await render(cities(2));
    const buttons = Array.from(
      host().querySelectorAll<HTMLButtonElement>(
        '.master-table__toolbar button, .master-table__actions button',
      ),
    );
    expect(buttons.length).toBeGreaterThan(0);
    for (const button of buttons) {
      expect(button.disabled).toBe(true);
      expect(button.getAttribute('aria-label')).toBeTruthy();
    }
  });
});
