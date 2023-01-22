import { generateHydrationScript, renderToStringAsync } from 'solid-js/web';
import * as jsxRuntime from 'solid-jsx';
import { dangerouslySkipEscape, escapeInject } from 'vite-plugin-ssr';

import { ContainerContext } from '#client/components/container-context';
import { Counter } from '#client/components/counter';
import { createScoped } from '#server/container';
import { compileMdx } from '#server/markdown/markdown';
import type { MdxComponent, PageContextServer } from '#types';

const base = import.meta.env.BASE_URL;

// See https://vite-plugin-ssr.com/data-fetching


export async function onBeforeRender(pageContext) {
  const mdx = await compileMdx('\n\n <Counter />', '', 'mdx');
  return {
    pageContext: {
      pageProps: {
        mdx
      }
    }
  };
}

export async function render(pageContext: PageContextServer) {
  const container = createScoped(pageContext);
  const { Page, pageProps } = pageContext;
  const code = pageContext.pageProps.mdx as string;
  const Rendered = new Function(code || '')({ ...jsxRuntime }).default as MdxComponent;

  const components = {
    Counter,
  };
  const page = () => (
    <ContainerContext.Provider value={container}>
      <jsxRuntime.MDXProvider components={components}>
        <Page {...pageProps} />
        Rendered:
        <Rendered />
      </jsxRuntime.MDXProvider>
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
        <link rel="icon" href="${base}logo.svg" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        ${dangerouslySkipEscape(generateHydrationScript())}
      </head>
      <body>
        <div id="app">${dangerouslySkipEscape(html)}</div>
      </body>
    </html>`;
}
