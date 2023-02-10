/** @file contains server-side container */
import { Container } from 'inversify';

import { configure, containerOptions, createScoped as createScopedBase, Services as BaseServices } from '#shared/container-configuration';
import type { PostProvider } from '#shared/content/blog/posts/post-provider';
import { ConsoleLogger } from '#shared/diagnostics/console-logger';
import { type Logger, LogLevel } from '#shared/diagnostics/logging';
import type { PageContext } from '#types';

import { postProvider } from './content/blog/posts/vite-post-provider';

/** contain identifiers for available services from the server-side container */
const Services = {
  ...BaseServices,
  // add here server-side specific service types
  PostProvider: Symbol('PostProvider'),
};

const container = new Container(containerOptions);

configure(container);
container.rebind<string>(BaseServices.ContainerType).toConstantValue('server');
container.rebind<Logger>(BaseServices.Logger).toConstantValue(new ConsoleLogger(LogLevel.All));

// add here server-side specific services
container.bind<PostProvider>(Services.PostProvider).toConstantValue(postProvider);


/** Returns a child container from global server container */
function createScoped(pageContext: PageContext): Container {
  const scoped = createScopedBase(container, pageContext);
  return scoped;
}

export { container, Services, createScoped };