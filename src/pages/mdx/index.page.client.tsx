import * as jsxRuntime from 'solid-js/h/jsx-runtime';
import { hydrate, render as renderSolid } from 'solid-js/web';

import { ContainerContext } from '#lib/components/container-context';
import { container } from '#lib/container';
import { pageDisposer } from '#root/src/renderer/page-disposer';
import type { PageContext } from '#types';

export const clientRouting = true;
// we can't really abort hydration in client-side, but just in case
export const hydrationCanBeAborted = true;

export function render(pageContext: PageContext) {
  const { Page, pageProps } = pageContext;
  const $app = document.getElementById('app');

  const code = pageContext.pageProps.mdx as string;

  const rendered = new Function(code || '')({ ...jsxRuntime, jsxDEV: jsxRuntime.jsx }).default as (props?: unknown) => unknown;
  window['rendered'] = rendered;

  console.log(code);
  console.log(rendered);

  console.log(rendered());


  const page = () => (
    <ContainerContext.Provider value={container}>
      <Page {...pageProps} />
    </ContainerContext.Provider>
  );

  pageDisposer.dispose();
  pageDisposer.set(pageContext.isHydration ? hydrate(page, $app) : renderSolid(page, $app));
}