import { describe, it, expect, beforeEach } from 'vitest';
import { Ninja } from '@/domain/entities/Ninja';
import { NinjaRank } from '@/domain/value-objects/NinjaRank';
import { InMemoryNinjaRepository } from './InMemoryNinjaRepository';

describe('NinjaRepository contract', () => {
  let repository: InMemoryNinjaRepository;

  beforeEach(() => {
    repository = new InMemoryNinjaRepository();
  });

  it('findAll returns saved ninjas', async () => {
    const ninja = new Ninja({
      id: 'n1',
      name: 'Naruto Uzumaki',
      villageId: 'konoha',
    });
    await repository.save(ninja);

    const result = await repository.findAll();

    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('n1');
  });

  it('findAll filters by villageId', async () => {
    await repository.save(
      new Ninja({ id: 'n1', name: 'Naruto', villageId: 'konoha' }),
    );
    await repository.save(
      new Ninja({ id: 'n2', name: 'Gaara', villageId: 'suna' }),
    );

    const konohaNinjas = await repository.findAll('konoha');

    expect(konohaNinjas).toHaveLength(1);
    expect(konohaNinjas[0].villageId).toBe('konoha');
  });

  it('findById returns null when ninja does not exist', async () => {
    expect(await repository.findById('missing')).toBeNull();
  });

  it('findById returns saved ninja', async () => {
    const ninja = new Ninja({
      id: 'n1',
      name: 'Sasuke Uchiha',
      villageId: 'konoha',
    });
    await repository.save(ninja);

    const found = await repository.findById('n1');

    expect(found?.name).toBe('Sasuke Uchiha');
  });

  it('save persists state after promote', async () => {
    const ninja = new Ninja({
      id: 'n1',
      name: 'Sakura Haruno',
      villageId: 'konoha',
    });
    await repository.save(ninja);

    ninja.promote();
    await repository.save(ninja);

    const found = await repository.findById('n1');
    expect(found?.rank).toBe(NinjaRank.Chunin);
  });

  it('save persists mission history', async () => {
    const ninja = new Ninja({
      id: 'n1',
      name: 'Kakashi Hatake',
      villageId: 'konoha',
    });
    await repository.save(ninja);

    ninja.recordCompletedMission('m1');
    await repository.save(ninja);

    const found = await repository.findById('n1');
    expect(found?.missionHistory).toContain('m1');
  });
});
