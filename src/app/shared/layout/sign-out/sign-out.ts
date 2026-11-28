import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { AuthStore } from '../../../core/auth/auth.store';

@Component({
  selector: 'app-sign-out',
  imports: [TranslatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button class="sign-out" type="button" (click)="signOut()">
      {{ 'auth.signOut' | translate }}
    </button>
  `,
  styles: `
    .sign-out {
      min-height: var(--mm-size-touch-target-min);
      padding: 0 var(--mm-space-3);
      background: transparent;
      color: var(--mm-color-textSecondary);
      border: 1px solid var(--mm-color-border);
      border-radius: var(--mm-radius-pill);
      font: inherit;
      cursor: pointer;
    }
  `,
})
export class SignOut {
  private readonly store = inject(AuthStore);
  private readonly router = inject(Router);

  async signOut(): Promise<void> {
    await this.store.logout();
    await this.router.navigateByUrl('/login');
  }
}
