import { Mission } from '@/domain/entities/Mission';
import { MissionRepository } from '@/domain/repositories/MissionRepository';

export class GetMissionsUseCase {
  constructor(private readonly missionRepository: MissionRepository) {}

  async execute(input?: { villageId?: string }): Promise<Mission[]> {
    return this.missionRepository.findAll(input?.villageId);
  }
}
