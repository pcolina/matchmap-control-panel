import { inject } from '@angular/core';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { firstValueFrom } from 'rxjs';
import { AuthApi } from './auth.api';

export type AuthStatus = 'unknown' | 'signedIn' | 'signedOut';

export const AuthStore = signalStore(
  { providedIn: 'root' },
  withState({
    status: 'unknown' as AuthStatus,
    accessToken: null as string | null,
    role: null as string | null,
  }),
  withMethods((store) => {
    const api = inject(AuthApi);
    let inFlight: Promise<boolean> | null = null;

    const loadRole = async (accessToken: string): Promise<string | null> => {
      try {
        return await firstValueFrom(api.me(accessToken));
      } catch {
        return null;
      }
    };

    const startSession = async (accessToken: string): Promise<void> => {
      const role = await loadRole(accessToken);
      patchState(store, { accessToken, role, status: 'signedIn' });
    };

    const endSession = (): void => {
      patchState(store, { accessToken: null, role: null, status: 'signedOut' });
    };

    const refresh = (): Promise<boolean> => {
      if (inFlight === null) {
        inFlight = (async () => {
          try {
            const tokens = await firstValueFrom(api.refresh());
            await startSession(tokens.accessToken);
            return true;
          } catch {
            endSession();
            return false;
          } finally {
            inFlight = null;
          }
        })();
      }
      return inFlight;
    };

    return {
      async login(email: string, password: string): Promise<void> {
        const tokens = await firstValueFrom(api.login(email, password));
        await startSession(tokens.accessToken);
      },

      refresh,

      async restore(): Promise<void> {
        if (store.status() !== 'unknown') {
          return;
        }
        await refresh();
      },

      async logout(): Promise<void> {
        await firstValueFrom(api.logout()).catch(() => undefined);
        endSession();
      },
    };
  }),
);
