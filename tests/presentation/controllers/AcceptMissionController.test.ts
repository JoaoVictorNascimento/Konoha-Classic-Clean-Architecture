import { describe, it, expect, beforeEach } from 'vitest';
import { Ninja } from '@/domain/entities/Ninja';
import { Mission } from '@/domain/entities/Mission';
import { AcceptMissionUseCase } from '@/domain/usecases/AcceptMissionUseCase';
import { AcceptMissionController } from '@/presentation/controllers/AcceptMissionController';
import { MissionStatus } from '@/domain/value-objects/MissionStatus';
import { InMemoryNinjaRepository } from '../../domain/repositories/InMemoryNinjaRepository';
import { InMemoryMissionRepository } from '../../domain/repositories/InMemoryMissionRepository';

describe('AcceptMissionController', () => {
  let controller: AcceptMissionController;

  beforeEach(async () => {
    const ninjaRepository = new InMemoryNinjaRepository();
    const missionRepository = new InMemoryMissionRepository();
    await ninjaRepository.save(
      new Ninja({ id: 'n1', name: 'Naruto', villageId: 'konoha' }),
    );
    await missionRepository.save(
      new Mission({ id: 'm1', title: 'Find the cat', villageId: 'konoha' }),
    );
    controller = new AcceptMissionController(
      new AcceptMissionUseCase(missionRepository, ninjaRepository),
    );
  });

  it('returns mission view model in progress', async () => {
    const result = await controller.handle({ missionId: 'm1', ninjaId: 'n1' });
    expect(result.status).toBe(MissionStatus.InProgress);
    expect(result.assignedNinjaId).toBe('n1');
  });
});
