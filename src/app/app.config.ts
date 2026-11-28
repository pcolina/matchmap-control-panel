import { provideHttpClient } from '@angular/common/http';
import {
  ApplicationConfig,
  inject,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { InMemoryCache } from '@apollo/client/cache';
import { ApolloLink } from '@apollo/client/link';
import { AuthStore } from './core/auth/auth.store';
import { authLinks, SessionPort } from './core/auth/apollo-auth.link';
import { provideApollo } from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';
import { provideIcons } from '@ng-icons/core';
import {
  tablerChartBar,
  tablerCoin,
  tablerDatabase,
  tablerHome,
  tablerArrowsMaximize,
  tablerArrowsMinimize,
  tablerChevronRight,
  tablerEye,
  tablerLogout,
  tablerMenu2,
  tablerPencil,
  tablerPlus,
  tablerSettings,
  tablerShield,
  tablerSpeakerphone,
  tablerTrash,
  tablerUpload,
  tablerUsers,
} from '@ng-icons/tabler-icons';
import { providePrimeNG } from 'primeng/config';
import { provideTranslateService, TranslateLoader, TranslateService } from '@ngx-translate/core';
import { MatchMapPreset } from './core/theme/primeng-theme';
import { environment } from '../environments/environment';
import { routes } from './app.routes';
import { catalogueLoader } from './core/i18n/catalogues';
import { setupTranslations } from './core/i18n/setup';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZonelessChangeDetection(),
    provideBrowserGlobalErrorListeners(),
    provideHttpClient(),
    provideApollo(() => {
      const store = inject(AuthStore);
      const session: SessionPort = {
        accessToken: () => store.accessToken(),
        refresh: () => store.refresh(),
      };
      return {
        link: ApolloLink.from([
          authLinks(session),
          inject(HttpLink).create({ uri: environment.apiBaseUrl + '/graphql' }),
        ]),
        cache: new InMemoryCache(),
      };
    }),
    provideIcons({
      tablerChartBar,
      tablerCoin,
      tablerDatabase,
      tablerHome,
      tablerArrowsMaximize,
      tablerArrowsMinimize,
      tablerChevronRight,
      tablerEye,
      tablerLogout,
      tablerMenu2,
      tablerPencil,
      tablerPlus,
      tablerSettings,
      tablerShield,
      tablerSpeakerphone,
      tablerTrash,
      tablerUpload,
      tablerUsers,
    }),
    provideRouter(routes),
    providePrimeNG({ theme: { preset: MatchMapPreset } }),
    provideTranslateService({
      fallbackLang: 'en',
      loader: { provide: TranslateLoader, useValue: catalogueLoader },
    }),
    provideAppInitializer(() => setupTranslations(inject(TranslateService), navigator.language)),
  ],
};
