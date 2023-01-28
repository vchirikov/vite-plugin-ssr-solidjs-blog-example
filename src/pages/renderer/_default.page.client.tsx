import { MetaProvider } from '@solidjs/meta';
import { hydrate, render as renderSolid } from 'solid-js/web';

import { ContainerContext } from '#client/components/container-context';
import { createScoped } from '#client/container';
import { MainLayout } from '#client/render/main-layout';
import { pageDisposer } from '#client/render/page-disposer';
import TypesafeI18n from '#shared/i18n/i18n-solid';
import type { PageContext } from '#types';

// by default use server routing,
// because [clientRouting can't be overridden](https://github.com/brillout/vite-plugin-ssr/discussions/605)
// but if you want to use client, but if you want you can enable it:
// export const clientRouting = true;

// we can't really abort hydration in client-side, but just in case
export const hydrationCanBeAborted = true;

export function render(pageContext: PageContext) {
  const container = createScoped(pageContext);
  const { Page, pageProps, locale, isHydration } = pageContext;
  const $app = document.getElementById('app');
  const page = () => (
    <ContainerContext.Provider value={container}>
      <TypesafeI18n locale={locale}>
        <MetaProvider>
          <MainLayout><Page {...pageProps} /></MainLayout>
        </MetaProvider>
      </TypesafeI18n>
    </ContainerContext.Provider>
  );

  pageDisposer.dispose();
  pageDisposer.set(isHydration ? hydrate(page, $app) : renderSolid(page, $app));
}