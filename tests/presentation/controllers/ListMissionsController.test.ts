import { describe, it, expect, beforeEach } from 'vitest';
import { Mission } from '@/domain/entities/Mission';
import { GetMissionsUseCase } from '@/domain/usecases/GetMissionsUseCase';
import { ListMissionsController } from '@/presentation/controllers/ListMissionsController';
import { InMemoryMissionRepository } from '../../domain/repositories/InMemoryMissionRepository';

describe('ListMissionsController', () => {
  let controller: ListMissionsController;

  beforeEach(async () => {
    const repository = new InMemoryMissionRepository();
    await repository.save(
      new Mission({ id: 'm1', title: 'Find the cat', villageId: 'konoha' }),
    );
    await repository.save(
      new Mission({ id: 'm2', title: 'Suna escort', villageId: 'suna' }),
    );
    controller = new ListMissionsController(new GetMissionsUseCase(repository));
  });

  it('returns mission view models', async () => {
    const result = await controller.handle();
    expect(result).toHaveLength(2);
    expect(result[0].title).toBe('Find the cat');
  });

  it('filters by villageId', async () => {
    const result = await controller.handle({ villageId: 'konoha' });
    expect(result).toHaveLength(1);
    expect(result[0].villageId).toBe('konoha');
  });
});
