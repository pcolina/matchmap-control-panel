export type Language = 'en' | 'es';

export const pickLanguage = (navigatorLanguage: string | undefined): Language =>
  (navigatorLanguage ?? '').toLowerCase().startsWith('es') ? 'es' : 'en';
