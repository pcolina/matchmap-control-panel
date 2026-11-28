import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { AuthStore } from '../../../core/auth/auth.store';
import { NotificationStore } from '../../../core/notifications/notification.store';

@Component({
  selector: 'app-login-page',
  imports: [TranslatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './login.page.html',
  styleUrl: './login.page.css',
})
export class LoginPage {
  private readonly store = inject(AuthStore);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly notifications = inject(NotificationStore);

  readonly email = signal('');
  readonly password = signal('');
  readonly submitting = signal(false);

  onSubmit(event: Event): void {
    event.preventDefault();
    void this.submit();
  }

  async submit(): Promise<void> {
    this.submitting.set(true);
    try {
      await this.store.login(this.email().trim(), this.password());
      await this.router.navigateByUrl(this.route.snapshot.queryParamMap.get('returnUrl') ?? '/home');
    } catch {
      this.notifications.show('error', 'login.error');
    } finally {
      this.submitting.set(false);
    }
  }
}
