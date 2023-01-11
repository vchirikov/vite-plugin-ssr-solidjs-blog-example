import { dangerouslySkipEscape, escapeInject } from 'vite-plugin-ssr';

import { container } from '#lib/server/container';
import { compileMdx } from '#root/src/lib/server/markdown';
import type { PageContextServer } from '#types';

const base = import.meta.env.BASE_URL;

// See https://vite-plugin-ssr.com/data-fetching
export const passToClient = ['pageProps', 'routeParams'];

export async function onBeforeRender(pageContext) {

  const mdx = await compileMdx('### hello \n **Bold** <Counter />', '', 'mdx');
  return {
    pageContext: {
      pageProps: {
        mdx
      }
    }
  };
}

export function render(pageContext: PageContextServer) {

  const context = new Map<string, unknown>();
  context.set('container', container);
  context.set('mode', 'server');





  const app = pageContext.Page.render(pageContext.pageProps, { context });
  const appHtml = app.html;
  const appCss = app.css.code;
  const appHead = app.head;

  // We are using Svelte's app.head variable rather than the Vite Plugin SSR
  // technique described here: https://vite-plugin-ssr.com/head This seems
  // easier for using data fetched from APIs and also allows us to input the
  // data using our custom MetaTags Svelte component.

  return escapeInject`<!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <link rel="icon" href="${base}logo.svg" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        ${dangerouslySkipEscape(appHead)}
        <style>${appCss}</style>
      </head>
      <body>
        <div id="app">${dangerouslySkipEscape(appHtml)}</div>
      </body>
    </html>`;
}
