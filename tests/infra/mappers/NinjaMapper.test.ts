import { describe, it, expect } from 'vitest';
import { NinjaRank } from '@/domain/value-objects/NinjaRank';
import {
  isKonohaCharacter,
  mapCharacterToNinja,
  mapRankFromApi,
  parseExternalId,
  toNinjaId,
} from '@/infra/mappers/NinjaMapper';
import narutoFixture from '../fixtures/naruto-character.json';

describe('NinjaMapper', () => {
  it('detects Konoha affiliation', () => {
    expect(isKonohaCharacter(narutoFixture)).toBe(true);
  });

  it('maps character to ninja with external id', () => {
    const ninja = mapCharacterToNinja(narutoFixture);

    expect(ninja.id).toBe(toNinjaId(1344));
    expect(ninja.name).toBe('Naruto Uzumaki');
    expect(ninja.villageId).toBe('konoha');
    expect(ninja.externalId).toBe(1344);
  });

  it('maps highest known rank from API', () => {
    expect(mapRankFromApi(narutoFixture.rank?.ninjaRank)).toBe(NinjaRank.Jonin);
  });

  it('applies overrides for rank and history', () => {
    const ninja = mapCharacterToNinja(narutoFixture, {
      rank: NinjaRank.Chunin,
      missionHistory: ['m1'],
    });

    expect(ninja.rank).toBe(NinjaRank.Chunin);
    expect(ninja.missionHistory).toEqual(['m1']);
  });

  it('parses external id from domain id', () => {
    expect(parseExternalId('ninja-1344')).toBe(1344);
    expect(parseExternalId('invalid')).toBeNull();
  });
});
