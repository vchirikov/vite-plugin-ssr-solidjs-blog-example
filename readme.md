## Developing

> **Warning**
> We cache typesafe-i18n locale at first run and don't reload locale all the time, thus if you add a new
> translate function. restart `pnpm dev` (`vite dev`) to reload locale at nodejs.

## Requirements

* nodejs according to [`.nvmrc`](./.nvmrc)

* [pnpm](https://pnpm.io/installation#using-corepack)
  ```sh
  cd ~
  corepack enable
  corepack prepare pnpm@latest --activate
  # check the path
  pnpm store path
  # time-to-time use prune to cleanup old packages
  pnpm store prune
  ```

### Suffixes

There are four page file suffixes:
* `page.js`: runs in the browser as well as in Node.js
* `page.client.js`: runs only in the browser
* `page.server.js`: runs only in Node.js
* `page.route.js`: defines the page's Route String or Route Function.

---


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


### Debugging vite-plugin-ssr

```ps1
# To debug assets injecting
$env:DEBUG='vps:extractAssets'
pnpm build
# output: `dist/client/manifest.json`
```

### Pre-rendering

1. collect page infos
2. exclude pages with export of `doNotPrerender`
3. call exported `prerender()` in `*.page.server.ts` files -> normalize to `{url, pageContext}[]`, so it's create a list of urls
4. collect page routes from `*.page.route.ts` -> call `onBeforeRoute` with urls collected here ^^
5. call `onBeforePrerender` from `_default.page.server.ts`
6. call `routeAndPrerender()`
    - route part
      * parses url from route function
      * calls `onBeforeRoute(pageContext)` which could return 
        - `_pageId` (should be in `allPageIds` (it's path without `fileType` suffix))
        - `routeParams`
        - `urlOriginal`
      * adds  `_urlPristine` == urlOriginal if `onBeforeRoute` overrides `urlOriginal`
    - render part
      * call `OnBeforeRender()`
      * call `render()` -> get html from && serialize `pageContext`
7. call `prerender404()`
8. foreach `writeHtmlFile(htmlFile & serializedPageContext)`
  * converts `urlOriginal` as a path via `urlToFile()`
  * calls `onPagePrerender(pageContext & _prerenderResult: { filePath, fileContent })` if any or write the file
  * all the same for writing `.pageContext.json`

so the bug is that write uses urlOriginal instead of _urlPristine