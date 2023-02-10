import '@abraham/reflection';

import path from 'node:path';

import { injectable } from 'inversify';
import { sha1 } from 'object-hash';

import type { Frontmatter, Post } from '#shared/content/blog/posts/post';
import type { PostProvider } from '#shared/content/blog/posts/post-provider';
import type { Locales } from '#shared/i18n/i18n-types';

interface CompiledMdx {
  matter?: Frontmatter;
  code: string;
}

// [Vite doesn't support variables in glob](https://github.com/vitejs/vite/blob/167753d3754507430600a1bc2b100ca321b17a86/docs/guide/features.md?plain=1#L450)
// so we have to create different functions here, we also don't save eager, because we don't want to have big bundle
const importRuPosts = () => Object.entries(import.meta.glob<CompiledMdx>('/_content/ru/**/*.{md,mdx}', { eager: false }));
const importEnPosts = () => Object.entries(import.meta.glob<CompiledMdx>('/_content/en/**/*.{md,mdx}', { eager: false }));


/** Post provider which uses Vite's import.meta.glob to load and compile mdx files (via @mdx-js/rollup) */
@injectable()
export class VitePostProvider implements PostProvider {

  private static readonly extensionRegex = /\.mdx?$/;

  public async all(locale: Locales): Promise<Post[]> {
    // posts are cached by a compiler from @mdx-js/rollup
    const posts = locale === 'en' ? importEnPosts() : importRuPosts();
    const promises = posts.map<Promise<Post>>(async ([filepath, entry]) => {
      const module: CompiledMdx = await entry();
      const post: Post = {
        matter: module.matter,
        code: module.code,
        filepath: filepath,
        locale,
        slug: path.basename(filepath).replace(VitePostProvider.extensionRegex, ''),
        image_hash: sha1(module.matter?.image ?? ''),
      };
      return post;
    });
    return await Promise.all(promises);
  }

  public get(locale: Locales, slug: string): Promise<Post> {
    throw new Error('Method not implemented.');
  }
}

export const postProvider: VitePostProvider = new VitePostProvider();
