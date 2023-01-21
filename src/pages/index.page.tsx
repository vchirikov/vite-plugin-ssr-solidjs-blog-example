import { type Component, batch, createSignal } from 'solid-js';
import { onMount, useContext } from 'solid-js';

import { ContainerContext } from '#client/components/container-context';
import { Services } from '#client/container';
import type { Configuration } from '#shared/configuration';
import type { Logger } from '#shared/diagnostics/logging';

const [state, setState] = createSignal<string>('Pre-rendered (SSG)');
const [containerType, setContainerType] = createSignal<string>('Pre-rendered (SSG)');

export const Page: Component = () => {

  const container = useContext(ContainerContext);
  const logger = container.get<Logger>(Services.Logger);
  const type = container.get<string>(Services.ContainerType);
  const cfg = container.get<Configuration>(Services.Configuration);

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

    <a href={`${cfg.basePath}/confetti`} class="bg-red-400">Navigate to confetti page (via CSR)</a>;
    <a href={`${cfg.servedUrl}/mdx`} class="contrast">Navigate MDX (via CSR)</a>;
  </>);
};
