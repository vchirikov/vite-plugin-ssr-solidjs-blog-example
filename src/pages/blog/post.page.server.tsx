import { postProvider } from '#server/content/blog/posts/vite-post-provider';
import { locales } from '#shared/i18n/i18n-util';
import type { AsyncPrerender, PageContext } from '#types';

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

export const prerender: AsyncPrerender = async () => {
  const promises = locales.map(async locale => {
    const posts = await postProvider.all(locale);
    return posts.map((post) => (
      {
        url: `/post/${post.slug}`,
        pageContext: {
          locale,
          pageProps: {
            post,
          }
        }
      })
    );
  });
  return (await Promise.all(promises)).flat();
};