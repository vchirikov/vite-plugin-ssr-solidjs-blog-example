import { postProvider } from '#server/content/blog/posts/vite-post-provider';
import { locales } from '#shared/i18n/i18n-util';
import type { AsyncPrerender, PageContext } from '#types';

export async function onBeforeRender(pageContext: PageContext) {
  const posts = await postProvider.all(pageContext.locale);

  return {
    pageContext: {
      pageProps: {
        posts
      }
    }
  };
}

export const prerender: AsyncPrerender = async () => {
  const promises = locales.map(locale => postProvider.all(locale));
  const posts = (await Promise.all(promises)).flat();
  //TODO: paginate and return chunks
  return [{
    url: '/blog/1',
    pageContext: {
      pageProps: {
        posts,
        page: 1,
      }
    }
  }];
};