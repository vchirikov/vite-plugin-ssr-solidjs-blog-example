import { type Component, createMemo, ErrorBoundary, For, type JSX, Show, Suspense } from 'solid-js';
import * as jsxRuntime from 'solid-jsx';

import { A } from '#client/components/a';
import { Blog } from '#client/components/blog';
import { components } from '#client/components/blog/mdx-components';
import { PageDescription } from '#client/components/page-description';
import type { Post } from '#shared/content/blog/posts/post';
import { useI18nContext } from '#shared/i18n/i18n-solid';

interface Props {
  /** routeParams won't be available in a browser, lets use props to pass page */
  page?: number;
  posts: Post[];
  /** relative url to the next page if exists */
  next?: string;
  /** relative url to the previous page if exists */
  previous?: string;
}

export const Page: Component<Props> = (props: Props) => {
  const { LL } = useI18nContext();

  const posts = createMemo(() => props.posts.map<Post & { component: () => JSX.Element; }>(post => {
    const mdx = new Function(post.code || '')({ ...jsxRuntime }).default;
    return {
      ...post,
      component: () => mdx,
    };
  }));

  return (
    <>
      <PageDescription title={`${LL().page()} ${props.page}`} description={`${LL().page()} ${props.page}`} />
      {/* TODO: change layout */}
      <jsxRuntime.MDXProvider components={components}>
        <Blog posts={posts()} />
      </jsxRuntime.MDXProvider>
      <div class="flex justify-between">
        <Show when={props.previous} >
          <div>
            <A href={props.previous}>{LL().posts_previous()}</A>
          </div>
        </Show>
        <Show when={props.next} >
          <div class="ml-auto text-right">
            <A href={props.next}>{LL().posts_next()}</A>
          </div>
        </Show>
      </div>
    </>
  );
};