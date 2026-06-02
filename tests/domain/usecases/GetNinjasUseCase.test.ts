import { describe, it, expect, beforeEach } from 'vitest';
import { Ninja } from '@/domain/entities/Ninja';
import { GetNinjasUseCase } from '@/domain/usecases/GetNinjasUseCase';
import { InMemoryNinjaRepository } from '../repositories/InMemoryNinjaRepository';

describe('GetNinjasUseCase', () => {
  let repository: InMemoryNinjaRepository;
  let useCase: GetNinjasUseCase;

  beforeEach(() => {
    repository = new InMemoryNinjaRepository();
    useCase = new GetNinjasUseCase(repository);
  });

  it('returns empty list when no ninjas exist', async () => {
    expect(await useCase.execute()).toEqual([]);
  });

  it('returns all saved ninjas', async () => {
    await repository.save(
      new Ninja({ id: 'n1', name: 'Naruto', villageId: 'konoha' }),
    );
    await repository.save(
      new Ninja({ id: 'n2', name: 'Sasuke', villageId: 'konoha' }),
    );

    const result = await useCase.execute();

    expect(result).toHaveLength(2);
  });

  it('filters by villageId', async () => {
    await repository.save(
      new Ninja({ id: 'n1', name: 'Naruto', villageId: 'konoha' }),
    );
    await repository.save(
      new Ninja({ id: 'n2', name: 'Gaara', villageId: 'suna' }),
    );

    const result = await useCase.execute({ villageId: 'konoha' });

    expect(result).toHaveLength(1);
    expect(result[0].villageId).toBe('konoha');
  });
});
