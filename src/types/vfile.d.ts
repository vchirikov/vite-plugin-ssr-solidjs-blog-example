import type { Frontmatter } from '#server/markdown/frontmatter';

declare module 'vfile' {
  // let's type `file.data.matter`, matter is hardcoded value from vfile-matter
  interface DataMap {
    matter: Frontmatter;
  }
}

export { };