import type { Frontmatter } from '../lib/shared/content/blog/posts/post';

declare module 'vfile' {
  // let's type `file.data.matter`, matter is hardcoded value from vfile-matter
  interface DataMap {
    matter: Frontmatter;
  }
}

export interface CompiledMdx {
  matter?: Frontmatter;
  code: string;
  imageHash: string;
}
