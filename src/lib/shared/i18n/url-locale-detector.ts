import type { LocaleDetector } from 'typesafe-i18n/detectors';

import type { PageContext } from '#types';

import type { Locales } from './i18n-types';
import { locales } from './i18n-util';

const detectLocaleByUrl = (pageContext: PageContext): Locales | null => {
  const url = pageContext.urlOriginal;
  const result = locales.find(locale => url === `/${locale}` || url.startsWith(`/${locale}/`, 0));
  return result ? result : null;
};

export const createUrlLocaleDetector = (pageContext: PageContext): LocaleDetector => () => {
  const detected = detectLocaleByUrl(pageContext);
  return detected === null ? [] : [detected];
};