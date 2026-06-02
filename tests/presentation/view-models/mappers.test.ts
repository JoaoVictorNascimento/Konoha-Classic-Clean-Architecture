import { describe, it, expect } from 'vitest';
import { Ninja } from '@/domain/entities/Ninja';
import { Mission } from '@/domain/entities/Mission';
import { NinjaRank } from '@/domain/value-objects/NinjaRank';
import { MissionStatus } from '@/domain/value-objects/MissionStatus';
import { toNinjaViewModel } from '@/presentation/view-models/mappers/toNinjaViewModel';
import { toMissionViewModel } from '@/presentation/view-models/mappers/toMissionViewModel';

describe('presentation mappers', () => {
  it('maps ninja to view model', () => {
    const ninja = new Ninja({
      id: 'n1',
      name: 'Naruto Uzumaki',
      villageId: 'konoha',
      externalId: 1344,
      imageUrl: 'https://example.com/naruto.png',
      rank: NinjaRank.Genin,
      missionHistory: ['m1'],
    });

    expect(toNinjaViewModel(ninja)).toEqual({
      id: 'n1',
      name: 'Naruto Uzumaki',
      rank: NinjaRank.Genin,
      villageId: 'konoha',
      externalId: 1344,
      imageUrl: 'https://example.com/naruto.png',
      missionHistory: ['m1'],
    });
  });

  it('maps mission to view model', () => {
    const mission = new Mission({
      id: 'm1',
      title: 'Find the cat',
      description: 'D-rank',
      villageId: 'konoha',
      status: MissionStatus.InProgress,
      assignedNinjaId: 'n1',
    });

    expect(toMissionViewModel(mission)).toEqual({
      id: 'm1',
      title: 'Find the cat',
      description: 'D-rank',
      status: MissionStatus.InProgress,
      villageId: 'konoha',
      assignedNinjaId: 'n1',
    });
  });
});
