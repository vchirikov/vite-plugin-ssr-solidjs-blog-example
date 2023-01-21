import type { JSX, ParentComponent, ParentProps } from 'solid-js';
import type { PageContextBuiltIn } from 'vite-plugin-ssr';
// <doesn't-work-with-nodenext-moduleResolution>
import type { PageContextBuiltInClient as ServerRouter } from 'vite-plugin-ssr/client';
import type { PageContextBuiltInClient as ClientRouter } from 'vite-plugin-ssr/client/router';

// </doesn't-work-with-nodenext-moduleResolution>
import type { Locales } from '#shared/i18n/i18n-types';

export type Page = ParentComponent<PageProps & unknown>;

export interface PageProps extends Record<string, unknown> {
  /** {@link https://vite-plugin-ssr.com/error-page router implementation detail} */
  is404?: boolean;
}

interface PageContextCustom {
  /** baseLocale or current locale */
  locale: Locales;
  // don't change the name `pageProps`, implementation detail
  pageProps?: PageProps;
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



// <mdx>

type MdxComponents = {
  [key in keyof JSX.IntrinsicElements | string]: key extends keyof JSX.IntrinsicElements
  ? ((properties: JSX.IntrinsicElements[key]) => JSX.Element) | keyof JSX.IntrinsicElements
  : (properties: ParentProps) => JSX.Element;
};

interface MDXProperties {
  components?: Partial<MdxComponents>;
  children?: JSX.Element;
  [key: string]: unknown;
}

/**
 * An function component which renders the MDX content using JSX.
 *
 * @param props This value is be available as the named variable `props` inside the MDX component.
 * @returns A JSX element. The meaning of this may depend on the project configuration. I.e. it
 * could be a React, Preact, or Vuex element.
 */
export type MdxComponent = (properties: MDXProperties) => JSX.Element;
// </mdx>