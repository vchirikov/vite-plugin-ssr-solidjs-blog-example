import { postProvider } from '#server/content/blog/posts/vite-post-provider';
import { baseLocale, locales } from '#shared/i18n/i18n-util';
import { split2chunks } from '#shared/utils';
import type { AsyncPrerender, PageContext } from '#types';

const pageSize = 6;
/** Should be called only on dev / ssr, for ssg it shouldn't be called (see prerender hook) */
export async function onBeforeRender(pageContext: PageContext) {
  const posts = await postProvider.all(pageContext.locale);
  const postsByPage = split2chunks(posts, pageSize);
  const maxPageNumber = postsByPage.length - 1;
  const pageNumber = Number.parseInt(pageContext.routeParams.page, 10);
  // page number starts from 1, adjust pageIndex
  const pageIndex = pageNumber - 1;
  const next = pageIndex < maxPageNumber ? `/blog/${pageNumber + 1}` : undefined;
  const previous = pageNumber === 1 ? undefined : ((pageNumber === 2) ? '/blog/' : `/blog/${pageNumber - 1}`);
  return {
    pageContext: {
      pageProps: {
        /** routeParams won't be available in a browser, lets use props to pass page */
        page: pageNumber,
        posts: postsByPage[pageIndex] ?? [],
        next,
        previous,
      }
    }
  };
}

export const prerender: AsyncPrerender = async () => {
  const postsByLocale = await Promise.all(locales.map(async locale => (
    {
      locale,
      posts: await postProvider.all(locale)
    }
  )));

  const indexPages = postsByLocale.flatMap(({ locale, posts }) => {
    const postsByPage = split2chunks(posts, pageSize);
    const maxPageNumber = postsByPage.length - 1;
    return postsByPage.flatMap((pagePosts, pageIndex) => {
      const result = [{
        url: `/${locale}/blog/${pageIndex + 1}`,
        pageContext: {
          locale,
          pageProps: {
            locale,
            /** routeParams won't be available in a browser, lets use props to pass page */
            page: pageIndex + 1,
            posts: pagePosts,
            next: pageIndex < maxPageNumber ? `/blog/${pageIndex + 2}` : undefined,
            previous: pageIndex === 0 ? undefined : ((pageIndex === 1) ? '/blog/' : `/blog/${pageIndex}`)
          }
        }
      }];

      if (pageIndex === 0) {
        result.push(
          // add /${locale}/blog/ pageContext as a copy of /${locale}/blog/1
          {
            ...result[0],
            url: `/${locale}/blog`,
          },
          // we also don't use index pages, so let's create them from blog index
          {
            ...result[0],
            url: `/${locale}`,
          }
        );
        // index uses the baseLocale
        if (locale === baseLocale) {
          result.push({ ...result[0], url: '/' });
        }

      }
      return result;
    });
  });

  // to optimize postProvider.all calls count we will prerender post.page here too
  const blogPages = postsByLocale.flatMap(({ locale, posts }) => posts.map((post) => (
    {
      url: `/${locale}/post/${post.slug}`,
      pageContext: {
        locale,
        pageProps: {
          locale,
          post,
        }
      }
    }
  )));

  return [
    ...indexPages,
    ...blogPages,
  ];
};