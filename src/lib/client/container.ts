/** @file contains client-side container */
import { Container } from 'inversify';

import { configure, Services as BaseServices } from '#shared/container-configuration';
import { ConsoleLogger } from '#shared/diagnostics/console-logger';
import { type Logger, LogLevel } from '#shared/diagnostics/logging';

const container = new Container({ defaultScope: 'Singleton' });

configure(container);
container.rebind<string>(BaseServices.ContainerType).toConstantValue('client');

// add here client-side specific services
container.rebind<Logger>(BaseServices.Logger).toConstantValue(new ConsoleLogger(LogLevel.Info));

/** contain identifiers for available services from the client-side container */
const Services = {
  ...BaseServices
  // add here client-side specific service types
};

export { container, Services };
