//* **************[stork]************** */
/** @link https://github.com/jameslittle230/stork/blob/master/js/config.ts */
export interface Configuration {
  showProgress: boolean;
  printIndexInfo: boolean;
  showScores: boolean;
  showCloseButton: boolean;
  minimumQueryLength: number;
  forceOverwrite: boolean;
  resultNoun: { singular: string; plural: string; };
  onQueryUpdate?: (query: string, results: unknown) => unknown;
  onResultSelected?: (query: string, result: unknown) => unknown;
  onResultsHidden?: () => unknown;
  onInputCleared?: () => unknown;
  transformResultUrl: (url: string) => string;
}
// <search-data>
/** @link https://github.com/jameslittle230/stork/blob/master/js/searchData.ts */
export interface HighlightRange {
  beginning: number;
  end: number;
}

export interface Entry {
  fields: Record<string, unknown>;
  title: string;
  url: string;
}

export interface Excerpt {
  fields: Record<string, unknown>;
  internal_annotations?: Array<Record<string, unknown>>;
  highlight_ranges?: Array<HighlightRange>;
  score: number;
  text: string;
}

export interface StorkSearchDataResult {
  entry: Entry;
  excerpts: Array<Excerpt>;
  score: number;
  title_highlight_ranges?: Array<HighlightRange>;
}

export interface SearchData {
  results: Array<StorkSearchDataResult>;
  total_hit_count: number;
  url_prefix: string;
}

// </search-data>
/**
 * @link https://github.com/jameslittle230/stork/blob/master/js/main.ts
 */
export interface StorkWasmJs {
  initialize(wasmOverrideUrl: string | null): Promise<void>;
  downloadIndex(name: string, url: string, config: Partial<Configuration>): Promise<void>;
  attach(name: string): void;
  register(name: string, url: string, config: Partial<Configuration>): Promise<void>;
  search(name: string, query: string): SearchData;
}
//* **************[/stork]************** */