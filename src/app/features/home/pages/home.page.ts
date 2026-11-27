import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-home-page',
  imports: [TranslatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<h1>{{ 'nav.home' | translate }}</h1>`,
})
export class HomePage {}
