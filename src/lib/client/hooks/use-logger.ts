import { Services } from '#client/container';
import type { Logger } from '#shared/diagnostics/logging';

import { useContainer } from './use-container';

export function useLogger(): Logger {
  const container = useContainer();
  return container.get<Logger>(Services.Logger);
}