import { describe, it, expect } from 'vitest';
import {
  NinjaRank,
  getNextRank,
  canPromote,
} from '@/domain/value-objects/NinjaRank';

describe('NinjaRank', () => {
  it('returns next rank in promotion chain', () => {
    expect(getNextRank(NinjaRank.Genin)).toBe(NinjaRank.Chunin);
    expect(getNextRank(NinjaRank.Chunin)).toBe(NinjaRank.Jonin);
  });

  it('returns null when already at max rank', () => {
    expect(getNextRank(NinjaRank.Jonin)).toBeNull();
    expect(canPromote(NinjaRank.Jonin)).toBe(false);
  });

  it('allows promotion below Jonin', () => {
    expect(canPromote(NinjaRank.Genin)).toBe(true);
    expect(canPromote(NinjaRank.Chunin)).toBe(true);
  });
});
