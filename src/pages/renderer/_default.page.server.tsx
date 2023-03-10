import { MetaProvider, renderTags } from '@solidjs/meta';
import { ErrorBoundary } from 'solid-js';
import { generateHydrationScript, renderToStringAsync } from 'solid-js/web';
import { dangerouslySkipEscape, escapeInject } from 'vite-plugin-ssr';

import { ContainerContext } from '#client/components/container-context';
import { ErrorBoundaryFallback } from '#client/components/error-boundary-fallback';
import { MainLayout } from '#client/render/main-layout';
import { createScoped, Services } from '#server/container';
import type { Configuration } from '#shared/configuration';
import TypesafeI18n from '#shared/i18n/i18n-solid';
import { loadedLocales, locales } from '#shared/i18n/i18n-util';
import { loadLocale } from '#shared/i18n/i18n-util.sync';
import type { PageContext, PageContextServer, PrerenderContext } from '#types';

// See https://vite-plugin-ssr.com/data-fetching
// for server
export const passToClient = [
  'pageProps',
  /** set by onBeforeRoute hook */
  'locale',
  /** <only for server routing> */
  'urlPathname',
  'urlParsed',
  /** </only for server routing> */
];

export async function render(pageContext: PageContextServer) {
  const { Page, pageProps, locale } = pageContext;

  const container = createScoped(pageContext);
  // to use i18n from SSR/SSG we should load a locale
  if (!loadedLocales[locale]) {
    // use the sync version to load in compile-time
    loadLocale(locale);
  }
  const tags = [];
  const page = () => (
    <ContainerContext.Provider value={container}>
      <TypesafeI18n locale={locale}>
        <MetaProvider tags={tags}>
          <ErrorBoundary fallback={(error, reset) => <ErrorBoundaryFallback reset={reset} error={error} />}>
            <MainLayout><Page {...pageProps} /></MainLayout>
          </ErrorBoundary>
        </MetaProvider>
      </TypesafeI18n>
    </ContainerContext.Provider>
  );

  /**
   * we can use renderToStream, but in our primary case (ssg) thus it's better to use
   * {@link https://www.solidjs.com/docs/latest/api#rendertostringasync renderToStringAsync}
   */
  const html = await renderToStringAsync(page);
  const base = container.get<Configuration>(Services.Configuration).servedUrl;
  // we must try to read the selected theme before the actual client-side render to avoid flickering
  const documentHtml = escapeInject`<!DOCTYPE html>
    <html class="flex h-full w-full flex-col flex-nowrap" lang="${locale}">
      <head>
        <script>document.documentElement.setAttribute('data-theme',window.localStorage.getItem('theme'))</script>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <meta name="color-scheme" content="dark light" />
        <link rel="apple-touch-icon" sizes="180x180" href="${base}/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="${base}/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="${base}/favicon-16x16.png" />
        <link rel="icon" href="${base}/favicon.ico" />
        <link rel="manifest" href="${base}/site.webmanifest" />
        ${dangerouslySkipEscape(generateHydrationScript())}
        ${dangerouslySkipEscape(renderTags(tags))}
      </head>
      <body class="flex flex-1 flex-col flex-nowrap">
        <div id="app">${dangerouslySkipEscape(html)}</div>
      </body>
    </html>`;

  return documentHtml;
}

/**
 * Only for SSG, to localize static pages that don't load data (which don't have prerender() hook),
 * note this hook runs after all prerender() calls
 */
export function onBeforePrerender(prerenderContext: PrerenderContext) {
  const pageContexts: PageContext[] = [];

  for (const pageContext of prerenderContext.pageContexts) {
    // page could be already localized by one of our prerender() hooks
    if (pageContext.locale) {
      pageContexts.push(pageContext);
      continue;
    }
    // duplicate the non-localized page for each locale
    for (const locale of locales) {
      pageContexts.push({
        ...pageContext,
        urlOriginal: `/${locale}${pageContext.urlOriginal}`,
        locale,
      });
    }
  }
  return {
    prerenderContext: {
      pageContexts
    }
  };
}