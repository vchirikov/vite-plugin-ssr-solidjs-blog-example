/** @file contains client-side container */
import { type interfaces, Container } from 'inversify';

import { configure, Services as BaseServices } from '#shared/container-configuration';
import { ConsoleLogger } from '#shared/diagnostics/console-logger';
import { type Logger, LogLevel } from '#shared/diagnostics/logging';
import type { PageContext } from '#types';

const containerOptions: interfaces.ContainerOptions = { defaultScope: 'Singleton' };
const container = new Container(containerOptions);

/** contain identifiers for available services from the client-side container */
const Services = {
  ...BaseServices,
  // add here client-side specific service types

  /** Returns a PageContext of rendering */
  PageContext: Symbol('PageContext'),
};

configure(container);
container.rebind<string>(BaseServices.ContainerType).toConstantValue('client');
container.rebind<Logger>(BaseServices.Logger).toConstantValue(new ConsoleLogger(LogLevel.Info));

// add here client-side specific services


/** Returns a child container from global client container */
function createScoped(pageContext: PageContext): Container {
  const scoped = container.createChild(containerOptions);
  scoped.bind<PageContext>(Services.PageContext).toConstantValue(pageContext);
  return scoped;
}


export { container, Services, createScoped };
