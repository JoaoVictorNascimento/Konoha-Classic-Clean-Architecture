import { describe, it, expect } from 'vitest';
import { Mission } from '@/domain/entities/Mission';
import { DomainError } from '@/domain/errors/DomainError';
import { MissionStatus } from '@/domain/value-objects/MissionStatus';

describe('Mission', () => {
  it('creates mission as Available by default', () => {
    const mission = new Mission({
      id: 'm1',
      title: 'Escort the daimyo',
      villageId: 'konoha',
    });

    expect(mission.status).toBe(MissionStatus.Available);
    expect(mission.assignedNinjaId).toBeUndefined();
  });

  it('rejects empty title', () => {
    expect(
      () => new Mission({ id: 'm1', title: '  ', villageId: 'konoha' }),
    ).toThrow(DomainError);
  });

  it('accepts mission and assigns ninja', () => {
    const mission = new Mission({
      id: 'm1',
      title: 'Find the cat',
      villageId: 'konoha',
    });

    mission.accept('n1');

    expect(mission.status).toBe(MissionStatus.InProgress);
    expect(mission.assignedNinjaId).toBe('n1');
  });

  it('completes mission after accept', () => {
    const mission = new Mission({
      id: 'm1',
      title: 'Protect the bridge',
      villageId: 'konoha',
    });

    mission.accept('n1');
    mission.complete();

    expect(mission.status).toBe(MissionStatus.Completed);
  });

  it('rejects accepting mission twice', () => {
    const mission = new Mission({
      id: 'm1',
      title: 'Spy mission',
      villageId: 'konoha',
    });

    mission.accept('n1');
    expect(() => mission.accept('n2')).toThrow(DomainError);
  });

  it('rejects complete when not in progress', () => {
    const mission = new Mission({
      id: 'm1',
      title: 'Patrol',
      villageId: 'konoha',
    });

    expect(() => mission.complete()).toThrow(DomainError);
  });

  it('canBeAcceptedBy returns false when not available', () => {
    const mission = new Mission({
      id: 'm1',
      title: 'Rescue',
      villageId: 'konoha',
    });

    mission.accept('n1');
    expect(mission.canBeAcceptedBy('n2')).toBe(false);
  });
});
