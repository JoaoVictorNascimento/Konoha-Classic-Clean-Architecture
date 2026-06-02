import { describe, it, expect, beforeEach, vi } from 'vitest';
import { InMemoryStorageAdapter } from '@/infra/storage/InMemoryStorageAdapter';
import { LocalStorageAdapter } from '@/infra/storage/LocalStorageAdapter';

describe('InMemoryStorageAdapter', () => {
  let storage: InMemoryStorageAdapter;

  beforeEach(() => {
    storage = new InMemoryStorageAdapter();
  });

  it('stores and retrieves values', () => {
    storage.set('key', { value: 1 });
    expect(storage.get('key')).toEqual({ value: 1 });
  });

  it('removes values', () => {
    storage.set('key', 'data');
    storage.remove('key');
    expect(storage.get('key')).toBeNull();
  });
});

describe('LocalStorageAdapter', () => {
  it('uses provided storage backend', () => {
    const map = new Map<string, string>();
    const backend = {
      getItem: (key: string) => map.get(key) ?? null,
      setItem: (key: string, value: string) => {
        map.set(key, value);
      },
      removeItem: (key: string) => {
        map.delete(key);
      },
    } as Storage;

    const storage = new LocalStorageAdapter(backend);
    storage.set('konoha', ['a']);
    expect(storage.get<string[]>('konoha')).toEqual(['a']);
  });
});
