/** @file contains functions related to container for testing */

import { render as renderSolid } from '@solidjs/testing-library';
import type { Container } from 'inversify';
import type { JSX } from 'solid-js/jsx-runtime';

import { ContainerContext } from '#client/components/container-context';
import { createScoped } from '#client/container';
import type { Page, PageContext } from '#types';


export function createContainer(configureContext?: (pageContext: PageContext) => void): Container {

  const page: Page = (props) => (<>{props.children}</>);

  /** the full url of the page: 'https://example.com/some-base-url/product/42?details=yes&fruit=apple&fruit=orange#reviews'; */
  const urlParsed = {
    origin: 'https://example.com',
    // TODO: check with our without search & hash
    pathname: '/product/42?details=yes&fruit=apple&fruit=orange#reviews',
    // TODO: check with our without search & hash
    pathnameOriginal: '/some-base-url/product/42?details=yes&fruit=apple&fruit=orange#reviews',
    search: {
      details: 'yes',
      // TODO check this
      fruit: 'apple'
    },
    searchAll: {
      details: ['yes'],
      // TODO check this
      fruit: ['apple', 'orange']
    },
    // TODO: check this, should include hash or not
    searchOriginal: '?details=yes&fruit=apple&fruit=orange#reviews',
    hash: 'reviews',
    hashOriginal: 'reviews',
    hashString: null,
    searchString: null,
  };

  const pageContext: PageContext = {
    isHydration: false,
    locale: 'en',
    isBackwardNavigation: false,
    is404: false,
    urlPathname: '/blog/10FF',
    urlOriginal: 'http://somesite.com/blog/10FF',
    exports: {},
    exportsAll: {},
    Page: page,
    routeParams: {
      'productId': '42',
    },
    url: 'http://somesite.com/blog/10FF',
    pageExports: {},
    urlParsed,
  };
  if (configureContext) {
    configureContext(pageContext);
  }
  const container = createScoped(pageContext);

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