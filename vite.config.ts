import * as path from 'node:path';

import type { UserConfigExport } from 'vite';
import solid from 'vite-plugin-solid';
import ssr from 'vite-plugin-ssr/plugin';
import type { UserConfigExport as VitestConfig } from 'vitest/config';

import { mdx } from './build/vite-plugin-mdx';
import { createForLocale } from './src/lib/server/content/blog/posts/create-compile-options';
import { locales } from './src/lib/shared/i18n/i18n-util';

const stripTrailingSlash = (str: string): string => (str.endsWith('/') ? str.slice(0, -1) : str);

/** use this in OpenGraph meta tags and other places where do you need the full path, overwise use basePath */
// '//' will be used, because we always use it like `${process.env.servedUrl}/something` -> `//something`
let servedUrl = '/';
let basePath = '';

if (process.env.servedUrl && process.env.servedUrl !== '/') {
  servedUrl = stripTrailingSlash(process.env.servedUrl);
  basePath = stripTrailingSlash(new URL(servedUrl).pathname);
}
if (process.env.basePath) basePath = stripTrailingSlash(process.env.basePath);

// for where defines don't work
process.env.basePath = basePath;
process.env.servedUrl = servedUrl;

const server = new URL(servedUrl === '/' ? 'http://localhost:3000/' : servedUrl);

// eslint-disable-next-line unicorn/prefer-module
const rootDir = path.resolve(__dirname);

const mdxPlugins = locales.map(locale => mdx({
  ...createForLocale(locale),
  include: `_content/${locale}/*.{mdx,md}`,
  compress: process.env.NODE_ENV === 'production',
}));


/** {@link  https://vitejs.dev/config/ } */
const config: UserConfigExport & VitestConfig = {
  base: servedUrl,
  publicDir: 'public',
  plugins: [
    /**
     * you can use use solid.babel transforms or something like
     * [vite-plugin-react-remove-attributes](https://www.npmjs.com/package/vite-plugin-react-remove-attributes)
     * to remove data-testid attributes in production builds, although I don't know how much build-time it will add
     */
    solid({
      ssr: true,
      solid: {
        hydratable: true,
      },
    }),
    ssr({
      baseAssets: servedUrl,
      baseServer: basePath === '' ? '/' : basePath,
      prerender: {
        noExtraDir: false,
        partial: true,
        parallel: true,
        // we can disable ssg during build time and might provide our custom pageContextInit
        // with some hooks to work with in pageContext.exports or something like this ¯\(°_o)/¯
        disableAutoRun: false,
      },
      /**
       * We can disable
       * {@link https://vite-plugin-ssr.com/disableAutoFullBuild#page-content auto-build}
       * although we must to build dist/server/ to use ssg anyway
       */
      disableAutoFullBuild: false,
    }),
    ...mdxPlugins,
  ],
  server: {
    host: server.hostname,
    port: Number(server.port),
  },
  build: {
    target: 'esnext',
    // don't use [cssCodeSplit=false with vps](https://github.com/brillout/vite-plugin-ssr/issues/644)
    cssCodeSplit: true,
    modulePreload: {
      polyfill: false,
    },
  },
  define: {
    'process.env.servedUrl': JSON.stringify(servedUrl),
    'process.env.basePath': JSON.stringify(basePath),
    'process.env.npm_package_version': JSON.stringify(process.env.npm_package_version),
  },
  resolve: {
    // for vitest + happy-dom
    conditions: ['development', 'browser'],
    alias: [
      { find: '#types', replacement: path.resolve(rootDir, 'src', 'types', 'types.ts') },
      { find: '#shared', replacement: path.resolve(rootDir, 'src', 'lib', 'shared') },
      { find: '#client', replacement: path.resolve(rootDir, 'src', 'lib', 'client') },
      { find: '#server', replacement: path.resolve(rootDir, 'src', 'lib', 'server') },
      { find: '#src', replacement: path.resolve(rootDir, 'src') },
      { find: '#tests', replacement: path.resolve(rootDir, 'tests') },
      { find: '#root', replacement: rootDir },
    ]
  },
  test: {
    // @testing-library/jest-dom wants the global expect method, but we don't want to expose it globally
    // we use the trick in setupFiles with manual extending the expect method
    globals: false,
    // https://vitest.dev/guide/environment.html#test-environment
    environment: 'happy-dom',
    transformMode: {
      web: [/\.tsx?$/],
    },
    include: ['./tests/**/*.tests.{ts,tsx}'],
    setupFiles: ['./tests/vitest.setup.ts'],
    threads: true,
    // if something won't work try to set this to false
    isolate: false,
    deps: {
      // otherwise, solid would be loaded twice
      // info from: https://github.com/solidjs/templates/blob/master/js-vitest/vite.config.js
      // anyway using vite specific node-loader is ok
      registerNodeLoader: true,
      fallbackCJS: true,
    }
  },
};


export default config;