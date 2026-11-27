import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-profiles-page',
  imports: [TranslatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<h1>{{ 'nav.profiles' | translate }}</h1>`,
})
export class ProfilesPage {}
