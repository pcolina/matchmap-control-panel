import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import {
  CLICK_CLOSES_AFTER_MS,
  Notification,
  NotificationStore,
} from '../../../core/notifications/notification.store';

@Component({
  selector: 'app-toast',
  imports: [TranslatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './toast.html',
  styleUrl: './toast.css',
})
export class Toast {
  private readonly store = inject(NotificationStore);

  readonly items = this.store.items;

  close(item: Notification): void {
    if (Date.now() - item.shownAt < CLICK_CLOSES_AFTER_MS) {
      return;
    }
    this.store.dismiss(item.id);
  }
}
