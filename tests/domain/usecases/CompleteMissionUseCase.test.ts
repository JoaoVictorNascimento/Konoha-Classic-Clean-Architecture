import { describe, it, expect, beforeEach } from 'vitest';
import { Ninja } from '@/domain/entities/Ninja';
import { Mission } from '@/domain/entities/Mission';
import { DomainError } from '@/domain/errors/DomainError';
import { MissionStatus } from '@/domain/value-objects/MissionStatus';
import { AcceptMissionUseCase } from '@/domain/usecases/AcceptMissionUseCase';
import { CompleteMissionUseCase } from '@/domain/usecases/CompleteMissionUseCase';
import { InMemoryNinjaRepository } from '../repositories/InMemoryNinjaRepository';
import { InMemoryMissionRepository } from '../repositories/InMemoryMissionRepository';

describe('CompleteMissionUseCase', () => {
  let ninjaRepository: InMemoryNinjaRepository;
  let missionRepository: InMemoryMissionRepository;
  let acceptUseCase: AcceptMissionUseCase;
  let useCase: CompleteMissionUseCase;

  beforeEach(async () => {
    ninjaRepository = new InMemoryNinjaRepository();
    missionRepository = new InMemoryMissionRepository();
    acceptUseCase = new AcceptMissionUseCase(missionRepository, ninjaRepository);
    useCase = new CompleteMissionUseCase(missionRepository, ninjaRepository);

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

  it('completes mission and records ninja history', async () => {
    await acceptUseCase.execute({ missionId: 'm1', ninjaId: 'n1' });

    const { mission, ninja } = await useCase.execute({ missionId: 'm1' });

    expect(mission.status).toBe(MissionStatus.Completed);
    expect(ninja.missionHistory).toContain('m1');

    const savedMission = await missionRepository.findById('m1');
    const savedNinja = await ninjaRepository.findById('n1');
    expect(savedMission?.status).toBe(MissionStatus.Completed);
    expect(savedNinja?.missionHistory).toContain('m1');
  });

  it('throws when mission not found', async () => {
    await expect(useCase.execute({ missionId: 'missing' })).rejects.toThrow(
      DomainError,
    );
  });

  it('throws when mission has no assigned ninja', async () => {
    await expect(useCase.execute({ missionId: 'm1' })).rejects.toThrow(
      DomainError,
    );
  });

  it('throws when mission is not in progress', async () => {
    const mission = await missionRepository.findById('m1');
    mission!.accept('n1');
    mission!.complete();
    await missionRepository.save(mission!);

    await expect(useCase.execute({ missionId: 'm1' })).rejects.toThrow(
      DomainError,
    );
  });
});
