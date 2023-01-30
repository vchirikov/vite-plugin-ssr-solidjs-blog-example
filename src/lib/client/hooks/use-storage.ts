import { Services } from '#client/container';
import type { SimpleStorage } from '#shared/storage';

import { useContainer } from './use-container';

export function useLocalStorage(): SimpleStorage {
  const container = useContainer();
  return container.get<SimpleStorage>(Services.LocalStorage);
}

export function useSessionStorage(): SimpleStorage {
  const container = useContainer();
  return container.get<SimpleStorage>(Services.SessionStorage);
}