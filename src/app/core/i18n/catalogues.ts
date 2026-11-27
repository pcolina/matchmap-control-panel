import { of } from 'rxjs';
import { TranslateLoader, TranslationObject } from '@ngx-translate/core';
import { Language } from './language';

export type Catalogue = Record<string, string>;

export const catalogueLoader: TranslateLoader = {
  getTranslation: (lang: string) =>
    of<TranslationObject>(CATALOGUES[lang as Language] ?? CATALOGUES.en),
};

export const CATALOGUES: Record<Language, Catalogue> = {
  en: {
    'brand.name': 'MatchMap',
    'brand.product': 'Control Panel',
    'brand.version': 'Version {{version}}',
    'layout.navigation': 'Main navigation',
    'layout.breadcrumb': 'Breadcrumb',
    'layout.menu.open': 'Open menu',
    'layout.menu.close': 'Close menu',
    'layout.sidebar.collapse': 'Collapse sidebar',
    'layout.sidebar.expand': 'Expand sidebar',
    'nav.home': 'Home',
    'nav.settings': 'Settings',
    'nav.masters': 'Masters',
    'nav.statistics': 'Statistics',
    'nav.users': 'Users',
    'nav.profiles': 'Profiles',
    'nav.marketing': 'Marketing',
    'nav.benefits': 'Benefits',
  },
  es: {
    'brand.name': 'MatchMap',
    'brand.product': 'Control Panel',
    'brand.version': 'Versión {{version}}',
    'layout.navigation': 'Navegación principal',
    'layout.breadcrumb': 'Ruta de navegación',
    'layout.menu.open': 'Abrir menú',
    'layout.menu.close': 'Cerrar menú',
    'layout.sidebar.collapse': 'Contraer barra lateral',
    'layout.sidebar.expand': 'Expandir barra lateral',
    'nav.home': 'Inicio',
    'nav.settings': 'Configuración',
    'nav.masters': 'Maestros',
    'nav.statistics': 'Estadísticas',
    'nav.users': 'Usuarios',
    'nav.profiles': 'Perfiles',
    'nav.marketing': 'Marketing',
    'nav.benefits': 'Beneficios',
  },
};
