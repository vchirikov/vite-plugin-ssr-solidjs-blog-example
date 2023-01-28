import type { MDXContent, MDXModule } from 'mdx/types';
import { type Component, For,type JSX } from 'solid-js';
import * as jsxRuntime from 'solid-jsx';

import { Counter } from '#client/components/counter';
import type { MdxComponent } from '#types';

interface Props {
  posts: string[];
}

const components = {
  Counter,
};

const importRuPosts = () => Object.entries(import.meta.glob<MDXModule>('/_content/ru/**/*.{mdx,md}', { eager: true }));
const posts = importRuPosts().map<MDXContent>(([filepath, entry]) => {
  console.log(filepath);
  return entry.default;
});

export const Page: Component<Props> = (props: Props) => {

  return (
    <jsxRuntime.MDXProvider components={components}>
      <div class="prose-neutral prose prose-img:mx-auto prose-img:select-none mt-6 h-full w-full max-w-none px-3 lg:px-5">
        <For each={posts} fallback={<div>No items</div>}>
          {(item, index) => <div data-index={index()}>{item({})}</div>}
        </For>
      </div>
    </jsxRuntime.MDXProvider>
  );
};