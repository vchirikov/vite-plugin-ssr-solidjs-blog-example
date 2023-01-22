import { hydrate, render as renderSolid } from 'solid-js/web';
import * as jsxRuntime from 'solid-jsx';

import { ContainerContext } from '#client/components/container-context';
import { Counter } from '#client/components/counter';
import { createScoped } from '#client/container';
import { pageDisposer } from '#client/render/page-disposer';
import type { MdxComponent, PageContext } from '#types';


// we can't really abort hydration in client-side, but just in case
export const hydrationCanBeAborted = true;

export function render(pageContext: PageContext) {
  const container = createScoped(pageContext);

  const { Page, pageProps } = pageContext;
  const $app = document.getElementById('app');

  const code = pageContext.pageProps.mdx as string;

  //const Rendered = new Function(code || '')({ jsxDEV: jsxRuntime.jsxDEV, Fragment: jsxRuntime.Fragment }).default as MdxComponent;
  const Rendered = new Function(code || '')({ ...jsxRuntime }).default as MdxComponent;

  const components = {
    Counter,
  };

  console.log('render1', pageContext.urlPathname);
  console.log('render2', pageContext.urlParsed);

  const page = () => (
    <ContainerContext.Provider value={container}>
      <jsxRuntime.MDXProvider components={components}>
        <Page {...pageProps} />
        Rendered:
        <Rendered />
      </jsxRuntime.MDXProvider>
    </ContainerContext.Provider>
  );

  pageDisposer.dispose();
  pageDisposer.set(pageContext.isHydration ? hydrate(page, $app) : renderSolid(page, $app));
}