import type { Component } from 'solid-js';

import { useConfiguration } from '#client/hooks';
import { useI18nContext } from '#shared/i18n/i18n-solid';
import { A } from '#client/components/a';

interface Props {
  title: string;
  url: string;
}

export const Breadcrumbs: Component<Props> = (props) => {
  const { LL } = useI18nContext();
  const cfg = useConfiguration();
  return (
    <div class="breadcrumbs text-sm">
      <ul>
        <li>
          <A href={cfg.servedUrl} class="opacity-80 transition-opacity hover:opacity-100 focus:opacity-100">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="mr-2 h-4 w-4 stroke-current"><path d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" /></svg>
            {LL().index()}
          </A>
        </li>
        <li>
          <A href={props.url}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="mr-2 h-4 w-4 stroke-current"><path d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
            {props.title}
          </A>
        </li>
      </ul>
    </div>
  );
};

