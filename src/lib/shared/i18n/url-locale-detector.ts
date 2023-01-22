import type { LocaleDetector } from 'typesafe-i18n/detectors';

import type { PageContext } from '#types';

import type { Locales } from './i18n-types';
import { locales } from './i18n-util';

const detectLocaleByUrl = (pageContext: PageContext): Locales | null => {
  const url = pageContext.urlParsed.pathname;
  const result = locales.find(locale => url === `/${locale}` || url.startsWith(`/${locale}/`, 0));
  return result ? result : null;
};

// [typesafe-i18n/packages/detectors](https://github.com/ivanhofer/typesafe-i18n/tree/main/packages/detectors)
export const createUrlLocaleDetector = (pageContext: PageContext): LocaleDetector => () => {
  const detected = detectLocaleByUrl(pageContext);
  return detected === null ? [] : [detected];
};