// eslint-disable-next-line import/no-extraneous-dependencies
import { navigate } from 'vite-plugin-ssr/client/router';

// import { useConfiguration, usePageContext } from '#client/hooks';
import { isBrowser } from '#shared/utils';

type NavigateParameters = Parameters<typeof navigate>;
type NavigateReturn = ReturnType<typeof navigate>;

const completed = Promise.resolve();

/** Navigates to the url */
export function goto(url: string, parameters?: NavigateParameters[1]): NavigateReturn {
  // if it is not browser => do nothing
  if (isBrowser) {
    // contains scheme:// so it's an external url, navigate through redirect
    if (url.indexOf(':') > 0) {
      window.location.href = url;
    }

    // const href = url.startsWith('/')
    //   ? `${useConfiguration().basePath}/${url.slice(1)}`
    //   : `${usePageContext().urlParsed.pathnameOriginal}/${url}`;

    const href = url.startsWith('/') ? `${process.env.basePath}/${url.slice(1)}` : url;

    // we should check it is client routing page or not
    // implementation detail (!)
    const globalNavigate = window['__vite_plugin_ssr']['navigate.ts']['navigate'] as string;

    if (globalNavigate.constructor.name === 'AsyncFunction') {
      console.warn('goto uses navigate for url', url);
      return navigate(href, parameters);
    }
    // we are on page with server-side routing
    else {
      console.warn('goto uses window.location.href for url', url);
      window.location.href = href;
    }
  }
  return completed;
}