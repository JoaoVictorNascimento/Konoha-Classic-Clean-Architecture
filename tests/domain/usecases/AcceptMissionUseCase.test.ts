import { describe, it, expect, beforeEach } from 'vitest';
import { Ninja } from '@/domain/entities/Ninja';
import { Mission } from '@/domain/entities/Mission';
import { DomainError } from '@/domain/errors/DomainError';
import { MissionStatus } from '@/domain/value-objects/MissionStatus';
import { AcceptMissionUseCase } from '@/domain/usecases/AcceptMissionUseCase';
import { InMemoryNinjaRepository } from '../repositories/InMemoryNinjaRepository';
import { InMemoryMissionRepository } from '../repositories/InMemoryMissionRepository';

describe('AcceptMissionUseCase', () => {
  let ninjaRepository: InMemoryNinjaRepository;
  let missionRepository: InMemoryMissionRepository;
  let useCase: AcceptMissionUseCase;

  beforeEach(async () => {
    ninjaRepository = new InMemoryNinjaRepository();
    missionRepository = new InMemoryMissionRepository();
    useCase = new AcceptMissionUseCase(missionRepository, ninjaRepository);

    await ninjaRepository.save(
      new Ninja({ id: 'n1', name: 'Naruto', villageId: 'konoha' }),
    );
    await missionRepository.save(
      new Mission({ id: 'm1', title: 'Find the cat', villageId: 'konoha' }),
    );
  });

  it('accepts mission for ninja from same village', async () => {
    const result = await useCase.execute({ missionId: 'm1', ninjaId: 'n1' });

    expect(result.status).toBe(MissionStatus.InProgress);
    expect(result.assignedNinjaId).toBe('n1');

    const saved = await missionRepository.findById('m1');
    expect(saved?.status).toBe(MissionStatus.InProgress);
  });

  it('throws when mission not found', async () => {
    await expect(
      useCase.execute({ missionId: 'missing', ninjaId: 'n1' }),
    ).rejects.toThrow(DomainError);
  });

  it('throws when ninja not found', async () => {
    await expect(
      useCase.execute({ missionId: 'm1', ninjaId: 'missing' }),
    ).rejects.toThrow(DomainError);
  });

  it('throws when ninja is from another village', async () => {
    await ninjaRepository.save(
      new Ninja({ id: 'n2', name: 'Gaara', villageId: 'suna' }),
    );

    await expect(
      useCase.execute({ missionId: 'm1', ninjaId: 'n2' }),
    ).rejects.toThrow(DomainError);
  });

  it('throws when mission is already accepted', async () => {
    await useCase.execute({ missionId: 'm1', ninjaId: 'n1' });

    await expect(
      useCase.execute({ missionId: 'm1', ninjaId: 'n1' }),
    ).rejects.toThrow(DomainError);
  });
});
