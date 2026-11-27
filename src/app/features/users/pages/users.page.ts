import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-users-page',
  imports: [TranslatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<h1>{{ 'nav.users' | translate }}</h1>`,
})
export class UsersPage {}
