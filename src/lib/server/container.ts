/** @file contains server-side container */
import { Container } from 'inversify';

import { configure, Services as BaseServices } from '#lib/container-configuration';
import { ConsoleLogger } from '#lib/diagnostics/console-logger';
import { type Logger, LogLevel } from '#lib/diagnostics/logging';

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
