import fs from 'node:fs';
import path from 'node:path';

import type { PageContextBuiltIn } from 'vite-plugin-ssr';
import { prerender } from 'vite-plugin-ssr/dist/cjs/node/prerender.js';
// import { type PrerenderOptions } from 'vite-plugin-ssr/dist/cjs/node/prerender/runPrerender';


//const options: PrerenderOptions = {
const options = {
  onPagePrerender: async (pageContext: PageContextBuiltIn & {
    _prerenderResult: {
      filePath: string,
      fileContent: string,
    };
  }) => {
    const { filePath, fileContent } = pageContext._prerenderResult;
    const { writeFile, mkdir } = fs.promises;

    console.log('#######################################', filePath);
    await mkdir(path.posix.dirname(filePath), { recursive: true });
    await writeFile(filePath, fileContent);
  },
};

await prerender(options);