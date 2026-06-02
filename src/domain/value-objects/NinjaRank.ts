export enum NinjaRank {
  Genin = 'Genin',
  Chunin = 'Chunin',
  Jonin = 'Jonin',
}

const RANK_ORDER: NinjaRank[] = [
  NinjaRank.Genin,
  NinjaRank.Chunin,
  NinjaRank.Jonin,
];

export function getNextRank(current: NinjaRank): NinjaRank | null {
  const index = RANK_ORDER.indexOf(current);
  if (index === -1 || index === RANK_ORDER.length - 1) {
    return null;
  }
  return RANK_ORDER[index + 1];
}

export function canPromote(current: NinjaRank): boolean {
  return getNextRank(current) !== null;
}
