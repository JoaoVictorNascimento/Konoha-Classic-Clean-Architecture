import { describe, it, expect, beforeEach } from 'vitest';
import { Ninja } from '@/domain/entities/Ninja';
import { Mission } from '@/domain/entities/Mission';
import { MissionStatus } from '@/domain/value-objects/MissionStatus';
import { AcceptMissionUseCase } from '@/domain/usecases/AcceptMissionUseCase';
import { CompleteMissionUseCase } from '@/domain/usecases/CompleteMissionUseCase';
import { GetMissionsUseCase } from '@/domain/usecases/GetMissionsUseCase';
import { InMemoryNinjaRepository } from '../repositories/InMemoryNinjaRepository';
import { InMemoryMissionRepository } from '../repositories/InMemoryMissionRepository';

describe('Accept → Complete use case flow', () => {
  let ninjaRepository: InMemoryNinjaRepository;
  let missionRepository: InMemoryMissionRepository;
  let acceptMission: AcceptMissionUseCase;
  let completeMission: CompleteMissionUseCase;
  let getMissions: GetMissionsUseCase;

  beforeEach(async () => {
    ninjaRepository = new InMemoryNinjaRepository();
    missionRepository = new InMemoryMissionRepository();
    acceptMission = new AcceptMissionUseCase(missionRepository, ninjaRepository);
    completeMission = new CompleteMissionUseCase(
      missionRepository,
      ninjaRepository,
    );
    getMissions = new GetMissionsUseCase(missionRepository);

    await ninjaRepository.save(
      new Ninja({ id: 'n1', name: 'Naruto Uzumaki', villageId: 'konoha' }),
    );
    await missionRepository.save(
      new Mission({
        id: 'm1',
        title: 'Retrieve the scroll',
        villageId: 'konoha',
      }),
    );
  });

  it('runs full Hokage mission lifecycle via use cases', async () => {
    await acceptMission.execute({ missionId: 'm1', ninjaId: 'n1' });

    const { mission, ninja } = await completeMission.execute({ missionId: 'm1' });

    expect(mission.status).toBe(MissionStatus.Completed);
    expect(ninja.missionHistory).toContain('m1');

    const missions = await getMissions.execute({ villageId: 'konoha' });
    expect(missions.find((item) => item.id === 'm1')?.status).toBe(
      MissionStatus.Completed,
    );
  });
});
