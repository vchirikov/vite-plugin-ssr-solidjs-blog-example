import { MetaProvider, renderTags } from '@solidjs/meta';
import { generateHydrationScript, renderToStringAsync } from 'solid-js/web';
import { dangerouslySkipEscape, escapeInject } from 'vite-plugin-ssr';

import { ContainerContext } from '#client/components/container-context';
import { MainLayout } from '#client/render/main-layout';
import { createScoped } from '#server/container';
import TypesafeI18n from '#shared/i18n/i18n-solid';
import { baseLocale, loadedLocales, locales } from '#shared/i18n/i18n-util';
import { loadLocale } from '#shared/i18n/i18n-util.sync';
import type { PageContext, PageContextServer, PrerenderContext } from '#types';

const base = import.meta.env.BASE_URL;

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
          <MainLayout><Page {...pageProps} /></MainLayout>
        </MetaProvider>
      </TypesafeI18n>
    </ContainerContext.Provider>
  );

  /**
   * we can use renderToStream, but in our primary case (ssg) thus it's better to use
   * {@link https://www.solidjs.com/docs/latest/api#rendertostringasync renderToStringAsync}
   */
  const html = await renderToStringAsync(page);

  // See https://vite-plugin-ssr.com/head
  // pageContext.documentProps

  return escapeInject`<!DOCTYPE html>
    <html lang="en">
      <head>
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
      <body>
        <div id="app">${dangerouslySkipEscape(html)}</div>
      </body>
    </html>`;
}

/** Only for SSG */
export function onBeforePrerender(prerenderContext: PrerenderContext) {
  const pageContexts: PageContext[] = [];

  for (const pageContext of prerenderContext.pageContexts) {
    // for the main page we will generate one main page and 2 with locales
    if (pageContext.urlOriginal === '/') {
      pageContexts.push({
        ...pageContext,
        locale: baseLocale
      });
    }
    for (const locale of locales) {
      pageContexts.push({
        ...pageContext,
        urlOriginal: `/${locale}${pageContext.urlOriginal}`,
        locale
      });
    }
  }
  return {
    prerenderContext: {
      pageContexts
    }
  };
}