import { isBrowser } from '#shared/utils';

import { createThemeSwitcher } from './theme-switcher.internal';

export const ThemeSwitcher = isBrowser ? createThemeSwitcher(() => document.documentElement)
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  : createThemeSwitcher(() => ({ setAttribute: (_, __) => { } }));

export { setTheme, theme, themes } from './theme-switcher.internal';
export type { Theme } from './theme-switcher.internal';
