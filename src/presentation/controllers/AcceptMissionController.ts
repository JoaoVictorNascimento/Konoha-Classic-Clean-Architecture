import { AcceptMissionUseCase } from '@/domain/usecases/AcceptMissionUseCase';
import { MissionViewModel } from '@/presentation/view-models/MissionViewModel';
import { toMissionViewModel } from '@/presentation/view-models/mappers/toMissionViewModel';

export class AcceptMissionController {
  constructor(private readonly acceptMissionUseCase: AcceptMissionUseCase) {}

  async handle(input: {
    missionId: string;
    ninjaId: string;
  }): Promise<MissionViewModel> {
    const mission = await this.acceptMissionUseCase.execute(input);
    return toMissionViewModel(mission);
  }
}
