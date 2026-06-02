import { Mission } from '@/domain/entities/Mission';
import { DomainError } from '@/domain/errors/DomainError';
import { MissionRepository } from '@/domain/repositories/MissionRepository';
import { NinjaRepository } from '@/domain/repositories/NinjaRepository';

export class AcceptMissionUseCase {
  constructor(
    private readonly missionRepository: MissionRepository,
    private readonly ninjaRepository: NinjaRepository,
  ) {}

  async execute(input: { missionId: string; ninjaId: string }): Promise<Mission> {
    const mission = await this.missionRepository.findById(input.missionId);
    if (!mission) {
      throw new DomainError(`Mission ${input.missionId} not found`);
    }

    const ninja = await this.ninjaRepository.findById(input.ninjaId);
    if (!ninja) {
      throw new DomainError(`Ninja ${input.ninjaId} not found`);
    }

    if (ninja.villageId !== mission.villageId) {
      throw new DomainError(
        `Ninja ${ninja.name} cannot accept missions from another village`,
      );
    }

    mission.accept(input.ninjaId);
    await this.missionRepository.save(mission);
    return mission;
  }
}
