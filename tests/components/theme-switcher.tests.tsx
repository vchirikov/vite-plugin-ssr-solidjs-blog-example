
import { describe, expect, it } from 'vitest';

import { ThemeSwitcher } from '#client/components/theme-switcher';
import { createContainer, render } from '#tests/container';

describe('ThemeSwitcher', () => {

  it('should render', () => {
    const services = createContainer();
    const { container, unmount } = render(
      services,
      () => <ThemeSwitcher />
    );
    expect(container).toMatchInlineSnapshot(`
      <div>
        <div
          class="dropdown-end dropdown px-1"
        >
          <label
            class="link text-current opacity-40 hover:text-current hover:opacity-80"
            tabindex="0"
          >
            <svg
              class="fill-current"
              height="24"
              viewBox="0 0 24 24"
              width="24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M11.334 14c.584 2.239 2.001 2.547 2.001 4.02 0 1.094-.896 1.98-2.001 1.98-1.104 0-2.015-.887-2.015-1.98 0-1.473 1.432-1.781 2.015-4.02zm12.666-2c0 6.627-5.373 12-12 12s-12-5.373-12-12 5.373-12 12-12 12 5.373 12 12zm-5.205-7.316l-2.641 2.316h2.791l1.085-.935c-.37-.498-.782-.96-1.235-1.381zm3.205 7.316c0-1.527-.354-2.969-.969-4.265l-4.486 3.902c-1.402 1.226-2.126.041-3.911 1.091-.237.141-.486.185-.71.158-.566-.07-1.018-.594-.941-1.216.024-.205.113-.419.267-.633 1.128-1.571.183-2.49 1.553-3.68l4.435-3.86c-1.527-.943-3.317-1.497-5.238-1.497-5.514 0-10 4.486-10 10s4.486 10 10 10 10-4.486 10-10z"
              />
            </svg>
          </label>
          <div
            class="dropdown-content rounded-box btn-group btn-group-vertical bg-base-100 mt-2 w-28 p-0 shadow"
            tabindex="0"
          >
            <button
              class="btn-ghost btn"
            >
              Dark
            </button>
            <button
              class="btn-active btn"
            >
              Light
            </button>
            <button
              class="btn-ghost btn"
            >
              Berloga
            </button>
          </div>
        </div>
      </div>
    `);
    unmount();
  });

});