import { type Component, batch, createSignal } from 'solid-js';
import { onMount } from 'solid-js';

import { A } from '#client/components/a';
import { Services } from '#client/container';
import { useContainer, useLogger } from '#client/hooks';

const [state, setState] = createSignal<string>('Pre-rendered (SSG)');
const [containerType, setContainerType] = createSignal<string>('Pre-rendered (SSG)');

export const Page: Component = () => {

  const container = useContainer();
  const logger = useLogger();
  const type = container.get<string>(Services.ContainerType);

  logger.info('container:', type);

  onMount(() => {
    batch(() => {
      setState('Pre-rendered and interactive (hydrated)');
      setContainerType(type);
    });
  });

  return (<>
    <ul>
      <li>{state()}</li>
      <li>container used for rendering: {containerType()}</li>
    </ul>

    <A href='/confetti' class="bg-red-400">Navigate to confetti page (via CSR)</A>;
    <A href='/mdx' class="contrast">Navigate MDX (via CSR)</A>;
  </>);
};
