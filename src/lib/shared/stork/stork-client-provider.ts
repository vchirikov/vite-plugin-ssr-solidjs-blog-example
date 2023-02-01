import type { StorkClient } from './stork-client';

export interface StorkClientProvider {
  getOrCreate(name: string): StorkClient;
}