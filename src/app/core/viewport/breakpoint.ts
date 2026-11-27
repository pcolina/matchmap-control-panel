import { DestroyRef, Injectable, inject, signal } from '@angular/core';
import { DOCUMENT } from '@angular/common';

export const NARROW_BREAKPOINT_PX = 768;

export const isNarrow = (width: number): boolean => width < NARROW_BREAKPOINT_PX;

export const NARROW_MEDIA_QUERY = `(max-width: ${NARROW_BREAKPOINT_PX - 0.02}px)`;

@Injectable({ providedIn: 'root' })
export class Viewport {
  private readonly win = inject(DOCUMENT).defaultView;
  readonly narrow = signal(this.win ? isNarrow(this.win.innerWidth) : false);

  constructor() {
    const win = this.win;
    if (!win || typeof win.matchMedia !== 'function') {
      return;
    }
    const query = win.matchMedia(NARROW_MEDIA_QUERY);
    const onChange = (event: MediaQueryListEvent) => this.narrow.set(event.matches);
    query.addEventListener('change', onChange);
    inject(DestroyRef).onDestroy(() => query.removeEventListener('change', onChange));
  }
}
