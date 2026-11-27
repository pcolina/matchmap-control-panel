import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-benefits-page',
  imports: [TranslatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<h1>{{ 'nav.benefits' | translate }}</h1>`,
})
export class BenefitsPage {}
