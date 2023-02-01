import { type Component, createMemo, For, type JSX, Match, Switch } from 'solid-js';
import type { HighlightRange } from 'src/types/stork';

interface StorkHighlightProps {
  text: string;
  highlight_ranges: Array<HighlightRange> | null | undefined;
  // stork uses bytes in highlight_ranges (in title), so we should translate string
  // to bytes, cut and then encode again :(
  // and stork doesn't use bytes in excerpts
  highlightByBytes: boolean;
}

const decoder = new TextDecoder();
const encoder = new TextEncoder();

export const StorkHighlight: Component<StorkHighlightProps> = (props) => {
  const nodes = createMemo(() => {
    const bytes = props.highlightByBytes
      ? encoder.encode(props.text)
      : undefined;
    const length = props.highlightByBytes ? bytes.byteLength : props.text?.length ?? 0;
    let cursor = 0;
    const nodes: JSX.Element[] = [];

    for (const x of props.highlight_ranges) {
      const range: HighlightRange = { ...x };
      if (range.beginning > length)
        continue;
      if (range.end > length)
        range.end = length;

      const before = props.highlightByBytes
        ? decoder.decode(bytes.slice(cursor, range.beginning))
        : props.text.slice(cursor, range.beginning);

      nodes.push(before);

      const segment: JSX.Element = (
        <mark class="bg-warning text-neutral rounded-sm px-1">
          {props.highlightByBytes
            ? decoder.decode(bytes.slice(range.beginning, range.end))
            : props.text.slice(range.beginning, range.end)}
        </mark>
      );
      nodes.push(segment);
      cursor = range.end;
    }

    if (cursor < length) {
      const after = props.highlightByBytes ? decoder.decode(bytes.slice(cursor)) : props.text.slice(Math.max(0, cursor));
      nodes.push(after);
    }
    return nodes;
  });

  return (
    <Switch fallback={<>{props.text}</>}>
      <Match when={props.highlight_ranges}>
        <For each={nodes()} fallback={<>{props.text}</>}>
          {item => <span>{item}</span>}
        </For>
      </Match>
    </Switch>
  );
};
