/* eslint-disable unicorn/no-null */

import { describe, expect, it } from 'vitest';

import { A } from '#client/components/a';
import { createContainer, render } from '#tests/container';

describe('A', () => {
  it('should use base path, locale & options', () => {
    const services = createContainer();
    const { container, unmount } = render(
      services,
      () => <A href="/foo" keepScrollPosition={true} rel="nofollow">bar</A>
    );
    const a = container.firstChild as HTMLLinkElement;
    expect(a).toBeTruthy();
    expect(a.href).toBe('/some-base-url/en/foo');
    expect(a).toHaveTextContent('bar');
    unmount();
  });

  it('should be able to override locale', () => {
    const services = createContainer();
    const { container, unmount } = render(
      services,
      () => <A href="/foo" locale={'ru'} keepScrollPosition={true} rel="nofollow">bar</A>
    );
    const a = container.firstChild as HTMLLinkElement;
    expect(a.href).toBe('/some-base-url/ru/foo');
    unmount();
  });

  it('should work without locale', () => {
    const services = createContainer();
    const { container, unmount } = render(
      services,
      () => <A href="/foo" locale={null} keepScrollPosition={true} rel="nofollow">bar</A>
    );
    const a = container.firstChild as HTMLLinkElement;
    expect(a.href).toBe('/some-base-url/foo');
    unmount();
  });

  it('external link should use rel="nofollow,external"', () => {
    const services = createContainer();
    const { container, unmount } = render(
      services,
      () => <A href="http://foo.bar/">bar</A>
    );
    const a = container.firstChild as HTMLLinkElement;
    expect(a).toBeTruthy();
    expect(a.href).toBe('http://foo.bar/');
    expect(a.relList.contains('nofollow')).true;
    expect(a.relList.contains('external')).true;
    expect(a).toHaveTextContent('bar');
    unmount();
  });
  it('should work with class correctly', () => {
    const services = createContainer();
    const { container, unmount } = render(
      services,
      () => <A href="/page" class="test-class" classList={{ ['hello']: true }}>bar</A>
    );
    const a = container.firstChild as HTMLLinkElement;
    expect(a.className.includes('hello')).true;
    expect(a.className.includes('test-class')).true;
    unmount();
  });
});