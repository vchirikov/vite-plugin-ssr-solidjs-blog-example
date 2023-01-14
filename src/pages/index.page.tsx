import { type Component, batch, createSignal } from 'solid-js';
import { onMount, useContext } from 'solid-js';

import { ContainerContext } from '#client/components/container-context';
import { Services } from '#client/container';
import type { Logger } from '#shared/diagnostics/logging';

const [state, setState] = createSignal<string>('Pre-rendered (SSG)');
const [containerType, setContainerType] = createSignal<string>('Pre-rendered (SSG)');

export const Page: Component = () => {

  const container = useContext(ContainerContext);
  const logger = container.get<Logger>(Services.Logger);
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

    <a href="/confetti" class="contrast">Navigate to confetti page (via CSR)</a>;
    <a href="/mdx" class="contrast">Navigate MDX (via CSR)</a>;
  </>);
};
