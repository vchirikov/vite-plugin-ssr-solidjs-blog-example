
import { describe, expect, it } from 'vitest';

import { A } from '#client/components/a';
import { createContainer, render } from '#tests/container';

describe('A', () => {
  it('should use base path & options', () => {
    const services = createContainer();
    const { container, unmount } = render(
      services,
      () => <A href="/foo" keepScrollPosition={true} rel="nofollow">bar</A>
    );
    const a = container.firstChild as HTMLLinkElement;
    expect(a).toBeTruthy();
    expect(a.href).toBe('/some-base-url/foo');
    expect(a).toHaveTextContent('bar');
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
});