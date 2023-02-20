/**
 * We don't need to recreate stork files too frequently
 * So, I decided to run stork cli from npm scripts
 */
import fs from 'node:fs';
import { join } from 'node:path';

import { execa } from 'execa';
import { VFile } from 'vfile';
import { matter } from 'vfile-matter';

import { type Locales } from '../src/lib/shared/i18n/i18n-types';
import { locales } from '../src/lib/shared/i18n/i18n-util';
import { removeTrailingSlash } from '../src/lib/shared/utils/urls';

const contentDirectory = '_content';
const extensionRegex = /\.mdx?$/;

let servedUrl = '/';
let basePath = '';

if (process.env.servedUrl && process.env.servedUrl !== '/') {
  servedUrl = removeTrailingSlash(process.env.servedUrl);
  basePath = removeTrailingSlash(new URL(servedUrl).pathname);
}
if (process.env.basePath) basePath = removeTrailingSlash(process.env.basePath);

/** @link https://stork-search.net/docs/languages mapping  */
const mapLocaleStemming = (locale: Locales) => {
  if (locale === 'ru') return 'Russian';
  if (locale === 'en') return 'English';

  throw new Error(
    `Unknown locale ${locale} for stemming, add mapping first. You can also use None to disable stemming.`,
  );
};

const generateIndexFile = async (locale: Locales): Promise<void> => {
  const posts = await Promise.all(
    (await fs.promises.readdir(join(contentDirectory, locale), { encoding: 'utf8' }))
      .filter(file => extensionRegex.test(file))
      .map(f => join(contentDirectory, locale, f))
      .map(async filePath => {
        const fileContent = await fs.promises.readFile(filePath, 'utf8');
        const file = new VFile({ path: filePath, value: fileContent });
        return matter(file, { strip: true });
      }),
  );

  const files = posts.map(post => ({
    path: post.path,
    url: post.basename.replace(extensionRegex, ''),
    title: post.data.matter.title ?? 'Untitled',
    filetype: 'Markdown',
  }));

  /** @link https://stork-search.net/docs/config-ref */
  const cfg = {
    input: {
      base_directory: basePath,
      stemming: mapLocaleStemming(locale),
      url_prefix: `${basePath}/${locale}/post/`,
      frontmatter_handling: 'Omit',
      files,
    },
    output: {
      debug: false,
    },
  };

  const storkJsonDirectory = join('dist', 'server');

  if (!fs.existsSync(storkJsonDirectory)) {
    fs.mkdirSync(storkJsonDirectory, { recursive: true });
  }
  const storkJsonPath = join(storkJsonDirectory, `${locale}.stork.json`);
  await fs.promises.writeFile(storkJsonPath, JSON.stringify(cfg), { encoding: 'utf8' });

  const storkOutDir = join('public', 'stork');
  if (!fs.existsSync(storkOutDir)) {
    fs.mkdirSync(storkOutDir, { recursive: true });
  }
  const storkIndexPath = join(storkOutDir, `${locale}.st`);
  const stork = execa('stork', ['build', '--input', storkJsonPath, '--output', storkIndexPath], {
    buffer: false,
    stdio: 'inherit',
  });
  try {
    await stork;
  } catch {
    console.log(`Stork build failed for locale ${locale}. ExitCode: ${stork.exitCode}`);
  }
};

async function main() {
  const promises = locales.map(async locale => {
    console.log(`Generate index file for ${locale}`);
    await generateIndexFile(locale);
    console.log(`Created index file public/${locale}.st`);
  });
  await Promise.all(promises);
  console.log('Done.');
}

await main();
