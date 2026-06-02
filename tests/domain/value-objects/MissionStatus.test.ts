import { describe, it, expect } from 'vitest';
import {
  MissionStatus,
  canTransitionTo,
} from '@/domain/value-objects/MissionStatus';

describe('MissionStatus', () => {
  it('allows Available to InProgress', () => {
    expect(
      canTransitionTo(MissionStatus.Available, MissionStatus.InProgress),
    ).toBe(true);
  });

  it('allows InProgress to Completed', () => {
    expect(
      canTransitionTo(MissionStatus.InProgress, MissionStatus.Completed),
    ).toBe(true);
  });

  it('rejects invalid transitions', () => {
    expect(
      canTransitionTo(MissionStatus.Available, MissionStatus.Completed),
    ).toBe(false);
    expect(
      canTransitionTo(MissionStatus.Completed, MissionStatus.Available),
    ).toBe(false);
    expect(
      canTransitionTo(MissionStatus.InProgress, MissionStatus.Available),
    ).toBe(false);
  });
});
