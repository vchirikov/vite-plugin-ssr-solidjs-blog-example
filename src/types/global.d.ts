import type { StorkWasmJs } from './stork';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface Window {
    stork?: StorkWasmJs;
    // add global variables here if you want to
  }
}

export { };