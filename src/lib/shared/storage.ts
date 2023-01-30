/** simplified version of {@link Storage}, exchangeable with {@link window.localStorage} for example */
export type SimpleStorage = Omit<Storage, 'key' | 'name' | 'length'>;

/** implementation of {@link SimpleStorage} based on Map */
export class InMemoryStorage implements SimpleStorage {
  private readonly storage = new Map<string | symbol, string>();

  clear = (): void => {
    this.storage.clear();
  };

  getItem = (key: string): string => {
    return this.storage.get(key);
  };

  removeItem = (key: string): void => {
    this.storage.delete(key);
  };
  setItem = (key: string, value: string): void => {
    this.storage.set(key, value);
  };
}