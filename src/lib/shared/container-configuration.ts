/** @file contains configuration for base IoC container for both side */
import '@abraham/reflection';

import type { Container, interfaces } from 'inversify';

import { ConsoleLogger } from '#shared/diagnostics/console-logger';
import { type Logger, LogLevel } from '#shared/diagnostics/logging';
import type { PageContext } from '#types';

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
  /** Returns a PageContext of rendering */
  PageContext: Symbol('PageContext'),
};

/** Returns a child container from a container */
export function createScoped(container: Container, pageContext: PageContext): Container {
  const scoped = container.createChild(containerOptions);
  scoped.bind<PageContext>(Services.PageContext).toConstantValue(pageContext);
  return scoped;
}

export const containerOptions: interfaces.ContainerOptions = { defaultScope: 'Singleton' };