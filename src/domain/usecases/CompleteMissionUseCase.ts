import { Mission } from '@/domain/entities/Mission';
import { Ninja } from '@/domain/entities/Ninja';
import { DomainError } from '@/domain/errors/DomainError';
import { MissionRepository } from '@/domain/repositories/MissionRepository';
import { NinjaRepository } from '@/domain/repositories/NinjaRepository';

export class CompleteMissionUseCase {
  constructor(
    private readonly missionRepository: MissionRepository,
    private readonly ninjaRepository: NinjaRepository,
  ) {}

  async execute(input: {
    missionId: string;
  }): Promise<{ mission: Mission; ninja: Ninja }> {
    const mission = await this.missionRepository.findById(input.missionId);
    if (!mission) {
      throw new DomainError(`Mission ${input.missionId} not found`);
    }

    const assignedNinjaId = mission.assignedNinjaId;
    if (!assignedNinjaId) {
      throw new DomainError(
        `Mission "${mission.title}" has no assigned ninja`,
      );
    }

    const ninja = await this.ninjaRepository.findById(assignedNinjaId);
    if (!ninja) {
      throw new DomainError(`Ninja ${assignedNinjaId} not found`);
    }

    mission.complete();
    ninja.recordCompletedMission(mission.id);

    await this.missionRepository.save(mission);
    await this.ninjaRepository.save(ninja);

    return { mission, ninja };
  }
}
