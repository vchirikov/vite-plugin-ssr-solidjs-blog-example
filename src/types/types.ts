import type { ParentComponent } from 'solid-js';
import type { PageContextBuiltIn } from 'vite-plugin-ssr';
// <doesn't-work-with-nodenext-moduleResolution>
import type { PageContextBuiltInClient as ServerRouter } from 'vite-plugin-ssr/client';
import type { PageContextBuiltInClient as ClientRouter } from 'vite-plugin-ssr/client/router';
// </doesn't-work-with-nodenext-moduleResolution>

type Page = ParentComponent<PageProps & unknown>;

export interface PageProps extends Record<string, unknown> {
  /** {@link https://vite-plugin-ssr.com/error-page router implementation detail} */
  is404?: boolean;
}

interface PageContextCustom {
  // don't change the name `pageProps`, implementation detail
  pageProps?: PageProps;
  urlPathname: string;
  exports: {
    documentProps?: {
      title?: string;
      description?: string;
    };
  };
}

export type PageContextServer = PageContextBuiltIn<Page> & {
  /** the current page was prerendered or not (should be hydrated) */
  isHydration: boolean;
  /**
   * Whether the user is navigating back in history.
   * The value is `true` when the user clicks on his browser's backward navigation button,
   * or when invoking `history.back()`.
   */
  isBackwardNavigation: boolean | null;
} & PageContextCustom;
export type PageContextClient = (ServerRouter<Page> | ClientRouter<Page>) & PageContextCustom;
export type PageContext = PageContextClient | PageContextServer;
