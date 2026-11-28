import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { Table, TableModule } from 'primeng/table';
import { NgIcon } from '@ng-icons/core';
import { TranslatePipe } from '@ngx-translate/core';
import { MasterRow } from '../../master-rows';

@Component({
  selector: 'app-master-table',
  imports: [ButtonModule, InputTextModule, NgIcon, TableModule, TranslatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './master-table.html',
  styleUrl: './master-table.css',
})
export class MasterTable {
  readonly columns = input.required<readonly string[]>();
  readonly rows = input.required<readonly MasterRow[]>();

  readonly tableRows = computed(() => [...this.rows()]);
  readonly hasSourceRows = computed(() => this.rows().length > 0);
  readonly pageSizes = [10, 50, 100];

  filterColumn(table: Table, field: string, event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    table.filter(value, field, 'contains');
  }
}
