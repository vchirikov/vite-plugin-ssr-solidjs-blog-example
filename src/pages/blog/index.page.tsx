import { type Component, createMemo, For, type JSX, Show, ErrorBoundary, Suspense } from 'solid-js';
import * as jsxRuntime from 'solid-jsx';

import { A } from '#client/components/a';
import { components } from '#client/components/blog/mdx-components';
import type { Post } from '#shared/content/blog/posts/post';
import { useI18nContext } from '#shared/i18n/i18n-solid';
import { ErrorBoundaryFallback } from '#client/components/error-boundary-fallback';
import { LoadingIndicator } from '#client/components/loading-indicator';
import { NotFound } from '#client/components/not-found';
import { PageDescription } from '#client/components/page-description';

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
    <div class="prose-neutral prose prose-img:mx-auto prose-img:select-none mt-6 h-full w-full max-w-none px-3 lg:px-5">
      <PageDescription title={`${LL().page()} ${props.page}`} description={`${LL().page()} ${props.page}`} />
      {/* TODO: change layout */}
      <jsxRuntime.MDXProvider components={components}>
        <For each={posts()} fallback={<NotFound />}>
          {(item, index) => {
            return (
              <ErrorBoundary fallback={(error, reset) => <ErrorBoundaryFallback reset={reset} error={error} />}>
                {/* mdx could use a dynamic-loaded components, so we should use loading indicator here */}
                <Suspense fallback={<LoadingIndicator />}>
                  <div data-index={index()}>{item.component()}</div>
                </Suspense>
              </ErrorBoundary>
            );
          }}
        </For>
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
    </div >
  );
};