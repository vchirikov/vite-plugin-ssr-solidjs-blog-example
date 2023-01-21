import { type JSX, createMemo, mergeProps, splitProps } from 'solid-js';

import { usePageContext } from '#client/hooks';

export interface AnchorProps extends JSX.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  /** {@link https://vite-plugin-ssr.com/clientRouting#link-prefetching keep-scroll-position} */
  keepScrollPosition?: boolean;
  /** {@link https://vite-plugin-ssr.com/clientRouting#link-prefetching data-prefetch="true"} */
  prefetch?: boolean;
  /**
   * Flag to skip client routing via
   * {@link https://vite-plugin-ssr.com/clientRouting#usage-options rel="external"}
   * it also will be skiped if you use links like `schema://url`
   */
  skipRouting?: boolean;
}

export function A(props: AnchorProps) {
  const pageContext = usePageContext();
  const [our, rest] = splitProps(props, ['href', 'keepScrollPosition', 'prefetch', 'skipRouting', 'rel']);
  const rel = !!our.rel == null
  const isActive = createMemo(() => {
    pageContext.urlPathname;
    return false;
  });

  return (
    <a
      {...rest}
      //href={href() || props.href}
      classList={{
        ...(props.class && { [props.class]: true }),
        ['active']: isActive(),
        ...props.classList
      }}
      aria-current={isActive() ? 'page' : undefined}
    />
  );
}