import { type Component, createMemo, For, type JSX } from 'solid-js';
import * as jsxRuntime from 'solid-jsx';

import { components } from '#client/components/blog/mdx-components';
import { usePageContext } from '#client/hooks';
import type { Post } from '#shared/content/blog/posts/post';

interface Props {
  posts: Post[];
  page: string;
}

export const Page: Component<Props> = (props: Props) => {
  const pageContext = usePageContext();
  //console.log(pageContext.pageProps);

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
      </div>
    </jsxRuntime.MDXProvider>
  );
};