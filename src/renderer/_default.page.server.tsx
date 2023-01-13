import { generateHydrationScript, renderToStringAsync } from 'solid-js/web';
import { dangerouslySkipEscape, escapeInject } from 'vite-plugin-ssr';

import { ContainerContext } from '#lib/components/container-context';
import { container } from '#lib/server/container';
import type { PageContextServer } from '#types';

const base = import.meta.env.BASE_URL;

// See https://vite-plugin-ssr.com/data-fetching
export const passToClient = ['pageProps', 'routeParams'];

export async function render(pageContext: PageContextServer) {

  const { Page, pageProps } = pageContext;

  const page = () => (
    <ContainerContext.Provider value={container}>
      <Page {...pageProps} />
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
