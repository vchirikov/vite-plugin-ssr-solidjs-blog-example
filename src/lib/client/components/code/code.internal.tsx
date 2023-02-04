/* eslint-disable solid/no-innerhtml */

import { type Component, createMemo } from 'solid-js';

import { highlight } from './prism.internal';

interface Props {
  language: string;
  code: string;
}

export const Code: Component<Props> = (props) => {
  const html = createMemo(() => highlight(props.code, props.language));

  return (
    <pre class={`language-${props.language} h-full w-full`} tabIndex={0}>
      <code innerHTML={html()} class={`language-${props.language}`} />
    </pre>
  );
};
