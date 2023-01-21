/** @file contains configuration for base IoC container for both side */
import '@abraham/reflection';

import type { Container } from 'inversify';

import { ConsoleLogger } from '#shared/diagnostics/console-logger';
import { type Logger, LogLevel } from '#shared/diagnostics/logging';

import type { Configuration } from './configuration';

export function configure(container: Container) {
  container.bind<string>(Services.ContainerType).toConstantValue('base');
  container.bind<string>(Services.Version).toConstantValue(process.env.npm_package_version);
  container.bind<Logger>(Services.Logger).toConstantValue(new ConsoleLogger(LogLevel.None));
  container.bind<Configuration>(Services.Configuration).toConstantValue({
    basePath: process.env.basePath,
    servedUrl: process.env.servedUrl,
  });
}

/** contain identifiers for available services from the base container */
export const Services = {
  ContainerType: Symbol('ContainerType'),
  Logger: Symbol('Logger'),
  Configuration: Symbol('Configuration'),
  Version: Symbol('Version'),
};