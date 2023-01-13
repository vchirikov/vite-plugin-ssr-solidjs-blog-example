import { type Component, createSignal } from 'solid-js';
import { onMount, useContext } from 'solid-js';

import { ContainerContext } from '#lib/components/container-context';
import { Services } from '#lib/container';
import type { Logger } from '#lib/diagnostics/logging';

const [state, setState] = createSignal<string>('Pre-rendered (SSG)');

export const Page: Component = () => {

  const container = useContext(ContainerContext);
  const logger = container.get<Logger>(Services.Logger);
  const containerType = container.get<string>(Services.ContainerType);
  logger.info('container:', containerType);

  onMount(() => {
    setState('Pre-rendered and interactive (hydrated)');
  });

  return (<>
    <ul>
      <li>{state()}</li>
      <li>container used for rendering: {containerType}</li>
    </ul>

    <a href="/confetti" class="contrast">Navigate to confetti page (via CSR)</a>;
    <a href="/mdx" class="contrast">Navigate MDX (via CSR)</a>;
  </>);
};
