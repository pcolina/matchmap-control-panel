import { DOCUMENT } from '@angular/common';
import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  ElementRef,
  inject,
  Injector,
  signal,
  viewChild,
} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NgIcon } from '@ng-icons/core';
import { TranslatePipe } from '@ngx-translate/core';
import { CURRENT_USER } from '../../../core/nav/profile';
import { NAV_ITEMS, visibleItems } from '../../../core/nav/nav-items';
import { SidebarPreferenceStore } from '../../../core/preferences/sidebar-preference.store';
import { Viewport } from '../../../core/viewport/breakpoint';
import { Sidebar } from '../sidebar/sidebar';
import { Breadcrumbs } from '../breadcrumbs/breadcrumbs';
import { SignOut } from '../sign-out/sign-out';

const FOCUSABLE = 'a[href], button:not([disabled])';

@Component({
  selector: 'app-main-layout',
  imports: [RouterOutlet, Sidebar, Breadcrumbs, NgIcon, TranslatePipe, SignOut],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.css',
  host: {
    '[class.shell--narrow]': 'narrow()',
    '[class.shell--collapsed]': 'collapsed()',
  },
})
export class MainLayout {
  private readonly doc = inject(DOCUMENT);
  private readonly injector = inject(Injector);
  private readonly viewport = inject(Viewport);
  private readonly preferences = inject(SidebarPreferenceStore);

  readonly narrow = this.viewport.narrow;
  readonly collapsed = this.preferences.collapsed;
  readonly items = computed(() => visibleItems(NAV_ITEMS, CURRENT_USER.profile));
  readonly drawerOpen = signal(false);
  readonly drawerClosing = signal(false);

  private readonly menuButton = viewChild<ElementRef<HTMLButtonElement>>('menuButton');
  private readonly drawer = viewChild<ElementRef<HTMLElement>>('drawer');

  constructor() {
    this.preferences.load(CURRENT_USER.id);
    effect(() => {
      if (!this.narrow()) {
        this.finishClose();
      }
    });
  }

  toggleSidebar(): void {
    this.preferences.toggle();
  }

  openDrawer(): void {
    this.drawerClosing.set(false);
    this.drawerOpen.set(true);
    afterNextRender(() => this.focusables()[0]?.focus(), { injector: this.injector });
  }

  closeDrawer(): void {
    if (this.drawerClosing()) {
      return;
    }
    this.menuButton()?.nativeElement.focus();
    if (this.canAnimateClose()) {
      this.drawerClosing.set(true);
    } else {
      this.finishClose();
    }
  }

  onDrawerAnimationEnd(event: AnimationEvent): void {
    if (this.drawerClosing() && event.target === event.currentTarget) {
      this.finishClose();
    }
  }

  onDrawerKeydown(event: KeyboardEvent): void {
    if (this.drawerClosing()) {
      return;
    }
    if (event.key === 'Escape') {
      event.preventDefault();
      this.closeDrawer();
      return;
    }
    if (event.key !== 'Tab') {
      return;
    }
    const items = this.focusables();
    if (items.length === 0) {
      return;
    }
    const first = items[0];
    const last = items[items.length - 1];
    const active = this.doc.activeElement;
    const inside = items.includes(active as HTMLElement);
    if (event.shiftKey && (active === first || !inside)) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && (active === last || !inside)) {
      event.preventDefault();
      first.focus();
    }
  }

  onDrawerClick(event: MouseEvent): void {
    if ((event.target as Element | null)?.closest('a')) {
      this.closeDrawer();
    }
  }

  private finishClose(): void {
    this.drawerClosing.set(false);
    this.drawerOpen.set(false);
  }

  private canAnimateClose(): boolean {
    const panel = this.drawer()?.nativeElement;
    const reduced = this.doc.defaultView?.matchMedia?.('(prefers-reduced-motion: reduce)');
    return !!panel && typeof panel.getAnimations === 'function' && !reduced?.matches;
  }

  private focusables(): HTMLElement[] {
    const root = this.drawer()?.nativeElement;
    return root ? Array.from(root.querySelectorAll<HTMLElement>(FOCUSABLE)) : [];
  }
}
