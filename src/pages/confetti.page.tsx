import { createScriptLoader } from '@solid-primitives/script-loader';
import { Title } from '@solidjs/meta';
import { type Component, createEffect, onCleanup, onMount } from 'solid-js';

import { A } from '#client/components/a';



const onClick = () => {
  if (window['confetti']) {
    window['confetti']();
  }
};

export const Page: Component = () => {
  let dispose: () => void;

  onMount(() => {
    const [script, remove] = createScriptLoader({
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
      <Title>Confetti page</Title>
      <h1>Confetti</h1>
      <button onClick={(_event) => onClick()}> Fire confetti </button>
      <A href="/">go back</A>
    </>
  );
};
