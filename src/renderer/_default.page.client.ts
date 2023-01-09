

import type { ComponentConstructorOptions } from 'svelte';

import { container } from '#lib/container';
import type { PageContext, PageProps } from '#types';

export const clientRouting = true;
export const hydrationCanBeAborted = true;

export async function render(pageContext: PageContext): Promise<void> {

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
  if (pageContext.isHydration) {
    const promise = new Promise<void>(resolve => {
      setTimeout(() => {
        new pageContext.Page(ctorArgs);
        console.log('hydration end');
        resolve();
      }
        , 3000);
    });
    await promise;
  }
  else {
    new pageContext.Page(ctorArgs);
  }

  console.log('render end');
}