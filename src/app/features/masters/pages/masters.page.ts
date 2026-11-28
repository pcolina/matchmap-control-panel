import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { Apollo } from 'apollo-angular';
import { TranslatePipe } from '@ngx-translate/core';
import { SelectModule } from 'primeng/select';
import { NotificationStore } from '../../../core/notifications/notification.store';
import { catchError, map, of, switchMap } from 'rxjs';
import { CountriesData } from '../data/countries.query';
import { ProhibitedWordsData } from '../data/prohibited-words.query';
import { MasterTable } from '../components/master-table/master-table';
import { MasterSource, queryFor, rowsFor } from '../master-rows';
import {
  DEFAULT_MASTER,
  isMasterSlug,
  MASTER_COLUMNS,
  MASTER_SLUGS,
  MasterSlug,
} from '../masters.model';

type MasterLoad =
  | { readonly status: 'loading' }
  | { readonly status: 'error' }
  | { readonly status: 'ready'; readonly master: MasterSlug; readonly source: MasterSource };

@Component({
  selector: 'app-masters-page',
  imports: [FormsModule, MasterTable, SelectModule, TranslatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './masters.page.html',
  styleUrl: './masters.page.css',
})
export class MastersPage {
  private readonly apollo = inject(Apollo);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly notifications = inject(NotificationStore);

  private failed(): MasterLoad {
    this.notifications.show('error', 'masters.error');
    return { status: 'error' };
  }

  readonly masterOptions = MASTER_SLUGS.map((slug) => ({ value: slug }));

  readonly master = toSignal(
    this.route.data.pipe(
      map((data) => (isMasterSlug(data['master']) ? data['master'] : DEFAULT_MASTER)),
    ),
    { initialValue: DEFAULT_MASTER },
  );

  readonly columns = computed<readonly string[]>(() => MASTER_COLUMNS[this.master()]);

  readonly state = toSignal<MasterLoad, MasterLoad>(
    this.route.data.pipe(
      map((data) => (isMasterSlug(data['master']) ? data['master'] : DEFAULT_MASTER)),
      switchMap((master) =>
        this.apollo.watchQuery<MasterData>({ query: queryFor(master) })
          .valueChanges.pipe(
            map((result): MasterLoad => {
              if (result.error) {
                return this.failed();
              }
              const source = sourceFor(master, result.data as MasterData | undefined);
              if (source) {
                return { status: 'ready', master, source };
              }
              return result.loading ? { status: 'loading' } : this.failed();
            }),
          ),
      ),
      catchError(() => of<MasterLoad>(this.failed())),
    ),
    { initialValue: { status: 'loading' } },
  );

  readonly rows = computed(() => {
    const state = this.state();
    return state.status === 'ready' ? rowsFor(state.master, state.source) : [];
  });

  open(slug: MasterSlug): void {
    void this.router.navigate(['/masters', slug]);
  }
}

type MasterData = Partial<CountriesData & ProhibitedWordsData>;

const sourceFor = (master: MasterSlug, data: MasterData | undefined): MasterSource | undefined => {
  if (!data) {
    return undefined;
  }
  if (master === 'prohibited-words') {
    return data.prohibitedWords ? { prohibitedWords: data.prohibitedWords } : undefined;
  }
  return data.countries ? { countries: data.countries } : undefined;
};
