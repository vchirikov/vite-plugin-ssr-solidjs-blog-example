## Requirements

* nodejs according to [`.nvmrc`](./.nvmrc)

* [pnpm](https://pnpm.io/installation#using-corepack)
  ```sh
  cd ~
  corepack enable
  corepack prepare pnpm@latest --activate
  npm config set store $PWD\.pnpm-store
  npm config set -g store $PWD\.pnpm-store
  # check the path
  pnpm store path
  # time-to-time use prune to cleanup old packages
  pnpm store prune
  ```
  
* [rust](https://rustup.rs) to run install and run `stork`

### Suffixes

There are four page file suffixes:
* `page.js`: runs in the browser as well as in Node.js
* `page.client.js`: runs only in the browser
* `page.server.js`: runs only in Node.js
* `page.route.js`: defines the page's Route String or Route Function.

