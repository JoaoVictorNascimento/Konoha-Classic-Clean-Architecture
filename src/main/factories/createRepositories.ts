import { MissionRepository } from '@/domain/repositories/MissionRepository';
import { NinjaRepository } from '@/domain/repositories/NinjaRepository';
import { AxiosClient } from '@/infra/api/AxiosClient';
import { InMemoryCacheAdapter } from '@/infra/cache/InMemoryCacheAdapter';
import { DattebayoCharacter } from '@/infra/api/dattebayo/DattebayoTypes';
import { KONOHA_CHARACTERS_CACHE_KEY } from '@/infra/cache/cacheKeys';
import { ApiMissionRepository } from '@/infra/repositories/ApiMissionRepository';
import { ApiNinjaRepository } from '@/infra/repositories/ApiNinjaRepository';
import { StoragePort } from '@/infra/storage/StoragePort';

export interface AppRepositories {
  ninjaRepository: NinjaRepository;
  missionRepository: MissionRepository;
}

export function createRepositories(storage: StoragePort): AppRepositories {
  const httpClient = new AxiosClient();
  const charactersCache = new InMemoryCacheAdapter<DattebayoCharacter[]>();
  const ninjaRepository = new ApiNinjaRepository(
    httpClient,
    storage,
    charactersCache,
    KONOHA_CHARACTERS_CACHE_KEY,
  );
  const missionRepository = new ApiMissionRepository(storage);

  return { ninjaRepository, missionRepository };
}
