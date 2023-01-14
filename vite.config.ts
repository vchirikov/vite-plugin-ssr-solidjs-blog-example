import * as path from 'path';
import type { UserConfigExport } from 'vite';
import solid from 'vite-plugin-solid';
import ssr from 'vite-plugin-ssr/plugin';

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

const rootDir = path.resolve(__dirname);

/** {@link  https://vitejs.dev/config/ } */
const config: UserConfigExport = {
  base: servedUrl,
  // TODO: decide to use assets or public
  publicDir: 'public',
  plugins: [
    solid({
      ssr: true,
      solid: {
        hydratable: true,
      }
    }),
    ssr({
      baseAssets: servedUrl,
      baseServer: servedUrl,
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
  ],
  server: {
    host: server.hostname,
    port: Number(server.port),
  },
  build: {
    target: 'esnext'
  },
  define: {
    'process.env.servedUrl': JSON.stringify(servedUrl),
    'process.env.basePath': JSON.stringify(basePath),
    'process.env.npm_package_version': JSON.stringify(process.env.npm_package_version),
  },
  resolve: {
    alias: [
      { find: '#types', replacement: path.resolve(rootDir, 'src', 'types', 'types.tx') },
      { find: '#shared', replacement: path.resolve(rootDir, 'src', 'lib', 'shared') },
      { find: '#client', replacement: path.resolve(rootDir, 'src', 'lib', 'client') },
      { find: '#server', replacement: path.resolve(rootDir, 'src', 'lib', 'server') },
      { find: '#src', replacement: path.resolve(rootDir, 'src') },
      { find: '#tests', replacement: path.resolve(rootDir, 'tests') },
      { find: '#root', replacement: rootDir },
    ]
  }
};


export default config;