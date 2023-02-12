//import { type Component, createMemo, For, type JSX, Show } from 'solid-js';
import * as jsxRuntime from 'solid-jsx';

import { A } from '#client/components/a';
import { components } from '#client/components/blog/mdx-components';
import type { Post } from '#shared/content/blog/posts/post';
import { useI18nContext } from '#shared/i18n/i18n-solid';
import { useConfiguration, usePageContext } from '#client/hooks';
import { Breadcrumbs } from '#client/components/blog';
import { createMemo, ErrorBoundary, Show, Suspense, type Component, type JSX } from 'solid-js';
import { ErrorBoundaryFallback } from '#client/components/error-boundary-fallback';
import { LoadingIndicator } from '#client/components/loading-indicator';
import { NotFound } from '#client/components/not-found';
import { PageDescription } from '#client/components/page-description';

interface Props {
  post?: Post;
}

export const Page: Component<Props> = (props: Props) => {
  const { LL } = useI18nContext();
  const cfg = useConfiguration();
  const pageContext = usePageContext();

  const post = createMemo(() => {
    if (!props.post)
      return;
    const mdx = new Function(props.post.code || '')({ ...jsxRuntime }).default;
    return {
      ...props.post,
      component: () => mdx,
      image: `assets/img/generated/${props.post.locale}/${props.post.slug}/${props.post.image_hash}`
    };
  });

  return (
    <div class="flex flex-1 flex-col flex-nowrap pb-3">
      <Show when={post()} fallback={() => <NotFound />}>
        <PageDescription
          title={post().matter.title ?? ''}
          description={post().matter.description ?? ''}
          canonical={post().matter.canonical}
          post={{
            image: post().image,
            date: post().matter.date,
            modified_date: post().matter.modified_date,
          }}
        />
        <figure class="w-full select-none"><img class="w-full rounded rounded-t-md" alt='image for post' src={`${cfg.servedUrl}/${post().image}.svg`} /></figure>
        <div class="text mt-3 flex w-full flex-row items-center justify-between px-4 text-sm">
          <Breadcrumbs url={pageContext.urlPathname} title={props.post.matter?.title ?? ''} />
          <button class="btn btn-xs btn-ghost gap-2" onClick={() => history.back()}>
            {LL().back()}
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="h-4 w-4">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" />
            </svg>
          </button>
        </div>

        <article class="prose-neutral prose prose-img:mx-auto prose-img:select-none mt-6 h-full w-full max-w-none px-3 lg:px-5">
          <ErrorBoundary fallback={(error, reset) => <ErrorBoundaryFallback reset={reset} error={error} />}>
            {/* mdx could use a dynamic-loaded components, so we should use loading indicator here */}
            <Suspense fallback={<LoadingIndicator />}>
              <jsxRuntime.MDXProvider components={components}>
                {post().component()}
              </jsxRuntime.MDXProvider>
            </Suspense>
          </ErrorBoundary>
        </article>
      </Show>
    </div>

  );
};