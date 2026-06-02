import { describe, it, expect, beforeEach } from 'vitest';
import { Mission } from '@/domain/entities/Mission';
import { GetMissionsUseCase } from '@/domain/usecases/GetMissionsUseCase';
import { InMemoryMissionRepository } from '../repositories/InMemoryMissionRepository';

describe('GetMissionsUseCase', () => {
  let repository: InMemoryMissionRepository;
  let useCase: GetMissionsUseCase;

  beforeEach(() => {
    repository = new InMemoryMissionRepository();
    useCase = new GetMissionsUseCase(repository);
  });

  it('returns empty list when no missions exist', async () => {
    expect(await useCase.execute()).toEqual([]);
  });

  it('returns all saved missions', async () => {
    await repository.save(
      new Mission({ id: 'm1', title: 'Find the cat', villageId: 'konoha' }),
    );
    await repository.save(
      new Mission({ id: 'm2', title: 'Patrol', villageId: 'konoha' }),
    );

    const result = await useCase.execute();

    expect(result).toHaveLength(2);
  });

  it('filters by villageId', async () => {
    await repository.save(
      new Mission({ id: 'm1', title: 'Konoha mission', villageId: 'konoha' }),
    );
    await repository.save(
      new Mission({ id: 'm2', title: 'Suna mission', villageId: 'suna' }),
    );

    const result = await useCase.execute({ villageId: 'konoha' });

    expect(result).toHaveLength(1);
    expect(result[0].villageId).toBe('konoha');
  });
});
