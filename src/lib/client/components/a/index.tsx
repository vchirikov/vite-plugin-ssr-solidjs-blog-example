import { createMemo, type JSX, splitProps } from 'solid-js';

import { useConfiguration, usePageContext } from '#client/hooks';
import type { Locales } from '#shared/i18n/i18n-types';

export interface AnchorProps extends JSX.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  /** undefined == use page context locale, null = without locale, or the locale param */
  locale?: Locales | null;
  /** {@link https://vite-plugin-ssr.com/clientRouting#link-prefetching keep-scroll-position} */
  keepScrollPosition?: boolean;
  /** {@link https://vite-plugin-ssr.com/clientRouting#link-prefetching data-prefetch="true"} */
  prefetch?: boolean;
  /**
   * Flag to skip client routing via
   * {@link https://vite-plugin-ssr.com/clientRouting#usage-options rel="external"}
   * it also will be skipped if you use links which are not started from `/`
   */
  skipRouting?: boolean;
}

export function A(props: AnchorProps) {
  const pageContext = usePageContext();
  const [our, rest] = splitProps(props, ['href', 'locale', 'keepScrollPosition', 'prefetch', 'skipRouting', 'rel', 'class', 'classList']);
  const isActive = createMemo(() => pageContext.urlPathname === our.href);
  const rel = createMemo(() => {
    const arr: string[] = our.rel?.split(',') ?? [];
    if (our.skipRouting) {
      arr.push('external');
    }
    if (!our.href.startsWith('/')) {
      arr.push('nofollow', 'external');
    }
    if (our.prefetch) {
      arr.push('prefetch');
    }
    return arr.length > 0 ? arr.join(' ') : undefined;
  });
  const href = createMemo(() => {
    const href = our.href;
    // if href is an external link, we do nothing
    if (href.indexOf(':') > 0) {
      return our.href;
    }
    let locale: string;
    if (our.locale === undefined) {
      locale = `/${pageContext.locale}/`;
    }
    else if (our.locale === null) {
      locale = '/';
    }
    else {
      locale = `/${our.locale}/`;
    }
    if (href.startsWith('/')) {
      const cfg = useConfiguration();
      return `${cfg.basePath}${locale}${href.slice(1)}`;
    }
    return `${pageContext.urlParsed.pathnameOriginal}${locale}${href}`;
  });

  return (
    <a
      {...rest}
      href={href()}
      rel={rel()}
      classList={{
        ...(our.class && { [our.class]: true }),
        ['active']: isActive(),
        ...our.classList
      }}
      data-prefetch={our.prefetch}
      keep-scroll-position={our.keepScrollPosition}
      aria-current={isActive() ? 'page' : undefined} />
  );
}