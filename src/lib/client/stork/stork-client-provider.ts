import { injectable } from 'inversify';

import type { StorkClient } from '#shared/stork/stork-client';
import type { StorkClientProvider } from '#shared/stork/stork-client-provider';

import { StorkClientImpl } from './stork-client';

@injectable()
export class StorkClientProviderImpl implements StorkClientProvider {
  private static readonly cache = new Map<string, StorkClientImpl>();

  private readonly storkJsUrl: string;

  private readonly wasmUrl: string;

  public constructor(wasmUrl: string, storkJsUrl: string) {
    this.wasmUrl = wasmUrl;
    this.storkJsUrl = storkJsUrl;
  }

  public getOrCreate(name: string): StorkClient {
    let client = StorkClientProviderImpl.cache.get(name);
    if (!client) {
      client = new StorkClientImpl(name, this.wasmUrl, this.storkJsUrl);
      StorkClientProviderImpl.cache.set(name, client);
    }
    return client;
  }
}
