import { CompleteMissionUseCase } from '@/domain/usecases/CompleteMissionUseCase';
import { CompleteMissionViewModel } from '@/presentation/view-models/MissionViewModel';
import { toMissionViewModel } from '@/presentation/view-models/mappers/toMissionViewModel';
import { toNinjaViewModel } from '@/presentation/view-models/mappers/toNinjaViewModel';

export class CompleteMissionController {
  constructor(
    private readonly completeMissionUseCase: CompleteMissionUseCase,
  ) {}

  async handle(input: { missionId: string }): Promise<CompleteMissionViewModel> {
    const { mission, ninja } = await this.completeMissionUseCase.execute(input);
    return {
      mission: toMissionViewModel(mission),
      ninja: toNinjaViewModel(ninja),
    };
  }
}
