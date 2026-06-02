import { describe, it, expect, beforeEach } from 'vitest';
import { Ninja } from '@/domain/entities/Ninja';
import { DomainError } from '@/domain/errors/DomainError';
import { NinjaRank } from '@/domain/value-objects/NinjaRank';
import { PromoteNinjaUseCase } from '@/domain/usecases/PromoteNinjaUseCase';
import { InMemoryNinjaRepository } from '../repositories/InMemoryNinjaRepository';

describe('PromoteNinjaUseCase', () => {
  let repository: InMemoryNinjaRepository;
  let useCase: PromoteNinjaUseCase;

  beforeEach(() => {
    repository = new InMemoryNinjaRepository();
    useCase = new PromoteNinjaUseCase(repository);
  });

  it('promotes ninja and persists', async () => {
    await repository.save(
      new Ninja({ id: 'n1', name: 'Naruto', villageId: 'konoha' }),
    );

    const result = await useCase.execute({ ninjaId: 'n1' });

    expect(result.rank).toBe(NinjaRank.Chunin);
    const saved = await repository.findById('n1');
    expect(saved?.rank).toBe(NinjaRank.Chunin);
  });

  it('promotes through full chain', async () => {
    await repository.save(
      new Ninja({ id: 'n1', name: 'Kakashi', villageId: 'konoha' }),
    );

    await useCase.execute({ ninjaId: 'n1' });
    await useCase.execute({ ninjaId: 'n1' });

    const saved = await repository.findById('n1');
    expect(saved?.rank).toBe(NinjaRank.Jonin);
  });

  it('throws when ninja not found', async () => {
    await expect(useCase.execute({ ninjaId: 'missing' })).rejects.toThrow(
      DomainError,
    );
  });

  it('throws when ninja is already Jonin', async () => {
    await repository.save(
      new Ninja({
        id: 'n1',
        name: 'Hokage',
        villageId: 'konoha',
        rank: NinjaRank.Jonin,
      }),
    );

    await expect(useCase.execute({ ninjaId: 'n1' })).rejects.toThrow(
      DomainError,
    );
  });
});
