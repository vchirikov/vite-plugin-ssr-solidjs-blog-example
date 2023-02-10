// vite-plugin-ssr executes all route functions, so it runs every page render
import type { PageContext, PageRoutingFunction } from '#types';

interface PageRouteParameters extends Record<string, string> {
  // we show blog index
  page?: string;
}

const route: PageRoutingFunction<PageRouteParameters> = (pageContext: PageContext) => {
  // index.page.tsx should be used for /, /blog, /blog/@page (like /blog/123)

  if (!pageContext.urlPathname)
    return false;
  let url = pageContext.urlPathname;
  // we want to show blog pages on the index too
  if (url === '/') {
    return {
      match: true,
      precedence: 10,
      routeParams: {
        page: '1',
      }
    };
  }
  if (!url.startsWith('/blog')) {
    return false;
  }
  // remove /blog
  url = url.slice(5);

  let page = 1;

  // try to find page number
  if (url !== '' && url !== '/') {
    const pageNum = url.slice(6).split('/', 1);
    if (pageNum && pageNum[0]) {
      const parsed = Number.parseInt(pageNum[0], 10);
      if (parsed && !Number.isNaN(parsed) && parsed > 0)
        page = parsed;
    }
  }

  return {
    routeParams: {
      page: page.toString(),
    }
  };
};

export default route;