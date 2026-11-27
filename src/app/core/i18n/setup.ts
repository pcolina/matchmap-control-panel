import { TranslateService } from '@ngx-translate/core';
import { pickLanguage } from './language';

export const setupTranslations = (translate: TranslateService, navigatorLanguage: string): void => {
  translate.use(pickLanguage(navigatorLanguage));
};
