import type { Component } from 'solid-js';
import { For } from 'solid-js';

import { useI18nContext } from '#shared/i18n/i18n-solid';
import type { StorkSearchDataResult } from '#src/types/stork';

import { StorkHighlight } from './stork-highlight.internal';

interface StorkResultProps {
  searchDataResult: StorkSearchDataResult;
}

export const StorkResult: Component<StorkResultProps> = (props) => {
  const { LL } = useI18nContext();
  return (
    <div class="flex flex-1 flex-row flex-nowrap items-center justify-between break-all md:break-words">
      <div class="flex flex-1 flex-col flex-nowrap">
        <div class="text-lg font-semibold">
          <StorkHighlight text={props.searchDataResult.entry.title} highlightByBytes={true} highlight_ranges={props.searchDataResult.title_highlight_ranges} />
        </div>
        <div class="pt-2 text-sm">
          <For each={props.searchDataResult.excerpts}>
            {item => (
              <div class="">
                <p>
                  ...
                  <StorkHighlight text={item.text} highlightByBytes={false} highlight_ranges={item.highlight_ranges} />
                  ...
                </p>
              </div>
            )}
          </For>
        </div>
      </div>
      <div class="badge-outline badge badge-sm">{`${LL().stork_score()}: ${props.searchDataResult.score}`}</div>
    </div>
  );
};
