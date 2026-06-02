import { describe, it, expect, beforeEach } from 'vitest';
import { MissionStatus } from '@/domain/value-objects/MissionStatus';
import { AcceptMissionUseCase } from '@/domain/usecases/AcceptMissionUseCase';
import { ApiMissionRepository } from '@/infra/repositories/ApiMissionRepository';
import { InMemoryStorageAdapter } from '@/infra/storage/InMemoryStorageAdapter';

describe('ApiMissionRepository', () => {
  let repository: ApiMissionRepository;

  beforeEach(() => {
    repository = new ApiMissionRepository(new InMemoryStorageAdapter());
  });

  it('seeds missions on first findAll', async () => {
    const missions = await repository.findAll('konoha');
    expect(missions.length).toBeGreaterThanOrEqual(3);
    expect(missions[0].status).toBe(MissionStatus.Available);
  });

  it('persists mission state after save', async () => {
    const mission = (await repository.findById('m1'))!;
    mission.accept('n1');
    await repository.save(mission);

    const reloaded = await repository.findById('m1');
    expect(reloaded?.status).toBe(MissionStatus.InProgress);
    expect(reloaded?.assignedNinjaId).toBe('n1');
  });

  it('works with AcceptMissionUseCase', async () => {
    const accept = new AcceptMissionUseCase(repository, {
      findById: async () => null,
      findAll: async () => [],
      save: async () => {},
    });

    await expect(
      accept.execute({ missionId: 'm1', ninjaId: 'n1' }),
    ).rejects.toThrow();
  });
});
