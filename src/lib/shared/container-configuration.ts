/** @file contains configuration for base IoC container for both side */
import '@abraham/reflection';

import type { Container } from 'inversify';

import { ConsoleLogger } from '#shared/diagnostics/console-logger';
import { type Logger, LogLevel } from '#shared/diagnostics/logging';

export function configure(container: Container) {
  container.bind<string>(Services.ContainerType).toConstantValue('base');
  container.bind<Logger>(Services.Logger).toConstantValue(new ConsoleLogger(LogLevel.None));
}

/** contain identifiers for available services from the base container */
export const Services = {
  ContainerType: Symbol('ContainerType'),
  Logger: Symbol('Logger'),
};