import type CancellationToken from 'cancellationtoken';
import type { SearchData, StorkWasmJs } from 'src/types/stork';

import type { StorkClient } from '#shared/stork/stork-client';

export class StorkClientImpl implements StorkClient {
  private readonly name: string;

  private stork?: StorkWasmJs;

  private isInitialized = false;

  private currentIndexUrl?: string;

  private wasmUrl: string;

  private storkJsUrl: string;

  constructor(name: string, wasmUrl: string, storkJsUrl: string) {
    this.storkJsUrl = storkJsUrl;
    this.name = name;
    this.wasmUrl = wasmUrl;
  }

  private async initialize(): Promise<void> {
    if (!this.stork) throw new Error('Load stork script first');
    await this.stork.initialize(this.wasmUrl);
    this.isInitialized = true;
  }

  private async changeIndex(indexUrl: string) {
    if (!this.stork) throw new Error('Load stork script first');
    await this.stork.downloadIndex(this.name, indexUrl, { forceOverwrite: true });
    this.currentIndexUrl = indexUrl;
  }

  private static waitForDocumentReadyState(state: 'interactive' | 'complete' | 'loading'): Promise<void> {
    return new Promise<void>(resolve => {
      if (document.readyState === state) resolve();
      const callback = () => {
        if (document.readyState === state) {
          resolve();
          return;
        }
        window.setTimeout(callback, 10);
      };
      setTimeout(callback, 5);
    });
  }

  private loadStorkScript: () => Promise<void> = async () => new Promise<void>((resolve, reject) => {
    if (this.stork) resolve();

    if (window.stork) {
      this.stork = window.stork;
      resolve();
    }
    const script: HTMLScriptElement = document.createElement('script');
    script.type = 'text/javascript';
    script.src = this.storkJsUrl;
    script.async = true;
    // eslint-disable-next-line unicorn/prefer-add-event-listener
    script.onerror = err => reject(new Error(`Can't load stork js script, with error: ${err}`));

    script.addEventListener('load', async () => {
      await StorkClientImpl.waitForDocumentReadyState('complete');
      this.stork = window.stork;
      resolve();
    });
    document.head.append(script);
  });

  /** Lazy loads the Stork WASM, js and index on the first call */
  public async search(query: string, indexUrl: string, token: CancellationToken): Promise<SearchData> {
    if (!this.stork) await this.loadStorkScript();

    token.throwIfCancelled();

    const initPromise = this.isInitialized ? Promise.resolve() : this.initialize();

    const changeIndexPromise = this.currentIndexUrl === indexUrl ? Promise.resolve() : this.changeIndex(indexUrl);
    await Promise.all([initPromise, changeIndexPromise]);

    token.throwIfCancelled();

    return this.stork!.search(this.name, query);
  }
}
