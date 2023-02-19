import { postProvider } from '#server/content/blog/posts/vite-post-provider';
import type { PageContext } from '#types';

/** Should be called only on dev / ssr, for ssg it shouldn't be called (see prerender hook) */
export async function onBeforeRender(pageContext: PageContext) {
  const post = await postProvider.get(pageContext.locale, pageContext.routeParams.slug);
  return {
    pageContext: {
      pageProps: {
        post,
      }
    }
  };
}

/** to optimize postProvider.all calls we provide contexts in index.page.server.ts instead of post.page.server.ts */
