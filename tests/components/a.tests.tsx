
import { describe, expect, it } from 'vitest';

import { A } from '#client/components/a';
import { createContainer, render } from '#tests/container';

describe('A', () => {
  it('should use options', () => {
    const services = createContainer();
    const { container, unmount } = render(services, () => <A href="/test"></A>);
    expect(container).toBeInTheDocument();
    unmount();
  });
});