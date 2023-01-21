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



---

https://github.com/solidjs/solid-meta


# Testing

`tests/unit` - unit test for services
`tests/components` - test for components
`tests/e2e` - e2e tests with playwright

To write test use:
* [vitest](https://vitest.dev/api/expect.html)
* [testing-library/jest-dom](https://github.com/testing-library/jest-dom#table-of-contents)  
* [happy-dom](https://github.com/capricorn86/happy-dom)  
* [@solidjs/testing-library](https://github.com/solidjs/solid-testing-library)
* [Testing Library API](https://testing-library.com/docs/queries/about)  

It's VERY important to use lambdas where you want to use JSX, only functions will be translated with solidjs,
in other case this JSX will be rendered as static without any context and so on.