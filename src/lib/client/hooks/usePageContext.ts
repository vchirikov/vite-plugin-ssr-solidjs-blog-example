import { useContext } from 'solid-js';

import { ContainerContext } from '#client/components/container-context';
import { Services } from '#client/container';
import type { PageContext } from '#types';

export function usePageContext(): PageContext {
  const container = useContext(ContainerContext);
  if (!container)
    throw new Error('Container isn\'t presented in the context');
  return container.get(Services.PageContext);
}