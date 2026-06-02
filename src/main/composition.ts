import { AcceptMissionUseCase } from '@/domain/usecases/AcceptMissionUseCase';
import { CompleteMissionUseCase } from '@/domain/usecases/CompleteMissionUseCase';
import { GetMissionsUseCase } from '@/domain/usecases/GetMissionsUseCase';
import { GetNinjasUseCase } from '@/domain/usecases/GetNinjasUseCase';
import { PromoteNinjaUseCase } from '@/domain/usecases/PromoteNinjaUseCase';
import { AxiosClient } from '@/infra/api/AxiosClient';
import { ApiMissionRepository } from '@/infra/repositories/ApiMissionRepository';
import { ApiNinjaRepository } from '@/infra/repositories/ApiNinjaRepository';
import { LocalStorageAdapter } from '@/infra/storage/LocalStorageAdapter';
import { AcceptMissionController } from '@/presentation/controllers/AcceptMissionController';
import { CompleteMissionController } from '@/presentation/controllers/CompleteMissionController';
import { ListMissionsController } from '@/presentation/controllers/ListMissionsController';
import { ListNinjasController } from '@/presentation/controllers/ListNinjasController';
import { PromoteNinjaController } from '@/presentation/controllers/PromoteNinjaController';

export interface AppControllers {
  listNinjas: ListNinjasController;
  listMissions: ListMissionsController;
  promoteNinja: PromoteNinjaController;
  acceptMission: AcceptMissionController;
  completeMission: CompleteMissionController;
}

export function createAppControllers(): AppControllers {
  const storage = new LocalStorageAdapter();
  const httpClient = new AxiosClient();
  const ninjaRepository = new ApiNinjaRepository(httpClient, storage);
  const missionRepository = new ApiMissionRepository(storage);

  const getNinjasUseCase = new GetNinjasUseCase(ninjaRepository);
  const getMissionsUseCase = new GetMissionsUseCase(missionRepository);
  const promoteNinjaUseCase = new PromoteNinjaUseCase(ninjaRepository);
  const acceptMissionUseCase = new AcceptMissionUseCase(
    missionRepository,
    ninjaRepository,
  );
  const completeMissionUseCase = new CompleteMissionUseCase(
    missionRepository,
    ninjaRepository,
  );

  return {
    listNinjas: new ListNinjasController(getNinjasUseCase),
    listMissions: new ListMissionsController(getMissionsUseCase),
    promoteNinja: new PromoteNinjaController(promoteNinjaUseCase),
    acceptMission: new AcceptMissionController(acceptMissionUseCase),
    completeMission: new CompleteMissionController(completeMissionUseCase),
  };
}
