import type { UserConfigExport } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';

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

// for sveltekit, where defines don't work
process.env.basePath = basePath;
process.env.servedUrl = servedUrl;

const server = new URL(servedUrl === '/' ? 'http://localhost:3000/' : servedUrl);

/** {@link  https://vitejs.dev/config/ } */
const config: UserConfigExport = {
  base: servedUrl,
  plugins: [svelte()],
  server: {
    host: server.hostname,
    port: Number(server.port),
  },
  define: {
    'process.env.servedUrl': JSON.stringify(servedUrl),
    'process.env.basePath': JSON.stringify(basePath),
    'process.env.npm_package_version': JSON.stringify(process.env.npm_package_version),
  }
};


export default config;