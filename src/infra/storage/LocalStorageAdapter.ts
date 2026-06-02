import { StoragePort } from '@/infra/storage/StoragePort';

export class LocalStorageAdapter implements StoragePort {
  private readonly storage: Storage;

  constructor(storage: Storage = globalThis.localStorage) {
    this.storage = storage;
  }

  get<T>(key: string): T | null {
    const raw = this.storage.getItem(key);
    if (!raw) {
      return null;
    }
    return JSON.parse(raw) as T;
  }

  set<T>(key: string, value: T): void {
    this.storage.setItem(key, JSON.stringify(value));
  }

  remove(key: string): void {
    this.storage.removeItem(key);
  }
}
