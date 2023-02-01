import { type Component, createEffect, Show } from 'solid-js';

import { useLogger } from '#client/hooks';
import { useI18nContext } from '#shared/i18n/i18n-solid';

export const ErrorBoundaryFallback: Component<{ error: Error | unknown, reset: () => void; }> = (props) => {
  const { LL } = useI18nContext();
  const logger = useLogger();
  createEffect(() => {
    logger.error('Unhandled error:', props.error);
  });
  return (
    <div class="alert alert-error shadow-lg">
      <div>
        <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        <div>
          <h3 class="font-bold">{LL().error_unknown()}!</h3>
          <Show when={props.error}>
            <div class="text-xs">{LL().error_info()}: {() => props.error?.toString()}</div>
          </Show>
        </div>
      </div>
      <Show when={props.reset}>
        <div class="flex-none">
          <button class="btn btn-sm btn-ghost" onClick={() => props.reset()}>{LL().try_again()}?</button>
        </div>
      </Show>
    </div>

  );
};