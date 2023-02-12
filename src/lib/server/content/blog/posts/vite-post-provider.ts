import '@abraham/reflection';

import path from 'node:path';

import { injectable } from 'inversify';
import { sha1 } from 'object-hash';

import type { Post } from '#shared/content/blog/posts/post';
import type { PostProvider } from '#shared/content/blog/posts/post-provider';
import type { Locales } from '#shared/i18n/i18n-types';
import type { CompiledMdx } from '#src/types/vfile';

// [Vite doesn't support variables in glob](https://github.com/vitejs/vite/blob/167753d3754507430600a1bc2b100ca321b17a86/docs/guide/features.md?plain=1#L450)
// so we have to create different functions here, we also don't save eager, because we don't want to have big bundle
const importRuPosts = () => Object.entries(import.meta.glob<CompiledMdx>('/_content/ru/**/*.{md,mdx}', { eager: false }));
const importEnPosts = () => Object.entries(import.meta.glob<CompiledMdx>('/_content/en/**/*.{md,mdx}', { eager: false }));


/** Post provider which uses Vite's import.meta.glob to load and compile mdx files (via @mdx-js/rollup) */
@injectable()
export class VitePostProvider implements PostProvider {

  public async all(locale: Locales): Promise<Post[]> {
    // posts are cached by a compiler from mdx-js, so should be fast to do this
    const posts = locale === 'en' ? importEnPosts() : importRuPosts();
    const promises = posts.map<Promise<Post>>(async ([filepath, entry]) => {
      const module: CompiledMdx = await entry();
      const post: Post = {
        matter: module.matter,
        code: module.code,
        filepath: filepath,
        locale,
        slug: path.parse(filepath).name,
        imageHash: sha1(module.matter?.image ?? ''),
      };
      return post;
    });
    return (await Promise.all(promises)).sort((post1, post2) => {
      const date1 = post1.matter.date;
      const date2 = post2.matter.date;
      if (!date1 || !date2) return 0;
      return date1 > date2 ? -1 : 1;
    });
  }

  public async get(locale: Locales, slug?: string): Promise<Post | undefined> {
    if (!slug || slug === '')
      return;
    // posts are cached by a compiler from mdx-js, so should be fast to do this
    const posts = locale === 'en' ? importEnPosts() : importRuPosts();
    const tuple = posts.find(([filepath, _]) => path.parse(filepath).name === slug);

    if (!tuple)
      return;

    const [filepath, entry] = tuple;
    const module: CompiledMdx = await entry();
    const post: Post = {
      matter: module.matter,
      code: module.code,
      filepath: filepath,
      locale,
      slug: path.parse(filepath).name,
      imageHash: module.imageHash,
    };
    return post;
  }
}

export const postProvider: VitePostProvider = new VitePostProvider();
