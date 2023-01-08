import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import preprocess from 'svelte-preprocess';

/** @type {import('@sveltejs/vite-plugin-svelte').Options} */
const config = {
  compilerOptions: {
    hydratable: true,
  },
  /** {@link https://svelte.dev/docs#compile-time-svelte-preprocess} */
  preprocess: [
    vitePreprocess(),
    preprocess({
      postcss: true,
    }),
  ],
};

export default config;
