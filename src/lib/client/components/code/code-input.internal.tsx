/* eslint-disable solid/no-innerhtml */
import { type Component, createMemo, createSignal, type JSX } from 'solid-js';

import { highlight } from './prism.internal';

interface Props {
  language: string;
  placeholder?: string;
  onChange?: (val: string) => void;
}

// disable auto-mode for prism
if (typeof window !== 'undefined') {
  // @ts-expect-error {} is not a Prism namespace type
  window.Prism = window.Prism || {};
  window.Prism.manual = true;
}

/** based on the idea of https://github.com/WebCoder49/code-input/ */
export const CodeInput: Component<Props> = (props) => {
  let textareaRef;
  let preRef;

  const [value, setValue] = createSignal<string>(props.placeholder ?? '');
  const html = createMemo(() => highlight(value(), props.language),);

  const onScroll = () => {
    if (preRef && preRef.current && textareaRef && textareaRef.current) {
      preRef.current.scrollTop = textareaRef.current.scrollTop;
      preRef.current.scrollLeft = textareaRef.current.scrollLeft;
    }
  };

  const onInput: JSX.EventHandler<HTMLTextAreaElement, InputEvent> = (event) => {
    // @ts-ignore check this later
    const text = event.target.value ?? '';
    onScroll();
    setValue(text);
    if (props.onChange) {
      props.onChange(text);
    }
  };

  return (
    <div class="relative my-1 h-full min-h-[4em] w-full overflow-hidden rounded-lg">
      <textarea
        ref={textareaRef}
        onInput={(event) => onInput(event)}
        onScroll={onScroll}
        tabIndex={0}
        spellcheck={false}
        class="textarea caret-neutral-content absolute top-0 left-0 z-10 m-0 my-1 h-full w-full resize-none overflow-auto whitespace-nowrap
          rounded-sm border-none bg-transparent p-4 font-mono text-base text-transparent focus:outline-none"
        value={value()}
      />
      <pre
        ref={preRef}
        class={`language-${props.language} absolute top-0 left-0 z-0 m-0 h-full w-full border-none font-mono`}
        aria-hidden="true">
        <code innerHTML={html()} class={`language-${props.language}`} />
      </pre>
    </div>
  );
};
