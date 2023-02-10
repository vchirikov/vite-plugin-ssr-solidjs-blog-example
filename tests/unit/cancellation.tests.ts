import { describe, expect, it } from 'vitest';

import { CancellationTokenSource } from '#shared/utils';

describe('CancellationTokenSource', () => {
  it('should release resources from linked cts', () => {
    const parent = new CancellationTokenSource();
    expect(parent['callbacks']).undefined;
    const child = CancellationTokenSource.createLinked(parent.token);
    const parentCallbacks = parent['callbacks'] as Set<() => void>;
    expect(parentCallbacks).not.undefined;
    expect(parentCallbacks.size).toEqual(1);
    child.dispose();
    expect(parentCallbacks.size).toEqual(0);
    expect(child.token.isCancelled).toEqual(false);
  });
});

describe('CancellationToken', () => {
  it('should release resources after await', async () => {
    const cts = new CancellationTokenSource();
    const waitAsync = async (): Promise<void> => {
      await cts.token;
    };
    expect(cts['callbacks']).undefined;
    const promise = waitAsync();
    // to kick in .then in queue
    await Promise.resolve();
    expect(cts['callbacks']).not.undefined;
    expect(cts['callbacks'].size).toEqual(1);
    cts.cancel();
    expect(cts['callbacks']).undefined;
    await expect(promise).rejects.toThrow('Operation was cancelled');
  });
});