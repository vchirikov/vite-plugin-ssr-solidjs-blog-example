/** @file contains functions related to container for testing */

import { render as renderSolid } from '@solidjs/testing-library';
import type { Container } from 'inversify';

import { ContainerContext } from '#client/components/container-context';
import { createScoped, Services } from '#client/container';
import type { Configuration } from '#shared/configuration';
import type { Page, PageContext } from '#types';

const page: Page = (props) => (<>{props.children}</>);

export function createContainer(configureContext?: (pageContext: PageContext) => void): Container {
  /** the full url of the page: 'https://example.com/some-base-url/product/42?details=yes&fruit=apple&fruit=orange#reviews'; */
  const urlParsed = {
    /** could be null */
    origin: 'https://example.com',
    /** without query string & hash */
    pathname: '/product/42',
    /** without query string & hash */
    pathnameOriginal: '/some-base-url/en/product/42',
    /** could be {} */
    search: {
      details: 'yes',
      // last wins
      fruit: 'orange'
    },
    /** could be {} */
    searchAll: {
      details: ['yes'],
      fruit: ['apple', 'orange']
    },
    /** query string without hash */
    searchOriginal: '?details=yes&fruit=apple&fruit=orange',
    /** empty string mostly, maybe it doesn't work as described */
    hash: 'reviews',
    /** could be null */
    hashOriginal: 'reviews',
    hashString: undefined,
    searchString: undefined,
  };

  const pageContext: PageContext = {
    isHydration: false,
    locale: 'en',
    isBackwardNavigation: false,
    is404: false,
    /** @deprecated */
    urlPathname: urlParsed.pathname,
    urlOriginal: '/some-base-url/en/product/42?details=yes&fruit=apple&fruit=orange#reviews',
    exports: {},
    exportsAll: {},
    Page: page,
    routeParams: {
      'productId': '42',
    },
    url: 'https://example.com/some-base-url/en/product/42?details=yes&fruit=apple&fruit=orange#reviews',
    pageExports: {},
    urlParsed,
  };
  if (configureContext) {
    configureContext(pageContext);
  }
  const container = createScoped(pageContext);

  // to test what our components can work with some-base-url
  container.bind<Configuration>(Services.Configuration).toConstantValue(
    { basePath: '/some-base-url', servedUrl: 'https://example.com/some-base-url/' }
  );

  // add some default testing overrides here

  return container;
}

export const TestingContainer = ContainerContext.Provider;

type RenderReturnType = ReturnType<typeof renderSolid>;
type RenderParams = Parameters<typeof renderSolid>;

/**
 * Render the component within ContainerContext
 * @param container testing container to use
 * @param component lambda () => <Jsx/> to test, without function solidjs doesn't work
 * @param options options for rendering
 * @returns the original return type from render()
 */
export function render(container: Container, component: RenderParams[0], options?: RenderParams[1]): RenderReturnType {
  return renderSolid(() => <TestingContainer value={container}>{component}</TestingContainer>, options);
}