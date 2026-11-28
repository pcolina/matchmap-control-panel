import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { NgIcon } from '@ng-icons/core';
import { TranslatePipe } from '@ngx-translate/core';
import { APP_VERSION } from '../../../core/app-info';
import { NavItem } from '../../../core/nav/nav-items';
import { SignOut } from '../sign-out/sign-out';

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, RouterLinkActive, NgIcon, TranslatePipe, SignOut],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
  host: { '[class.sidebar-host--collapsed]': 'collapsed()' },
})
export class Sidebar {
  readonly items = input.required<readonly NavItem[]>();
  readonly collapsed = input(false);
  readonly showToggle = input(true);
  readonly toggle = output<void>();
  readonly version = APP_VERSION;
}
