/** @file contains server-side container */
import { Container } from 'inversify';

import { configure, Services as BaseServices } from '#shared/container-configuration';
import { ConsoleLogger } from '#shared/diagnostics/console-logger';
import { type Logger, LogLevel } from '#shared/diagnostics/logging';

const container = new Container({ defaultScope: 'Singleton' });

configure(container);
container.rebind<string>(BaseServices.ContainerType).toConstantValue('server');

// add here server-side specific services
container.rebind<Logger>(BaseServices.Logger).toConstantValue(new ConsoleLogger(LogLevel.All));

/** contain identifiers for available services from the server-side container */
const Services = {
  ...BaseServices
  // add here server-side specific service types
};

export { container, Services };
