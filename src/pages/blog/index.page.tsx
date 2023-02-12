import { type Component, createMemo, For, type JSX, Show } from 'solid-js';
import * as jsxRuntime from 'solid-jsx';

import { A } from '#client/components/a';
import { components } from '#client/components/blog/mdx-components';
import type { Post } from '#shared/content/blog/posts/post';
import { useI18nContext } from '#shared/i18n/i18n-solid';

interface Props {
  posts: Post[];
  /** relative url to the next page if exists */
  next?: string;
  /** relative url to the previous page if exists */
  previous?: string;
}

export const Page: Component<Props> = (props: Props) => {
  const { LL, locale } = useI18nContext();

  const posts = createMemo(() => props.posts.map<Post & { component: () => JSX.Element; }>(post => {
    const mdx = new Function(post.code || '')({ ...jsxRuntime }).default;
    return {
      ...post,
      component: () => mdx,
    };
  }));

  return (
    <jsxRuntime.MDXProvider components={components}>
      <div class="prose-neutral prose prose-img:mx-auto prose-img:select-none mt-6 h-full w-full max-w-none px-3 lg:px-5">
        <For each={posts()} fallback={<div>No items</div>}>
          {(item, index) => <div data-index={index()}>{item.component()}</div>}
        </For>
        <pre>
        {locale}
        {LL().posts_previous()}
        {LL().posts_next()}
        </pre>
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
      </div>
    </jsxRuntime.MDXProvider>
  );
};