import { AcceptMissionController } from '@/presentation/controllers/AcceptMissionController';
import { CompleteMissionController } from '@/presentation/controllers/CompleteMissionController';
import { ListMissionsController } from '@/presentation/controllers/ListMissionsController';
import { ListNinjasController } from '@/presentation/controllers/ListNinjasController';
import { PromoteNinjaController } from '@/presentation/controllers/PromoteNinjaController';
import type { AppUseCases } from '@/main/factories/createUseCases';

export interface AppControllers {
  listNinjas: ListNinjasController;
  listMissions: ListMissionsController;
  promoteNinja: PromoteNinjaController;
  acceptMission: AcceptMissionController;
  completeMission: CompleteMissionController;
}

export function createControllers(useCases: AppUseCases): AppControllers {
  return {
    listNinjas: new ListNinjasController(useCases.getNinjas),
    listMissions: new ListMissionsController(useCases.getMissions),
    promoteNinja: new PromoteNinjaController(useCases.promoteNinja),
    acceptMission: new AcceptMissionController(useCases.acceptMission),
    completeMission: new CompleteMissionController(useCases.completeMission),
  };
}
