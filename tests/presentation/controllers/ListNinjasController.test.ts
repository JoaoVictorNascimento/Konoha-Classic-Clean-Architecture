import { describe, it, expect, beforeEach } from 'vitest';
import { Ninja } from '@/domain/entities/Ninja';
import { GetNinjasUseCase } from '@/domain/usecases/GetNinjasUseCase';
import { ListNinjasController } from '@/presentation/controllers/ListNinjasController';
import { InMemoryNinjaRepository } from '../../domain/repositories/InMemoryNinjaRepository';

describe('ListNinjasController', () => {
  let controller: ListNinjasController;

  beforeEach(async () => {
    const repository = new InMemoryNinjaRepository();
    await repository.save(
      new Ninja({ id: 'n1', name: 'Naruto', villageId: 'konoha' }),
    );
    await repository.save(
      new Ninja({ id: 'n2', name: 'Gaara', villageId: 'suna' }),
    );
    controller = new ListNinjasController(new GetNinjasUseCase(repository));
  });

  it('returns ninja view models', async () => {
    const result = await controller.handle();
    expect(result).toHaveLength(2);
    expect(result[0].name).toBe('Naruto');
  });

  it('filters by villageId', async () => {
    const result = await controller.handle({ villageId: 'konoha' });
    expect(result).toHaveLength(1);
    expect(result[0].villageId).toBe('konoha');
  });
});
