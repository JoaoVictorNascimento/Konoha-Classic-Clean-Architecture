import { StoragePort } from '@/infra/storage/StoragePort';

export class InMemoryStorageAdapter implements StoragePort {
  private readonly store = new Map<string, string>();

  get<T>(key: string): T | null {
    const raw = this.store.get(key);
    if (!raw) {
      return null;
    }
    return JSON.parse(raw) as T;
  }

  set<T>(key: string, value: T): void {
    this.store.set(key, JSON.stringify(value));
  }

  remove(key: string): void {
    this.store.delete(key);
  }
}
