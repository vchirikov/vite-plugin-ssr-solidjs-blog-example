import { MetaProvider } from '@solidjs/meta';
import { ErrorBoundary } from 'solid-js';
import { hydrate, render as renderSolid } from 'solid-js/web';

import { ContainerContext } from '#client/components/container-context';
import { ErrorBoundaryFallback } from '#client/components/error-boundary-fallback';
import { createScoped } from '#client/container';
import { MainLayout } from '#client/render/main-layout';
import { pageDisposer } from '#client/render/page-disposer';
import TypesafeI18n from '#shared/i18n/i18n-solid';
import { loadedLocales } from '#shared/i18n/i18n-util';
import { loadLocaleAsync } from '#shared/i18n/i18n-util.async';
import type { PageContext } from '#types';
// by default use server routing,
// because [clientRouting can't be overridden](https://github.com/brillout/vite-plugin-ssr/discussions/605)
// but if you want to use client, but if you want you can enable it:
// export const clientRouting = true;

// we can't really abort hydration in client-side, but just in case
export const hydrationCanBeAborted = true;

export async function render(pageContext: PageContext) {
  const container = createScoped(pageContext);
  const { Page, pageProps, locale, isHydration } = pageContext;
  const $app = document.getElementById('app');
  // to use i18n we should load a locale
  if (!loadedLocales[locale]) {
    await loadLocaleAsync(locale);
  }

  const page = () => (
    <ContainerContext.Provider value={container}>
      <TypesafeI18n locale={locale}>
        <MetaProvider>
          <ErrorBoundary fallback={(error, reset) => <ErrorBoundaryFallback reset={reset} error={error} />}>
            <MainLayout><Page {...pageProps} /></MainLayout>
          </ErrorBoundary>
        </MetaProvider>
      </TypesafeI18n>
    </ContainerContext.Provider>
  );

  pageDisposer.dispose();
  pageDisposer.set(isHydration ? hydrate(page, $app) : renderSolid(page, $app));
}