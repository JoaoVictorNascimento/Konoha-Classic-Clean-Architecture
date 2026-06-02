import { MissionRepository } from '@/domain/repositories/MissionRepository';
import { NinjaRepository } from '@/domain/repositories/NinjaRepository';
import { AcceptMissionUseCase } from '@/domain/usecases/AcceptMissionUseCase';
import { CompleteMissionUseCase } from '@/domain/usecases/CompleteMissionUseCase';
import { GetMissionsUseCase } from '@/domain/usecases/GetMissionsUseCase';
import { GetNinjasUseCase } from '@/domain/usecases/GetNinjasUseCase';
import { PromoteNinjaUseCase } from '@/domain/usecases/PromoteNinjaUseCase';

export interface AppUseCases {
  getNinjas: GetNinjasUseCase;
  getMissions: GetMissionsUseCase;
  promoteNinja: PromoteNinjaUseCase;
  acceptMission: AcceptMissionUseCase;
  completeMission: CompleteMissionUseCase;
}

export function createUseCases(repositories: {
  ninjaRepository: NinjaRepository;
  missionRepository: MissionRepository;
}): AppUseCases {
  const { ninjaRepository, missionRepository } = repositories;

  return {
    getNinjas: new GetNinjasUseCase(ninjaRepository),
    getMissions: new GetMissionsUseCase(missionRepository),
    promoteNinja: new PromoteNinjaUseCase(ninjaRepository),
    acceptMission: new AcceptMissionUseCase(missionRepository, ninjaRepository),
    completeMission: new CompleteMissionUseCase(
      missionRepository,
      ninjaRepository,
    ),
  };
}
