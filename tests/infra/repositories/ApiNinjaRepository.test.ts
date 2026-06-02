import { describe, it, expect, beforeEach, vi } from 'vitest';
import { NinjaRank } from '@/domain/value-objects/NinjaRank';
import { AxiosClient } from '@/infra/api/AxiosClient';
import { InMemoryCacheAdapter } from '@/infra/cache/InMemoryCacheAdapter';
import { DattebayoCharacter } from '@/infra/api/dattebayo/DattebayoTypes';
import { ApiNinjaRepository } from '@/infra/repositories/ApiNinjaRepository';
import { InMemoryStorageAdapter } from '@/infra/storage/InMemoryStorageAdapter';
import narutoFixture from '../fixtures/naruto-character.json';

const geninFixture = {
  id: 99,
  name: 'Konoha Genin',
  personal: { affiliation: ['Konohagakure'] },
  rank: { ninjaRank: { 'Part I': 'Genin' } },
};

describe('ApiNinjaRepository', () => {
  let httpClient: AxiosClient;
  let storage: InMemoryStorageAdapter;
  let repository: ApiNinjaRepository;

  beforeEach(() => {
    httpClient = {
      get: vi.fn().mockResolvedValue({
        characters: [narutoFixture, geninFixture],
        currentPage: 1,
        pageSize: 2,
        total: 2,
      }),
    } as unknown as AxiosClient;
    storage = new InMemoryStorageAdapter();
    repository = new ApiNinjaRepository(httpClient, storage);
  });

  it('findAll returns mapped Konoha ninjas', async () => {
    const ninjas = await repository.findAll('konoha');
    expect(ninjas).toHaveLength(2);
    expect(ninjas[0].id).toBe('ninja-1344');
  });

  it('findById returns ninja when present', async () => {
    const ninja = await repository.findById('ninja-1344');
    expect(ninja?.name).toBe('Naruto Uzumaki');
  });

  it('save persists rank overrides', async () => {
    const ninja = (await repository.findById('ninja-99'))!;
    ninja.promote();
    await repository.save(ninja);

    const reloaded = await repository.findById('ninja-99');
    expect(reloaded?.rank).toBe(NinjaRank.Chunin);
  });

  it('save persists mission history overrides', async () => {
    const ninja = (await repository.findById('ninja-1344'))!;
    ninja.recordCompletedMission('m1');
    await repository.save(ninja);

    const reloaded = await repository.findById('ninja-1344');
    expect(reloaded?.missionHistory).toContain('m1');
  });

  it('caches character fetch within TTL', async () => {
    const cache = new InMemoryCacheAdapter<DattebayoCharacter[]>();
    const cachedRepository = new ApiNinjaRepository(httpClient, storage, cache);

    await cachedRepository.findAll('konoha');
    await cachedRepository.findAll('konoha');

    expect(httpClient.get).toHaveBeenCalledTimes(1);
  });

  it('fetches multiple pages until total is reached', async () => {
    const pageOne = {
      characters: [narutoFixture],
      currentPage: 1,
      pageSize: 1,
      total: 2,
    };
    const pageTwo = {
      characters: [geninFixture],
      currentPage: 2,
      pageSize: 1,
      total: 2,
    };

    vi.mocked(httpClient.get).mockReset();
    vi.mocked(httpClient.get)
      .mockResolvedValueOnce(pageOne)
      .mockResolvedValueOnce(pageTwo);

    const ninjas = await repository.findAll('konoha');

    expect(httpClient.get).toHaveBeenCalledTimes(2);
    expect(ninjas).toHaveLength(2);
  });
});
