// vite-plugin-ssr executes all route functions, so it runs every page render
import type { PageContext, PageRoutingFunction } from '#types';

interface PageRouteParameters extends Record<string, string> {
  slug?: string;
}

const route: PageRoutingFunction<PageRouteParameters> = (pageContext: PageContext) => {
  // post.page.tsx should be used for /post/@slug

  if (!pageContext.urlPathname)
    return false;
  let url = pageContext.urlPathname;
  // we want to show blog pages on the index too, let's override '/'
  if (!url.startsWith('/post/')) {
    return false;
  }
  // remove /post/
  url = url.slice(6);

  // try to find page number
  if (!url || url.length < 1)
    return false;

  const slug = url.split('/', 1)[0];

  if (!slug || slug === '')
    return false;

  return {
    routeParams: {
      slug,
    }
  };
};

export default route;