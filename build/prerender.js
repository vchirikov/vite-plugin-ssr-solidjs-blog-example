/* eslint-disable import/no-extraneous-dependencies */
import fs from 'node:fs';
import path from 'node:path';

import { prerender } from 'vite-plugin-ssr/prerender';


const options = {
  onPagePrerender: async (pageContext) => {
    const { filePath, fileContent } = pageContext._prerenderResult;
    console.log('Writing...', filePath, '_urlPristine:', pageContext._urlPristine, pageContext.locale, pageContext.pageProps.locale);
    const { writeFile, mkdir } = fs.promises;
    await mkdir(path.posix.dirname(filePath), { recursive: true });
    await writeFile(filePath, fileContent);
  },
};

await prerender(options);