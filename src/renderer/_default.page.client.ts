

import type { ComponentConstructorOptions } from 'svelte';

import { container } from '#lib/container';
import type { PageContext, PageProps } from '#types';

export const clientRouting = true;
// we can't really abort hydration in client-side with svelte, but just in case
export const hydrationCanBeAborted = true;

export function render(pageContext: PageContext) {

  console.log('render start, isHydration:', pageContext.isHydration);
  const context = new Map<string, unknown>();
  context.set('container', container);

  const appRef = document.getElementById('app');

  /**
   * now we are ready to create a component at client-side
   * {@link https://svelte.dev/docs#run-time-client-side-component-api-creating-a-component docs}
   * the existing DOM doesn't need to match the component
   * Svelte will 'repair' the DOM as it goes.
   */

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
  new pageContext.Page(ctorArgs);
  if (pageContext.isHydration) {
    console.log('hydration end');
  }
  console.log('render end');
}