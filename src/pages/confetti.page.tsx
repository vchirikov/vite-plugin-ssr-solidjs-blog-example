import { createScriptLoader } from '@solid-primitives/script-loader';
import { type Component, createEffect, onCleanup, onMount } from 'solid-js';

import { A } from '#client/components/a';
import { PageDescription } from '#client/components/page-description';

const onClick = () => {
  if (window['confetti']) {
    window['confetti']();
  }
};

export const Page: Component = () => {
  let dispose: () => void;

  onMount(() => {
    const [_, remove] = createScriptLoader({
      src: 'https://cdn.jsdelivr.net/npm/canvas-confetti@1.6.0/dist/confetti.browser.min.js',
    });
    dispose = remove;
  });

  onCleanup(() => {
    if (dispose) {
      dispose();
    }
  });

  return (
    <>
      <PageDescription title='Confetti page' description='Test page with confetti' />
      <h1>Confetti</h1>
      <button onClick={(_event) => onClick()}> Fire confetti </button>
      <A href="/">go back</A>
    </>
  );
};
