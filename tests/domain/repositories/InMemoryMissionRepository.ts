import { Mission } from '@/domain/entities/Mission';
import { MissionRepository } from '@/domain/repositories/MissionRepository';

export class InMemoryMissionRepository implements MissionRepository {
  private readonly store = new Map<string, Mission>();

  async findAll(villageId?: string): Promise<Mission[]> {
    const missions = Array.from(this.store.values());
    if (!villageId) {
      return missions;
    }
    return missions.filter((mission) => mission.villageId === villageId);
  }

  async findById(id: string): Promise<Mission | null> {
    return this.store.get(id) ?? null;
  }

  async save(mission: Mission): Promise<void> {
    this.store.set(mission.id, mission);
  }
}
