import { hydrate, render as renderSolid } from 'solid-js/web';

import { ContainerContext } from '#client/components/container-context';
import { createScoped } from '#client/container';
import { pageDisposer } from '#client/render/page-disposer';
import TypesafeI18n from '#shared/i18n/i18n-solid';
import type { PageContext } from '#types';

// by default use server routing
//export const clientRouting = false;
// we can't really abort hydration in client-side, but just in case
export const hydrationCanBeAborted = true;

export function render(pageContext: PageContext) {
  const container = createScoped(pageContext);
  const { Page, pageProps, locale, isHydration } = pageContext;
  const $app = document.getElementById('app');
  const page = () => (
    <ContainerContext.Provider value={container}>
      <TypesafeI18n locale={locale}>
        <Page {...pageProps} />
      </TypesafeI18n>
    </ContainerContext.Provider>
  );

  pageDisposer.dispose();
  pageDisposer.set(isHydration ? hydrate(page, $app) : renderSolid(page, $app));
}