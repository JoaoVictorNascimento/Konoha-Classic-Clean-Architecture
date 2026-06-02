import { describe, it, expect, beforeEach } from 'vitest';
import { Mission } from '@/domain/entities/Mission';
import { MissionStatus } from '@/domain/value-objects/MissionStatus';
import { InMemoryMissionRepository } from './InMemoryMissionRepository';

describe('MissionRepository contract', () => {
  let repository: InMemoryMissionRepository;

  beforeEach(() => {
    repository = new InMemoryMissionRepository();
  });

  it('findAll returns saved missions', async () => {
    const mission = new Mission({
      id: 'm1',
      title: 'Find the cat',
      villageId: 'konoha',
    });
    await repository.save(mission);

    const result = await repository.findAll();

    expect(result).toHaveLength(1);
    expect(result[0].title).toBe('Find the cat');
  });

  it('findAll filters by villageId', async () => {
    await repository.save(
      new Mission({ id: 'm1', title: 'Konoha patrol', villageId: 'konoha' }),
    );
    await repository.save(
      new Mission({ id: 'm2', title: 'Suna escort', villageId: 'suna' }),
    );

    const konohaMissions = await repository.findAll('konoha');

    expect(konohaMissions).toHaveLength(1);
    expect(konohaMissions[0].villageId).toBe('konoha');
  });

  it('findById returns null when mission does not exist', async () => {
    expect(await repository.findById('missing')).toBeNull();
  });

  it('save persists state after accept and complete', async () => {
    const mission = new Mission({
      id: 'm1',
      title: 'Protect the bridge',
      villageId: 'konoha',
    });
    await repository.save(mission);

    mission.accept('n1');
    await repository.save(mission);

    let found = await repository.findById('m1');
    expect(found?.status).toBe(MissionStatus.InProgress);
    expect(found?.assignedNinjaId).toBe('n1');

    found!.complete();
    await repository.save(found!);

    const completed = await repository.findById('m1');
    expect(completed?.status).toBe(MissionStatus.Completed);
  });
});
