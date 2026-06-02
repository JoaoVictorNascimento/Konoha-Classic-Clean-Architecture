import { describe, it, expect, beforeEach } from 'vitest';
import { Ninja } from '@/domain/entities/Ninja';
import { DomainError } from '@/domain/errors/DomainError';
import { NinjaRank } from '@/domain/value-objects/NinjaRank';
import { PromoteNinjaUseCase } from '@/domain/usecases/PromoteNinjaUseCase';
import { PromoteNinjaController } from '@/presentation/controllers/PromoteNinjaController';
import { InMemoryNinjaRepository } from '../../domain/repositories/InMemoryNinjaRepository';

describe('PromoteNinjaController', () => {
  let controller: PromoteNinjaController;

  beforeEach(async () => {
    const repository = new InMemoryNinjaRepository();
    await repository.save(
      new Ninja({ id: 'n1', name: 'Naruto', villageId: 'konoha' }),
    );
    controller = new PromoteNinjaController(new PromoteNinjaUseCase(repository));
  });

  it('returns promoted ninja view model', async () => {
    const result = await controller.handle({ ninjaId: 'n1' });
    expect(result.rank).toBe(NinjaRank.Chunin);
  });

  it('propagates DomainError when ninja not found', async () => {
    await expect(controller.handle({ ninjaId: 'missing' })).rejects.toThrow(
      DomainError,
    );
  });
});
