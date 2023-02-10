import { type Component, createMemo } from 'solid-js';

import { Services } from '#client/container';
import { useConfiguration, useContainer, useLogger } from '#client/hooks';
import type { SearchData } from '#root/src/types/stork';
import { useI18nContext } from '#shared/i18n/i18n-solid';
import type { StorkClient } from '#shared/stork/stork-client';
import type { StorkClientProvider } from '#shared/stork/stork-client-provider';
import { CancellationTokenSource } from '#shared/utils';


interface StorkInputProps {
  name: string;
  searchDataCallback: (searchData?: SearchData) => void;
}

const StorkInput: Component<StorkInputProps> = (props: StorkInputProps) => {
  const cfg = useConfiguration();
  const logger = useLogger();
  const { LL, locale } = useI18nContext();
  const container = useContainer();

  const indexUrl = `${cfg.servedUrl}/stork/${locale()}.st`;
  let query = '';
  let cts = new CancellationTokenSource();
  const provider: StorkClientProvider | undefined = container.get(Services.StorkClientProvider);
  const client = createMemo<StorkClient | undefined>(() => provider?.getOrCreate(props.name));


  const onInput = async event => {
    event.preventDefault();
    if (!client())
      return;
    try {
      query = event.target.value ?? '';
      cts.cancel();
      cts = new CancellationTokenSource();
      props.searchDataCallback();

      if (!query)
        return;

      const data: SearchData = await client().search(query, indexUrl, cts.token);
      cts.token.throwIfCancelled();
      props.searchDataCallback(data);
    } catch (error) {
      logger.error('Search unhandled error: ', error);
    }
  };

  return (
    <input
      tabIndex={0}
      type="text"
      placeholder={LL().search()}
      onInput={event => onInput(event)}
      class="input-bordered input h-full w-full opacity-50 transition-opacity hover:opacity-80 focus:opacity-80"
    />
  );
};

export { StorkInput };
