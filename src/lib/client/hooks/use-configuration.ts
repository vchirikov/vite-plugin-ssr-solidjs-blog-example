import { Services } from '#client/container';
import type { Configuration } from '#shared/configuration';

import { useContainer } from './use-container';

export function useConfiguration(): Configuration {
  const container = useContainer();
  return container.get<Configuration>(Services.Configuration);
}