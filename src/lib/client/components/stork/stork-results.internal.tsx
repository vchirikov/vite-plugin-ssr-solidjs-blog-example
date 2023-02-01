import { type Component, For, Match, Switch } from 'solid-js';

import { A } from '#client/components/a';
import { useI18nContext } from '#shared/i18n/i18n-solid';
import type { SearchData } from '#src/types/stork';

import { ErrorBoundaryFallback } from '../error-boundary-fallback';
import { StorkResult } from './stork-result.internal';

interface StorkResultsProps {
  searchData: SearchData | null;
}

export const StorkResults: Component<StorkResultsProps> = (props) => {

  const { LL } = useI18nContext();

  return (
    <Switch>
      <Match when={!props.searchData}>
        <div class="flex flex-1 flex-row flex-nowrap items-center justify-center">
          <div>
            {LL().stork_empty_query()}&nbsp;<pre class="kbd kbd-md text-primary inline">^^^</pre>
          </div>
        </div>
      </Match>
      <Match when={props.searchData.total_hit_count === 0}>
        <div class="flex flex-1 flex-row flex-nowrap items-center justify-center">
          <div>
            {LL().stork_not_found()}&nbsp;<pre class="kbd kbd-md text-primary inline">(╯°□°)╯︵ ┻━┻</pre>
          </div>
        </div>
      </Match>
      <Match when={props.searchData.total_hit_count > 0}>
        <div class="m-0 flex flex-1 flex-col flex-nowrap items-start justify-start p-0 py-2">
          <For each={props.searchData.results}>
            {x => (
              <A
                href={`${props.searchData.url_prefix}${x.entry.url}`}
                // note, that we don't need to have here local in link, because result's has valid url prefix
                // eslint-disable-next-line unicorn/no-null
                locale={null}
                class="hover:bg-base-300/40 w-full py-2 px-4 opacity-80 hover:opacity-100"
                tabIndex={0}
              >
                <StorkResult searchDataResult={x} />
              </A>
            )}
          </For>
        </div>
      </Match>
    </Switch>
  );
};
