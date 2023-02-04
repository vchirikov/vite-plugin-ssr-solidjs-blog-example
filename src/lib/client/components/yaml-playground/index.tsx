// eslint-disable-next-line import/no-extraneous-dependencies
import { createMemo, createSignal } from 'solid-js';
import { parse as yamlParse } from 'yaml';

import { Code, CodeInput } from '../code';

const placeholder = 'literal-style: |-2\n  Line1\n  Line2\n\n  Line3\nfolded-style: >-\n  Line1\n  Line2\n\n  Line3';

export const YamlPlayground = () => {
  const [value, setValue] = createSignal(placeholder);
  const json = createMemo(() => {
    try {
      return JSON.stringify(yamlParse(value(), { strict: false }), undefined, 2);
    }
    catch (error) {
      return JSON.stringify({ error }, undefined, 2);
    }
  });

  return (
    <div class="flex w-full flex-1 flex-row flex-wrap justify-between">
      <div class="flex min-h-[22rem] w-full flex-col flex-nowrap p-4 md:w-1/2">
        <span class="label-text text-2xl"><code>YAML:</code></span>
        <CodeInput placeholder={placeholder} onChange={val => setValue(val)} language='yaml' />
      </div>
      <div class="flex min-h-[22rem] w-full flex-col flex-nowrap p-4 md:w-1/2">
        <span class="label-text text-2xl"><code>JSON:</code></span>
        <Code code={json()} language='javascript' />
      </div>
    </div>
  );
};

// for easier lazy-loading
export default YamlPlayground;
