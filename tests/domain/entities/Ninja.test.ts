import { describe, it, expect } from 'vitest';
import { Ninja } from '@/domain/entities/Ninja';
import { DomainError } from '@/domain/errors/DomainError';
import { NinjaRank } from '@/domain/value-objects/NinjaRank';

describe('Ninja', () => {
  it('creates ninja with default Genin rank', () => {
    const ninja = new Ninja({
      id: 'n1',
      name: 'Naruto Uzumaki',
      villageId: 'konoha',
      externalId: 1344,
    });

    expect(ninja.rank).toBe(NinjaRank.Genin);
    expect(ninja.missionHistory).toEqual([]);
    expect(ninja.externalId).toBe(1344);
  });

  it('rejects empty name', () => {
    expect(
      () => new Ninja({ id: 'n1', name: '', villageId: 'konoha' }),
    ).toThrow(DomainError);
  });

  it('promotes through Genin → Chunin → Jonin', () => {
    const ninja = new Ninja({
      id: 'n1',
      name: 'Sasuke Uchiha',
      villageId: 'konoha',
    });

    ninja.promote();
    expect(ninja.rank).toBe(NinjaRank.Chunin);

    ninja.promote();
    expect(ninja.rank).toBe(NinjaRank.Jonin);
  });

  it('throws when promoting Jonin', () => {
    const ninja = new Ninja({
      id: 'n1',
      name: 'Kakashi Hatake',
      villageId: 'konoha',
      rank: NinjaRank.Jonin,
    });

    expect(() => ninja.promote()).toThrow(DomainError);
  });

  it('records completed missions without duplicates', () => {
    const ninja = new Ninja({
      id: 'n1',
      name: 'Sakura Haruno',
      villageId: 'konoha',
    });

    ninja.recordCompletedMission('m1');
    ninja.recordCompletedMission('m1');
    ninja.recordCompletedMission('m2');

    expect(ninja.missionHistory).toEqual(['m1', 'm2']);
  });
});
