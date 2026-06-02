import { GetMissionsUseCase } from '@/domain/usecases/GetMissionsUseCase';
import { MissionViewModel } from '@/presentation/view-models/MissionViewModel';
import { toMissionViewModel } from '@/presentation/view-models/mappers/toMissionViewModel';

export class ListMissionsController {
  constructor(private readonly getMissionsUseCase: GetMissionsUseCase) {}

  async handle(input?: { villageId?: string }): Promise<MissionViewModel[]> {
    const missions = await this.getMissionsUseCase.execute(input);
    return missions.map(toMissionViewModel);
  }
}
