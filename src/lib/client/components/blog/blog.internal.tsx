import { type Component, ErrorBoundary, For, type JSX, Suspense } from 'solid-js';

import { useConfiguration } from '#client/hooks';
import type { Post } from '#shared/content/blog/posts/post';

import { A } from '../a';
import { ErrorBoundaryFallback } from '../error-boundary-fallback';
import { LoadingIndicator } from '../loading-indicator';
import { NotFound } from '../not-found';

export type CompiledPost = Post & { component: () => JSX.Element; };

interface Props {
  posts: CompiledPost[];
}

// take sizes from https://daisyui.com/components/artboard/
export const artBoardSizes = {
  xs: { width: 568, height: 320 },
};


export const Blog: Component<Props> = (props: Props) => {
  const cfg = useConfiguration();
  return (
    <ul class="flex flex-1 flex-row flex-wrap items-stretch justify-center">
      <For each={props.posts} fallback={<NotFound />}>
        {(post, index) => {
          return (
            <ErrorBoundary fallback={(error, reset) => <ErrorBoundaryFallback reset={reset} error={error} />}>
              {/* mdx could use a dynamic-loaded components, so we should use loading indicator here */}
              <Suspense fallback={<LoadingIndicator />}>
                <li data-index={index()} class="card bg-base-300 text-base-content border-secondary-content/5
                shadow-base/20 m-3 flex w-full flex-col flex-nowrap items-center
                justify-start overflow-x-clip border shadow lg:w-[28rem] xl:w-[36rem]"
                >
                  <A href={`/post/${post.slug}`} class="w-full select-none">
                    <figure>
                      <img class="w-full" alt={`image for ${post.slug}`} src={`${cfg.servedUrl}/assets/img/generated/${post.locale}/${post.slug}/${post.imageHash}.sm.svg`} width={artBoardSizes.xs.width} height={artBoardSizes.xs.height} />
                    </figure>
                  </A>
                  <div class="card-body flex-nowrap">
                    <h2 class="card-title break-words">
                      <A href={`/post/${post.slug}`}>{post.matter.title}</A>
                    </h2>
                    <p>
                      <A href={`/post/${post.slug}`} class="break-all text-justify">{post.matter.description}</A>
                    </p>
                  </div>
                </li>
              </Suspense>
            </ErrorBoundary>
          );
        }}
      </For>
    </ul>
  );
};