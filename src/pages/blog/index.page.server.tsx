import type { MDXModule } from 'mdx/types';
import * as jsxRuntime from 'solid-jsx';

import { Counter } from '#client/components/counter';


// See https://vite-plugin-ssr.com/data-fetching

// [Vite doesn't support variables in glob](https://github.com/vitejs/vite/blob/167753d3754507430600a1bc2b100ca321b17a86/docs/guide/features.md?plain=1#L450)
// so we have to create different functions here
const importRuPosts = () => Object.entries(import.meta.glob<MDXModule>('/_content/ru/**/*.mdx', { eager: true }));
// const importEnPosts = () => Object.entries(import.meta.glob<MDXModule>('/_content/en/**/*.mdx', { eager: true }));

// export function onBeforeRender(_pageContext) {

//   const components = {
//     Counter,
//   };




//   return {
//     pageContext: {
//       pageProps: {
// //        posts,
//       }
//     },
//   };
// }