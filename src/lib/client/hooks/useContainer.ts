import type { Container } from 'inversify';
import { useContext } from 'solid-js';

import { ContainerContext } from '#client/components/container-context';

export function useContainer(): Container {
  const container = useContext(ContainerContext);
  if (!container)
    throw new Error('Container isn\'t presented in the context');
  return container;
}