/**
 * we need to know the relative path inside remark-copy-linked-files plugin
 * for example we have `_content/en/foo.md` which use `_content/en/img/bar.jpg`
 * via `![bar](../img/bar.jpg)` in the markdown, so to correct find the file
 * we should know path of the foo.md, which is `_content/en`. To solve this
 * we can use @mdx-js/mdx, directly but it's better to use @mdx-js/rollup
 * which wraps compile method with cache. To do this we should create
 * NumOfLocales instances of mdx rollup plugin, so this is a place where
 * we store a factory method for the CompileOptions
 */

import { join } from 'node:path';

import type { CompileOptions } from '@mdx-js/mdx';
import sh from 'refractor/lang/bash';
import cs from 'refractor/lang/csharp';
import hcl from 'refractor/lang/hcl';
import js from 'refractor/lang/javascript';
import json from 'refractor/lang/json';
import markdown from 'refractor/lang/markdown';
import xml from 'refractor/lang/markup';
import powershell from 'refractor/lang/powershell';
import sql from 'refractor/lang/sql';
import toml from 'refractor/lang/toml';
import tsx from 'refractor/lang/tsx';
import ts from 'refractor/lang/typescript';
import yaml from 'refractor/lang/yaml';
import { refractor } from 'refractor/lib/core';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeExternalLinks from 'rehype-external-links';
import rehypePrismGenerator from 'rehype-prism-plus/generator';
import rehypeSlug from 'rehype-slug';
/*
 * [this plugin](https://github.com/joostdecock/remark-copy-linked-files) is a fork from [sergioramos/remark-copy-linked-files](https://github.com/sergioramos/remark-copy-linked-files)
 * with sourceDir parameter (because the original doesn't work well without path/pathname option)
 */
// @ ts-ignore
import remarkCopyLinkedFiles from 'remark-copy-linked-files';
import remarkFrontmatter from 'remark-frontmatter';
import gfm from 'remark-gfm';
import remarkMdxFrontmatter from 'remark-mdx-frontmatter';

// do not change this path to alias
import type { Locales } from '../../../../shared/i18n/i18n-types';

export const contentDirectory = join(process.cwd(), '_content');


refractor.register(markdown);
refractor.register(js);
refractor.register(ts);
refractor.register(sh);
refractor.register(powershell);
refractor.register(cs);
refractor.register(sql);
refractor.register(hcl);
refractor.register(json);
refractor.register(yaml);
refractor.register(toml);
refractor.register(xml);
refractor.register(tsx);

refractor.alias({ powershell: ['ps1', 'pwsh', 'powershell', 'ps'] });

const rehypePrism = rehypePrismGenerator(refractor);

export function create(relativePath: string): CompileOptions {
  return (
    {
      baseUrl: process.env.servedUrl ?? process.env.basePath ?? '',
      development: process.env.NODE_ENV === 'development',
      format: 'detect',
      outputFormat: 'program',
      jsxImportSource: 'solid-jsx',
      providerImportSource: 'solid-jsx',
      useDynamicImport: false,
      // md -> md ast
      remarkPlugins: [
        remarkFrontmatter,
        // use the same 'matter' name as vfile-matter for convenient with manual compiling
        [remarkMdxFrontmatter, { name: 'matter' }],
        gfm,
        [
          // @ts-ignore remark-copy-linked-files doesn't have type declarations
          remarkCopyLinkedFiles,
          {
            destinationDir: 'public/assets/md',
            staticPath: 'assets/md',
            sourceDir: relativePath,
            buildUrl: ({ filename, staticPath }: { filename: string; staticPath: string; }) => (
              process.env.basePath
                ? `//${process.env.basePath}/${staticPath}/${filename}`
                : `/${staticPath}/${filename}`
            ),
            // you can use `transformAsset` to do something with images for example
          },
        ],
      ],
      // md ast -> html ast
      rehypePlugins: [
        rehypeSlug,
        [rehypeExternalLinks, { target: '_blank', rel: ['noopener', 'noreferrer'] }],
        [
          rehypeAutolinkHeadings,
          {
            behavior: 'prepend',
            properties: {
              className: 'anchor',
              ariaHidden: true,
              tabIndex: -1,
            },
          },
        ],
        // be careful, some plugins don't work well with remarkCopyLinkedFiles,
        // for example `rehype-img-size` starts reading of files which are not copied yet,
        // thus this might be ended with `error compiling MDX: Empty file`,
        // so if you need add rehype-img-size or something like this you should copy files before build
        // (in npm task `prebuild` for example) and then run the build
        // or find the way how to wait for file copy first (rewrite plugin?)
        [rehypePrism, { ignoreMissing: true, showLineNumbers: true }],
      ],
      remarkRehypeOptions: {
        allowDangerousHtml: true,
      },
    }
  );
}

export function createForLocale(locale: Locales): CompileOptions {
  return create(`_${contentDirectory}/${locale}`);
}

