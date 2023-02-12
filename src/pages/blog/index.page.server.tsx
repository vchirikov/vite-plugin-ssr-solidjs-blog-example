import { postProvider } from '#server/content/blog/posts/vite-post-provider';
import { locales } from '#shared/i18n/i18n-util';
import { split2chunks } from '#shared/utils';
import type { AsyncPrerender, PageContext } from '#types';

const pageSize = 1;

export async function onBeforeRender(pageContext: PageContext) {
  const posts = await postProvider.all(pageContext.locale);
  const pagePosts = split2chunks(posts, pageSize);
  const pageNumber = Number.parseInt(pageContext.routeParams.page, 10);
  // page number starts from 1, adjust pageIndex
  const pageIndex = pageNumber - 1;
  const next = (pageIndex < pagePosts.length - 1) ? `/blog/${pageNumber + 1}` : undefined;
  const previous = pageNumber === 1 ? undefined : ((pageNumber === 2) ? '/blog/' : `/blog/${pageNumber - 1}`);

  return {
    pageContext: {
      pageProps: {
        posts: pagePosts[pageIndex] ?? [],
        next,
        previous,
      }
    }
  };
}

export const prerender: AsyncPrerender = async () => {
  const promises = locales.map(async locale => {
    const posts = await postProvider.all(locale);
    return split2chunks(posts, pageSize)
      .flatMap((pagePosts, pageIndex) => (
        {
          url: `/blog/${pageIndex + 1}`,
          pageContext: {
            locale,
            pageProps: {
              posts: pagePosts,
              next: (pageIndex < pagePosts.length - 1) ? `/blog/${pageIndex + 2}` : undefined,
              previous: pageIndex === 0 ? undefined : ((pageIndex === 1) ? '/blog/' : `/blog/${pageIndex}`)
            }
          }
        })
      );
  });
  return (await Promise.all(promises)).flat();
};