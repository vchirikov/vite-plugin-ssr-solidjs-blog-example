import { postProvider } from '#server/content/blog/posts/vite-post-provider';
import { locales } from '#shared/i18n/i18n-util';
import type { AsyncPrerender, PageContext } from '#types';

export async function onBeforeRender(pageContext: PageContext) {
  const post = await postProvider.get(pageContext.locale, pageContext.routeParams.slug);
  console.log('post.onBeforeRender', JSON.stringify({
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
        // [must not have a trailing slash here](https://github.com/brillout/vite-plugin-ssr/issues/654)
        url: `/post/${post.slug}`,
        pageContext: {
          locale,
          pageProps: {
            locale,
            post,
          }
        }
      })
    );
  });
  const posts = (await Promise.all(promises)).flat();
  //console.log(JSON.stringify(posts, undefined, 2));
  return posts;
};