import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { AuthStore } from '../../../core/auth/auth.store';

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

  readonly email = signal('');
  readonly password = signal('');
  readonly error = signal(false);
  readonly submitting = signal(false);

  onSubmit(event: Event): void {
    event.preventDefault();
    void this.submit();
  }

  async submit(): Promise<void> {
    this.error.set(false);
    this.submitting.set(true);
    try {
      await this.store.login(this.email().trim(), this.password());
      await this.router.navigateByUrl(this.route.snapshot.queryParamMap.get('returnUrl') ?? '/home');
    } catch {
      this.error.set(true);
    } finally {
      this.submitting.set(false);
    }
  }
}
