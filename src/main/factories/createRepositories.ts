import { MissionRepository } from '@/domain/repositories/MissionRepository';
import { NinjaRepository } from '@/domain/repositories/NinjaRepository';
import { AxiosClient } from '@/infra/api/AxiosClient';
import { ApiMissionRepository } from '@/infra/repositories/ApiMissionRepository';
import { ApiNinjaRepository } from '@/infra/repositories/ApiNinjaRepository';
import { StoragePort } from '@/infra/storage/StoragePort';

export interface AppRepositories {
  ninjaRepository: NinjaRepository;
  missionRepository: MissionRepository;
}

export function createRepositories(storage: StoragePort): AppRepositories {
  const httpClient = new AxiosClient();
  const ninjaRepository = new ApiNinjaRepository(httpClient, storage);
  const missionRepository = new ApiMissionRepository(storage);

  return { ninjaRepository, missionRepository };
}
