import { usePrefersDark } from '@solid-primitives/media';
import { type Component, createRenderEffect, createSignal } from 'solid-js';

import { useLocalStorage } from '#client/hooks';
import { isBrowser } from '#shared/utils';

/** list of available themes should be in sync with daisyuiConfig in tailwind.config.cjs */
export const themes = ['dark', 'light', 'custom'] as const;

export type Theme = typeof themes[number];

const useDarkFallback = true;
export const prefersDark = usePrefersDark(useDarkFallback);
export const [theme, setTheme] = createSignal<Theme>(prefersDark() ? 'dark' : 'light');

const disableAnimation = () => {
  if (isBrowser) {
    const css = document.createElement('style');
    css.append('*{-webkit-transition:none!important;-moz-transition:none!important;-o-transition:none!important;-ms-transition:none!important;transition:none!important}');
    document.head.append(css);
    // Force restyle
    window.getComputedStyle(document.body);
    // wait for next tick before removing
    setTimeout(() => css.remove(), 1);
  }
};

export type HtmlTagAccessor = () => Pick<HTMLElement, 'setAttribute'>;

// is this a global first run across all theme switchers
let isFirstRun = true;
export function createThemeSwitcher(htmlTagAccessor: HtmlTagAccessor): Component {
  const component: Component = () => {
    const storage = useLocalStorage();
    createRenderEffect(() => {
      disableAnimation();
      if (isFirstRun) {
        isFirstRun = false;
        // sync the server.renderer tiny theme script and the solidjs state
        const stored = storage.getItem('theme') as Theme | undefined;
        if (stored && stored != theme()) {
          setTheme(stored);
        }
      }
      const html = htmlTagAccessor();
      html.setAttribute('data-theme', theme());
      storage.setItem('theme', theme());
    });
    return (
      <div class="dropdown-end dropdown px-1">
        <label tabIndex="0" class="link text-current opacity-40 hover:text-current hover:opacity-80">
          <svg class="fill-current" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
            <path d="M11.334 14c.584 2.239 2.001 2.547 2.001 4.02 0 1.094-.896 1.98-2.001 1.98-1.104 0-2.015-.887-2.015-1.98 0-1.473 1.432-1.781 2.015-4.02zm12.666-2c0 6.627-5.373 12-12 12s-12-5.373-12-12 5.373-12 12-12 12 5.373 12 12zm-5.205-7.316l-2.641 2.316h2.791l1.085-.935c-.37-.498-.782-.96-1.235-1.381zm3.205 7.316c0-1.527-.354-2.969-.969-4.265l-4.486 3.902c-1.402 1.226-2.126.041-3.911 1.091-.237.141-.486.185-.71.158-.566-.07-1.018-.594-.941-1.216.024-.205.113-.419.267-.633 1.128-1.571.183-2.49 1.553-3.68l4.435-3.86c-1.527-.943-3.317-1.497-5.238-1.497-5.514 0-10 4.486-10 10s4.486 10 10 10 10-4.486 10-10z" />
          </svg>
        </label>
        <div
          tabIndex="0"
          class="dropdown-content rounded-box btn-group btn-group-vertical bg-base-100 mt-2 w-28 p-0 shadow"
        >
          <button class={theme() === 'dark' ? 'btn-active btn' : 'btn-ghost btn'} onClick={() => setTheme('dark')}>
            Dark
          </button>
          <button class={theme() === 'light' ? 'btn-active btn' : 'btn-ghost btn'} onClick={() => setTheme('light')}>
            Light
          </button>
          <button class={theme() === 'custom' ? 'btn-active btn' : 'btn-ghost btn'} onClick={() => setTheme('custom')}>
            Berloga
          </button>
        </div>
      </div>
    );
  };
  return component;
}
