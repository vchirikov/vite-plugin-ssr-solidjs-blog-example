/** @file contains route hooks, works on environment: server, client */
import { createUrlLocaleDetector } from '#shared/i18n/url-locale-detector';
import { isBrowser } from '#shared/utils';
import type { PageContext } from '#types';

export function onBeforeRoute(pageContext: PageContext) {
  console.log(pageContext, JSON.stringify(pageContext.exportsAll));
  const detectors = [];
  // if (isBrowser()) {
  //   detectors.push();
  // }
  // else {

  // }

  return {
    pageContext: {
      // We make `locale` available as `pageContext.locale`
      locale: 'en',
      // We overwrite `pageContext.urlOriginal`
      //urlOriginal: urlWithoutLocale
      urlOriginal: pageContext.urlOriginal
    }
  };
}

