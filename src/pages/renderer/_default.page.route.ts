/** @file contains route hooks, works on environment: server, client */
import { detectLocale } from '#shared/i18n/i18n-util';
import { createUrlLocaleDetector } from '#shared/i18n/url-locale-detector';
import { isBrowser } from '#shared/utils';
import type { PageContext } from '#types';

/**
 * onBeforeRoute:
 * * with clientRouting = false:
 *   - [server] calls with the correct pageContext.urlParsed
 *   - [client] doesn't call
 * * with clientRouting = true:
 *   - [server] calls with the correct pageContext.urlParsed
 *   - [client] calls with empty pageContext (points to the root, pathname is always `/` and pathnameOriginal is a basePath)
 * should return null | undefined | { pageContext: {...} }
 */
export function onBeforeRoute(pageContext: PageContext) {
  console.log('onBeforeRoute', pageContext.urlParsed);
  // see the description, in browser we don't have the real url
  if (isBrowser) {
    return;
  }
  const locale = detectLocale(createUrlLocaleDetector(pageContext));
  // pass to the router url without locale, locale will be provided by pageContext field
  let url = pageContext.urlParsed.pathname;
  if (url === `/${locale}`) {
    url = '/';
  }
  else if (url.startsWith(`/${locale}/`, 0)) {
    url = url.slice(`/${locale}`.length);
  }
  console.log(locale, 'route to', url);

  return {
    pageContext: {
      // we make `locale` available as `pageContext.locale`
      locale,
      // we override the original url to url without locale
      urlOriginal: url
    }
  };
}