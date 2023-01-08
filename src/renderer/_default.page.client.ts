

import type { ComponentConstructorOptions } from 'svelte';

import { container } from '#lib/container';
import type { PageContext, PageProps } from '#types';


async function render(pageContext: PageContext) {
  console.log('exports', pageContext.exports);
  const context = new Map<string, unknown>();
  context.set('container', container);
  context.set('mode', 'client');

  const appRef = document.getElementById('app');
  const ctorArgs: ComponentConstructorOptions<PageProps> = {
    target: appRef,
    hydrate: true,
    props: {
      // TODO: consider to use props to provide container? 🤔
      // sveltekit uses data for props, so let's imitate this
      // data: pageContext.pageProps
    },
    context,
  };
  setTimeout(() => new pageContext.Page(ctorArgs), 1000);

}

export { render };