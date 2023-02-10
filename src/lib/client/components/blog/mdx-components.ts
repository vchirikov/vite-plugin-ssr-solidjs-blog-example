import { lazy } from 'solid-js';

import { Counter } from '#client/components/counter';

export const components = {
  YamlPlayground: lazy(() => import('../yaml-playground')),
  Counter: Counter,
};
