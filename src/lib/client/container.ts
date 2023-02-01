/** @file contains client-side container */
import '@abraham/reflection';

import { Container } from 'inversify';

import { StorkClientProviderImpl } from '#client/stork/stork-client-provider';
import type { Configuration } from '#shared/configuration';
import { configure, containerOptions, createScoped as createScopedBase, Services as BaseServices } from '#shared/container-configuration';
import { ConsoleLogger } from '#shared/diagnostics/console-logger';
import { type Logger, LogLevel } from '#shared/diagnostics/logging';
import type { SimpleStorage } from '#shared/storage';
import type { StorkClientProvider } from '#shared/stork/stork-client-provider';
import { isBrowser } from '#shared/utils/is-browser';
import type { PageContext } from '#types';

/** contain identifiers for available services from the client-side container */
const Services = {
  ...BaseServices,
  // add here client-side specific service types
};

const container = new Container(containerOptions);

configure(container);
container.rebind<string>(BaseServices.ContainerType).toConstantValue('client');
container.rebind<Logger>(BaseServices.Logger).toConstantValue(new ConsoleLogger(LogLevel.Info));

// client container is also created while ssr-render, so we have to check browser
if (isBrowser) {
  // add here client-side specific services
  container.rebind<SimpleStorage>(Services.LocalStorage).toConstantValue(window.localStorage);
  container.rebind<SimpleStorage>(Services.SessionStorage).toConstantValue(window.sessionStorage);
  container
    .rebind<StorkClientProvider>(Services.StorkClientProvider)
    .toDynamicValue(ctx => {
      const cfg = ctx.container.get<Configuration>(Services.Configuration);
      return new StorkClientProviderImpl(`${cfg.servedUrl}/stork/stork.wasm`, `${cfg.servedUrl}/stork/stork.js`);
    })
    .inSingletonScope();
}

/** Returns a child container from global client container */
function createScoped(pageContext: PageContext): Container {
  const scoped = createScopedBase(container, pageContext);
  return scoped;
}

export { container, Services, createScoped };
