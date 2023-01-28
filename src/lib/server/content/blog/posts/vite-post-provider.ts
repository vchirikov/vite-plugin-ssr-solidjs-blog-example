import path from 'node:path';

import { injectable } from 'inversify';
import type { MDXModule } from 'mdx/types';
import { sha1 } from 'object-hash';

import type { Frontmatter, Post } from '#shared/content/blog/posts/post';
import type { PostProvider } from '#shared/content/blog/posts/post-provider';
import type { Locales } from '#shared/i18n/i18n-types';

interface CompiledMdx extends MDXModule {
  matter: Frontmatter;
}

// [Vite doesn't support variables in glob](https://github.com/vitejs/vite/blob/167753d3754507430600a1bc2b100ca321b17a86/docs/guide/features.md?plain=1#L450)
// so we have to create different functions here
const importRuPosts = () => Object.entries(import.meta.glob<CompiledMdx>('/_content/ru/**/*.{md,mdx}', { eager: true }));
const importEnPosts = () => Object.entries(import.meta.glob<CompiledMdx>('/_content/en/**/*.{md,mdx}', { eager: true }));


/** Post provider which uses Vite's import.meta.glob to load and compile mdx files (via @mdx-js/rollup) */
@injectable()
export class VitePostProvider implements PostProvider {
  private static readonly extensionRegex = /\.mdx?$/;

  public all(locale: Locales): Post[] {
    // posts are cached by a compiler from @mdx-js/rollup
    const posts = locale === 'en' ? importEnPosts() : importRuPosts();
    return posts.map<Post>(([filepath, entry]) => {
      const post: Post = {
        matter: entry.matter,
        content: entry.default,
        locale,
        slug: path.basename(filepath).replace(VitePostProvider.extensionRegex, ''),
        image_hash: sha1(entry.matter?.image ?? ''),
      };
      // TODO: add generation of the og image

      return post;
    });
  }
  public get(locale: Locales, slug: string): Post {
    throw new Error('Method not implemented.');
  }

}