import type { Container } from 'inversify';
import { useContext } from 'solid-js';

import { ContainerContext } from '#client/components/container-context';

export function useContainer(): Container {
  return useContext(ContainerContext);
}