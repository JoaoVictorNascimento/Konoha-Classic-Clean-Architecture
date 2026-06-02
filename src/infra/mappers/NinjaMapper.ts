import { Ninja } from '@/domain/entities/Ninja';
import { NinjaRank } from '@/domain/value-objects/NinjaRank';
import {
  KONOHA_AFFILIATION,
  KONOHA_VILLAGE_ID,
  NINJA_ID_PREFIX,
} from '@/infra/api/dattebayo/DattebayoConfig';
import { DattebayoCharacter } from '@/infra/api/dattebayo/DattebayoTypes';

export interface NinjaOverrides {
  rank?: NinjaRank;
  missionHistory?: string[];
}

const RANK_PRIORITY: NinjaRank[] = [
  NinjaRank.Genin,
  NinjaRank.Chunin,
  NinjaRank.Jonin,
];

export function isKonohaCharacter(character: DattebayoCharacter): boolean {
  const affiliation = character.personal?.affiliation;
  if (!affiliation) {
    return false;
  }
  const values = Array.isArray(affiliation) ? affiliation : [affiliation];
  return values.some((value) => value.includes(KONOHA_AFFILIATION));
}

export function mapRankFromApi(
  ninjaRank?: Record<string, string>,
): NinjaRank {
  if (!ninjaRank) {
    return NinjaRank.Genin;
  }

  const ranks = Object.values(ninjaRank).map((value) => value.toLowerCase());

  if (ranks.some((value) => value.includes('kage') || value.includes('jonin'))) {
    return NinjaRank.Jonin;
  }
  if (ranks.some((value) => value.includes('chunin'))) {
    return NinjaRank.Chunin;
  }
  if (ranks.some((value) => value.includes('genin'))) {
    return NinjaRank.Genin;
  }

  return NinjaRank.Genin;
}

export function toNinjaId(externalId: number): string {
  return `${NINJA_ID_PREFIX}${externalId}`;
}

export function parseExternalId(ninjaId: string): number | null {
  if (!ninjaId.startsWith(NINJA_ID_PREFIX)) {
    return null;
  }
  const parsed = Number(ninjaId.slice(NINJA_ID_PREFIX.length));
  return Number.isNaN(parsed) ? null : parsed;
}

function pickCharacterImage(character: DattebayoCharacter): string | undefined {
  const firstImage = character.images?.find((url) => url.trim().length > 0);
  return firstImage?.trim();
}

export function mapCharacterToNinja(
  character: DattebayoCharacter,
  overrides?: NinjaOverrides,
): Ninja {
  return new Ninja({
    id: toNinjaId(character.id),
    name: character.name,
    villageId: KONOHA_VILLAGE_ID,
    externalId: character.id,
    imageUrl: pickCharacterImage(character),
    rank: overrides?.rank ?? mapRankFromApi(character.rank?.ninjaRank),
    missionHistory: overrides?.missionHistory ?? [],
  });
}
