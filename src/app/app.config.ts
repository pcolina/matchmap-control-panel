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
  tablerMenu2,
  tablerSettings,
  tablerShield,
  tablerSpeakerphone,
  tablerUsers,
} from '@ng-icons/tabler-icons';
import { provideTranslateService, TranslateLoader, TranslateService } from '@ngx-translate/core';
import { environment } from '../environments/environment';
import { routes } from './app.routes';
import { catalogueLoader } from './core/i18n/catalogues';
import { setupTranslations } from './core/i18n/setup';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZonelessChangeDetection(),
    provideBrowserGlobalErrorListeners(),
    provideHttpClient(),
    provideApollo(() => ({
      link: inject(HttpLink).create({ uri: environment.apiBaseUrl + '/graphql' }),
      cache: new InMemoryCache(),
    })),
    provideIcons({
      tablerChartBar,
      tablerCoin,
      tablerDatabase,
      tablerHome,
      tablerArrowsMaximize,
      tablerArrowsMinimize,
      tablerMenu2,
      tablerSettings,
      tablerShield,
      tablerSpeakerphone,
      tablerUsers,
    }),
    provideRouter(routes),
    provideTranslateService({
      fallbackLang: 'en',
      loader: { provide: TranslateLoader, useValue: catalogueLoader },
    }),
    provideAppInitializer(() => setupTranslations(inject(TranslateService), navigator.language)),
  ],
};
