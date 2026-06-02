import { describe, it, expect } from 'vitest';
import { Village } from '@/domain/entities/Village';
import { Ninja } from '@/domain/entities/Ninja';
import { Mission } from '@/domain/entities/Mission';
import { MissionStatus } from '@/domain/value-objects/MissionStatus';

describe('Hokage mission flow', () => {
  it('ninja accepts mission, completes it, and records history', () => {
    const village = new Village({ id: 'konoha', name: 'Konohagakure' });
    const ninja = new Ninja({
      id: 'n1',
      name: 'Naruto Uzumaki',
      villageId: village.id,
    });
    const mission = new Mission({
      id: 'm1',
      title: 'Retrieve the scroll',
      description: 'D-rank mission in the Land of Waves',
      villageId: village.id,
    });

    village.registerNinja(ninja.id);

    expect(mission.canBeAcceptedBy(ninja.id)).toBe(true);
    mission.accept(ninja.id);
    mission.complete();
    ninja.recordCompletedMission(mission.id);

    expect(mission.status).toBe(MissionStatus.Completed);
    expect(mission.assignedNinjaId).toBe(ninja.id);
    expect(ninja.missionHistory).toContain(mission.id);
    expect(village.ninjaIds).toContain(ninja.id);
  });
});
