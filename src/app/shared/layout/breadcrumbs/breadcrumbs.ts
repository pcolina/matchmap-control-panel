import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { NgIcon } from '@ng-icons/core';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { filter, map } from 'rxjs';

interface Crumb {
  readonly path: string;
  readonly text: string;
}

@Component({
  selector: 'app-breadcrumbs',
  imports: [RouterLink, NgIcon, TranslatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './breadcrumbs.html',
  styleUrl: './breadcrumbs.css',
})
export class Breadcrumbs {
  private readonly router = inject(Router);
  private readonly translate = inject(TranslateService);

  readonly trail = toSignal(
    this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd),
      map(() => this.buildTrail(this.router.url)),
    ),
    { initialValue: this.buildTrail(this.router.url) },
  );

  private buildTrail(url: string): Crumb[] {
    const segments = url.split(/[?#]/)[0].split('/').filter(Boolean);
    return segments.map((segment, index) => ({
      path: '/' + segments.slice(0, index + 1).join('/'),
      text: this.labelFor(segment),
    }));
  }

  private labelFor(segment: string): string {
    for (const key of [`nav.${segment}`, `breadcrumb.${segment}`]) {
      const translated = this.translate.instant(key);
      if (translated !== key) {
        return translated;
      }
    }
    return segment.charAt(0).toUpperCase() + segment.slice(1);
  }
}
