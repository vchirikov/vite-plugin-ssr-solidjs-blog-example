import { Services } from '#client/container';
import type { PageContext } from '#types';

import { useContainer } from './useContainer';

export function usePageContext(): PageContext {
  const container = useContainer();
  return container.get(Services.PageContext);
}