import { describe, it, expect, beforeEach } from 'vitest';
import { Ninja } from '@/domain/entities/Ninja';
import { Mission } from '@/domain/entities/Mission';
import { AcceptMissionUseCase } from '@/domain/usecases/AcceptMissionUseCase';
import { CompleteMissionUseCase } from '@/domain/usecases/CompleteMissionUseCase';
import { CompleteMissionController } from '@/presentation/controllers/CompleteMissionController';
import { MissionStatus } from '@/domain/value-objects/MissionStatus';
import { InMemoryNinjaRepository } from '../../domain/repositories/InMemoryNinjaRepository';
import { InMemoryMissionRepository } from '../../domain/repositories/InMemoryMissionRepository';

describe('CompleteMissionController', () => {
  let controller: CompleteMissionController;

  beforeEach(async () => {
    const ninjaRepository = new InMemoryNinjaRepository();
    const missionRepository = new InMemoryMissionRepository();
    await ninjaRepository.save(
      new Ninja({ id: 'n1', name: 'Naruto Uzumaki', villageId: 'konoha' }),
    );
    await missionRepository.save(
      new Mission({ id: 'm1', title: 'Retrieve the scroll', villageId: 'konoha' }),
    );

    const acceptUseCase = new AcceptMissionUseCase(
      missionRepository,
      ninjaRepository,
    );
    await acceptUseCase.execute({ missionId: 'm1', ninjaId: 'n1' });

    controller = new CompleteMissionController(
      new CompleteMissionUseCase(missionRepository, ninjaRepository),
    );
  });

  it('returns completed mission and ninja with history', async () => {
    const result = await controller.handle({ missionId: 'm1' });

    expect(result.mission.status).toBe(MissionStatus.Completed);
    expect(result.ninja.missionHistory).toContain('m1');
  });
});
