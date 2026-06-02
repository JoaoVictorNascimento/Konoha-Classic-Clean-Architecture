import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { InMemoryCacheAdapter } from '@/infra/cache/InMemoryCacheAdapter';

describe('InMemoryCacheAdapter', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('returns null when key is missing', () => {
    const cache = new InMemoryCacheAdapter<string>();
    expect(cache.get('missing')).toBeNull();
  });

  it('stores and retrieves values within TTL', () => {
    const cache = new InMemoryCacheAdapter<string>(1000);
    cache.set('key', 'value');

    expect(cache.get('key')).toBe('value');
  });

  it('expires entries after TTL', () => {
    const cache = new InMemoryCacheAdapter<string>(1000);
    cache.set('key', 'value');

    vi.advanceTimersByTime(1001);

    expect(cache.get('key')).toBeNull();
  });

  it('delete removes an entry', () => {
    const cache = new InMemoryCacheAdapter<string>();
    cache.set('key', 'value');
    cache.delete('key');

    expect(cache.get('key')).toBeNull();
  });
});
