import { postProvider } from '#server/content/blog/posts/vite-post-provider';
import { baseLocale, locales } from '#shared/i18n/i18n-util';
import { split2chunks } from '#shared/utils';
import type { AsyncPrerender, PageContext } from '#types';

const pageSize = 6;

export async function onBeforeRender(pageContext: PageContext) {
  const posts = await postProvider.all(pageContext.locale);
  const pagePosts = split2chunks(posts, pageSize);
  const pageNumber = Number.parseInt(pageContext.routeParams.page, 10);
  // page number starts from 1, adjust pageIndex
  const pageIndex = pageNumber - 1;
  const next = (pageIndex < pagePosts.length - 1) ? `/blog/${pageNumber + 1}` : undefined;
  const previous = pageNumber === 1 ? undefined : ((pageNumber === 2) ? '/blog/' : `/blog/${pageNumber - 1}`);
  console.log('index.onBeforeRender', JSON.stringify({
    urlOriginal: pageContext.urlOriginal,
    _urlPristine: pageContext['_urlPristine'],
    locale: pageContext.locale,
    pageProps__locale: pageContext.pageProps?.locale ?? 'undefined',
    _pageContextAlreadyProvidedByPrerenderHook: pageContext['_pageContextAlreadyProvidedByPrerenderHook'],
    _prerenderHookFile: pageContext['_prerenderHookFile']
  }, undefined, 2));
  return {
    pageContext: {
      pageProps: {
        /** routeParams won't be available in a browser, lets use props to pass page */
        page: pageNumber,
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
          // [must not have a trailing slash here](https://github.com/brillout/vite-plugin-ssr/issues/654)
          url: `/blog/${pageIndex + 1}`,
          pageContext: {
            locale,
            pageProps: {
              locale,
              /** routeParams won't be available in a browser, lets use props to pass page */
              page: pageIndex + 1,
              posts: pagePosts,
              next: (pageIndex < pagePosts.length - 1) ? `/blog/${pageIndex + 2}` : undefined,
              previous: pageIndex === 0 ? undefined : ((pageIndex === 1) ? '/blog/' : `/blog/${pageIndex}`)
            }
          }
        })
      );
  });
  const pages = (await Promise.all(promises)).flat();
  const index = pages.find(x => x.url === '/blog/1' && x.pageContext.locale === baseLocale);

  return [...pages,
  {
    ...index,
    url: '/blog',
  },
  {
    ...index,
    url: '/',
  }
  ];
};