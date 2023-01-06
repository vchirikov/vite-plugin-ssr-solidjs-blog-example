## Requirements

* nodejs according to [`.nvmrc`](./.nvmrc)

* [pnpm](https://pnpm.io/installation#using-corepack)
  ```sh
  cd ~
  corepack enable
  corepack prepare pnpm@latest --activate
  ```
  
* [rust](https://rustup.rs) to run install and run `stork`

## Code style

* You can use classes & tailwindcss `@apply` and place them into `<style>` tag (should be after the actual dom) because this is only the way to preserve state with [Svelte + HMR](https://github.com/sveltejs/vite-plugin-svelte/blob/main/docs/faq.md#what-is-the-recommended-node-order-for-svelte-sfc-files). It also might be better for performance, because composition of many classes might took some time from rendering vs one class & build-time `@apply`

* Use single quotes, it's easier to type and code has less visual noise.

* Use `lib/server` for build-time libs, because sveltekit has a guard to prevent you from importing these in client code.

* Recommended structure of `.svelte` file:

  ```xml
  <script lang="ts">
  - import type statements
  - import statements
  - import another types (css, img, other)
  - export variables
  - local variables
  - onMount()
  - onDestroy()
  - other functions
  - reactive statements ($: if(someVariables){})
  </script>

  - HTML/Svelte code

  - <svelte:head> styles

  - <style>
  ```
  
  * Don't use prettier (it's a garbage), but we have to create `.prettierrc` because of buggy svelte LSP  server in vscode which doesn't work with `svelte.plugin.svelte.format.config.singleQuote`


