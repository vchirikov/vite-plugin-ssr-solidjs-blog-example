
import { describe, expect, it } from 'vitest';

import { createThemeSwitcher, type HtmlTagAccessor } from '#client/components/theme-switcher/theme-switcher.internal';
import { createContainer, render } from '#tests/container';

describe('ThemeSwitcher', () => {

  it('should be correctly rendered', () => {
    const services = createContainer();
    let htmlTagTheme;
    const htmlTagAccessor: HtmlTagAccessor = () => ({ setAttribute: (_, value) => { htmlTagTheme = value; } });
    const { container, unmount } = render(
      services,
      () => <>{createThemeSwitcher(htmlTagAccessor)}</>
    );
    expect(htmlTagTheme).oneOf(['dark', 'light'], 'because ssr can\'t have the saved theme, render should use system default');
    expect(container.querySelector('button.btn-active'), 'should set active class on the selected theme').toBeDefined();
    unmount();
  });

});