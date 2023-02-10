/* eslint-disable @typescript-eslint/no-empty-function */

/** empty function */
export const noop = () => { };

/** {@link Promise} which never resolved or rejected */
export const noopPromise = new Promise<void>(noop);