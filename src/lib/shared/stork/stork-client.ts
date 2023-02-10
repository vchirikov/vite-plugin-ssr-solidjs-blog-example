import type { CancellationToken } from '#shared/utils';
import type { SearchData } from '#src/types/stork';

export interface StorkClient {
  search(query: string, indexUrl: string, token: CancellationToken): Promise<SearchData>;
}