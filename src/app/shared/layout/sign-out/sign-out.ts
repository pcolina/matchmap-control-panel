import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { Router } from '@angular/router';
import { NgIcon } from '@ng-icons/core';
import { TranslatePipe } from '@ngx-translate/core';
import { AuthStore } from '../../../core/auth/auth.store';

@Component({
  selector: 'app-sign-out',
  imports: [NgIcon, TranslatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button
      class="sign-out"
      type="button"
      [attr.aria-label]="'auth.signOut' | translate"
      [title]="'auth.signOut' | translate"
      (click)="signOut()"
    >
      <ng-icon class="sign-out__icon" name="tablerLogout" aria-hidden="true" />
      @if (!collapsed()) {
        <span class="sign-out__label">{{ 'auth.signOut' | translate }}</span>
      }
    </button>
  `,
  styles: `
    .sign-out {
      display: flex;
      align-items: center;
      gap: var(--mm-space-3);
      min-height: var(--mm-size-touch-target-min);
      padding: 0 var(--mm-space-3);
      font-weight: 600;
      font-size: var(--mm-type-label-size);
      background: transparent;
      color: var(--mm-color-textSecondary);
      border: 0;
      border-radius: var(--mm-radius-md);
      font: inherit;
      cursor: pointer;
    }

    .sign-out__icon {
      flex: none;
      font-size: var(--mm-size-icon-md);
    }

    .sign-out:hover {
      color: var(--mm-color-text);
    }

    .sign-out__label {
      white-space: nowrap;
    }
  `,
})
export class SignOut {
  readonly collapsed = input(false);

  private readonly store = inject(AuthStore);
  private readonly router = inject(Router);

  async signOut(): Promise<void> {
    await this.store.logout();
    await this.router.navigateByUrl('/login');
  }
}
