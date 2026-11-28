import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { canEnterPanel } from './can-enter-panel';
import { AuthStore } from './auth.store';

export const authGuard: CanActivateFn = async (_route, state) => {
  const store = inject(AuthStore);
  const router = inject(Router);

  await store.restore();

  if (store.status() !== 'signedIn') {
    return router.createUrlTree(['/login'], { queryParams: { returnUrl: state.url } });
  }
  if (!canEnterPanel(store.role())) {
    return router.createUrlTree(['/no-permissions']);
  }
  return true;
};
