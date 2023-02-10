/* eslint-disable unicorn/no-thenable */
import type { Disposable } from '#types';

import { noop, noopPromise } from './noop';

/**
 * the object who is responsible to create, register, call and dispose callbacks of {@link CancellationToken}
 * WARN: don't forget to dispose resources
 */
export class CancellationTokenSource implements Disposable {
  private cancelled = false;
  private callbacks?: Set<() => void>;
  private cancellationToken = new CancellationToken(this);

  static createLinked(token: CancellationToken): CancellationTokenSource {
    const cts = new CancellationTokenSource();
    const unregisterFromLinked = token.register(() => {
      unregisterFromLinked();
      cts.cancel();
    });
    const originalDispose = cts.dispose.bind(cts);
    cts.dispose = ((): void => {
      unregisterFromLinked();
      originalDispose();
    }).bind(cts);
    return cts;
  }

  get isCancelled(): boolean {
    return this.cancelled;
  }

  get token(): CancellationToken {
    return this.cancellationToken;
  }

  /** sets {@link CancellationTokenSource} to a signaled state, runs & {@link dispose} callbacks */
  cancel(): void {
    if (this.cancelled)
      return;

    this.cancelled = true;
    if (this.callbacks) {

      for (const callback of this.callbacks) {
        callback();
      }
    }
    this.dispose();
  }

  /** releases resources */
  dispose(): void {
    this.callbacks?.clear();
    delete this.callbacks;
  }

  /**
   * registers a callback which will be called on {@link cancel}
   * @param callback
   * @returns an unregister function, which you can use as a dispose for a registration
   */
  register(callback: () => void): () => void {
    if (this.cancelled) {
      callback();
      return noop;
    }
    this.callbacks ??= new Set<() => void>();
    this.callbacks.add(callback);
    return () => this.unregister(callback);
  }

  /** removes a callback from a cancellation waiting list, you can also use returned function from {@link register} */
  unregister(callback: () => void) {
    this.callbacks?.delete(callback);
  }

}

/**
 * a small object which represent information about cancellation without registered callbacks, so if you work with
 * {@link CancellationToken} you shouldn't call any `dispose()` methods, this is just a token.
 */
export class CancellationToken implements PromiseLike<void> {
  static readonly Error: Error = new Error('Operation was cancelled');

  private static none?: CancellationToken;
  static get None(): CancellationToken {
    return CancellationToken.none ||= new CancellationToken();
  }

  private readonly source?: CancellationTokenSource;
  private promise?: Promise<void>;

  constructor(source?: CancellationTokenSource) {
    this.source = source;
  }

  get canBeCanceled(): boolean {
    return !!this.source;
  }

  get isCancelled(): boolean {
    return this.source?.isCancelled ?? false;
  }

  throwIfCancelled(): void {
    if (this.isCancelled)
      throw CancellationToken.Error;
  }

  register(callback: () => void): () => void {
    return this.source?.register(callback);
  }

  /**
   * Returns a {@link Promise} that rejects when the token is cancelled ({@link CancellationTokenSource.cancel}).
   */
  asPromise(): Promise<void> {
    return this.promise ??= this.createPromise();
  }

  private createPromise(): Promise<void> {
    if (this.isCancelled) {
      return Promise.reject(CancellationToken.Error);
    }
    if (!this.source) {
      return noopPromise;
    }
    return new Promise<void>((_, reject) => {
      /** if {@link CancellationTokenSource} won't be disposed we might get a memory leak */
      const unregister = this.source.register(() => {
        unregister();
        reject(CancellationToken.Error);
      });
    });
  }

  /** shortcut to {@link asPromise} , you can await a {@link CancellationToken} */
  then<TResult1 = void, TResult2 = never>(
    onfulfilled?: (value: void) => TResult1 | PromiseLike<TResult1>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onrejected?: (reason: any) => TResult2 | PromiseLike<TResult2>
  ): PromiseLike<TResult1 | TResult2> {
    return this.asPromise().then(onfulfilled, onrejected);
  }

}