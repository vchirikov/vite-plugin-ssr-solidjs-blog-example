import type { Frontmatter } from '#lib/server/markdown/frontmatter';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface Window {
    // add global variables here if you want to
  }
}


declare module 'vfile' {
  // let's type `file.data.matter`, matter is hardcoded value from vfile-matter
  interface DataMap {
    matter: Frontmatter;
  }
}

export { };