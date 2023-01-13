import { hydrate, render as renderSolid } from 'solid-js/web';

import { ContainerContext } from '#lib/components/container-context';
import { container } from '#lib/container';
import { pageDisposer } from '#src/renderer/page-disposer';
import type { PageContext } from '#types';

export const clientRouting = true;
// we can't really abort hydration in client-side, but just in case
export const hydrationCanBeAborted = true;

export function render(pageContext: PageContext) {
  const { Page, pageProps } = pageContext;
  const $app = document.getElementById('app');
  const page = () => (
    <ContainerContext.Provider value={container}>
      <Page {...pageProps} />
    </ContainerContext.Provider>
  );

  pageDisposer.dispose();
  pageDisposer.set(pageContext.isHydration ? hydrate(page, $app) : renderSolid(page, $app));
}