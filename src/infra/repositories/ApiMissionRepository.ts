import { Mission } from '@/domain/entities/Mission';
import { MissionRepository } from '@/domain/repositories/MissionRepository';
import { MissionStatus } from '@/domain/value-objects/MissionStatus';
import { STORAGE_KEY_MISSIONS } from '@/infra/api/dattebayo/DattebayoConfig';
import missionSeed from '@/infra/data/konoha-missions.seed.json';
import { StoragePort } from '@/infra/storage/StoragePort';

interface StoredMission {
  id: string;
  title: string;
  description?: string;
  villageId: string;
  status: MissionStatus;
  assignedNinjaId?: string;
}

export class ApiMissionRepository implements MissionRepository {
  constructor(private readonly storage: StoragePort) {}

  async findAll(villageId?: string): Promise<Mission[]> {
    const missions = this.loadMissions();
    if (!villageId) {
      return missions;
    }
    return missions.filter((mission) => mission.villageId === villageId);
  }

  async findById(id: string): Promise<Mission | null> {
    const missions = this.loadMissions();
    return missions.find((mission) => mission.id === id) ?? null;
  }

  async save(mission: Mission): Promise<void> {
    const missions = this.loadMissions();
    const index = missions.findIndex((item) => item.id === mission.id);

    if (index === -1) {
      missions.push(mission);
    } else {
      missions[index] = mission;
    }

    this.persist(missions);
  }

  private loadMissions(): Mission[] {
    const stored =
      this.storage.get<StoredMission[]>(STORAGE_KEY_MISSIONS) ??
      (missionSeed as StoredMission[]);

    const missions = stored.map((item) => this.toMission(item));

    if (!this.storage.get<StoredMission[]>(STORAGE_KEY_MISSIONS)) {
      this.persist(missions);
    }

    return missions;
  }

  private persist(missions: Mission[]): void {
    const payload: StoredMission[] = missions.map((mission) => ({
      id: mission.id,
      title: mission.title,
      description: mission.description,
      villageId: mission.villageId,
      status: mission.status,
      assignedNinjaId: mission.assignedNinjaId,
    }));

    this.storage.set(STORAGE_KEY_MISSIONS, payload);
  }

  private toMission(item: StoredMission): Mission {
    return new Mission({
      id: item.id,
      title: item.title,
      description: item.description,
      villageId: item.villageId,
      status: item.status,
      assignedNinjaId: item.assignedNinjaId,
    });
  }
}
