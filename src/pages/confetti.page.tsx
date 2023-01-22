import { type Component, createEffect, onCleanup, onMount } from 'solid-js';

import { A } from '#client/components/a';

export const Page: Component = () => {

  onMount(() => createEffect(() => {
    console.log('add script');
    if (!window['confetti']) {
      const script = document.createElement('script');
      script.id = 'confetti';
      script.src = 'https://cdn.jsdelivr.net/npm/canvas-confetti@1.6.0/dist/confetti.browser.min.js';
      document.head.appendChild(script);
    }
  }));

  onCleanup(() => {
    // window['confetti'] will remain in memory
    const script = document.getElementById('confetti');
    if (script) {
      script.remove();
    }
  });


  const onClick = () => {
    if (window['confetti']) {
      window['confetti']();
    }
  };

  return (
    <>
      <h1>Confetti</h1>
      <button onClick={(e) => onClick()}> Fire confetti </button>
      <A href="/">go back</A>
    </>
  );
};
