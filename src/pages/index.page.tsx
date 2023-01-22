import { type Component, batch, createSignal } from 'solid-js';
import { onMount } from 'solid-js';

import { A } from '#client/components/a';
import { Services } from '#client/container';
import { useContainer, useLogger } from '#client/hooks';
import { useI18nContext } from '#shared/i18n/i18n-solid';
import { loadedLocales } from '#shared/i18n/i18n-util';
import { loadLocaleAsync } from '#shared/i18n/i18n-util.async';

const [state, setState] = createSignal<string>('Pre-rendered (SSG)');
const [containerType, setContainerType] = createSignal<string>('Pre-rendered (SSG)');

export const Page: Component = () => {
  const { LL, setLocale } = useI18nContext();

  const container = useContainer();
  const logger = useLogger();
  const type = container.get<string>(Services.ContainerType);

  logger.info('container:', type);

  onMount(() => {
    batch(() => {
      setState('Pre-rendered and interactive (hydrated)');
      setContainerType(type);
      setTimeout(async () => {
        console.log('setLocale');
        if (!loadedLocales['en']) {
          await loadLocaleAsync('en');
        }
        console.log('loaded');
        setLocale('en');
      }, 1000);
    });
  });




  return (<>
    <ul>
      <li>LL:{LL().hello({ name: 'Vladimir' })}</li>
      <li>{state()}</li>
      <li>container used for rendering: {containerType()}</li>
    </ul>

    <A href='/confetti' class="bg-red-400">Navigate to confetti page (via CSR)</A>;
    <A href='/mdx' class="contrast">Navigate MDX (via CSR)</A>;
  </>);
};
