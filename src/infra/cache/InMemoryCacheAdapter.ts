import { DEFAULT_CACHE_TTL_MS } from '@/infra/cache/cacheKeys';
import { CachePort } from '@/infra/cache/CachePort';

interface CacheEntry<T> {
  value: T;
  expiresAt: number;
}

export class InMemoryCacheAdapter<T> implements CachePort<T> {
  private readonly store = new Map<string, CacheEntry<T>>();

  constructor(private readonly defaultTtlMs = DEFAULT_CACHE_TTL_MS) {}

  get(key: string): T | null {
    const entry = this.store.get(key);
    if (!entry) {
      return null;
    }

    if (Date.now() > entry.expiresAt) {
      this.store.delete(key);
      return null;
    }

    return entry.value;
  }

  set(key: string, value: T, ttlMs?: number): void {
    const ttl = ttlMs ?? this.defaultTtlMs;
    this.store.set(key, {
      value,
      expiresAt: Date.now() + ttl,
    });
  }

  delete(key: string): void {
    this.store.delete(key);
  }
}
