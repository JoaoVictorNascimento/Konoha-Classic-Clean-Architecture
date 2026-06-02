import { DomainError } from '@/domain/errors/DomainError';
import { getNextRank, NinjaRank } from '@/domain/value-objects/NinjaRank';

export class Ninja {
  readonly id: string;
  readonly name: string;
  readonly villageId: string;
  readonly externalId?: number;
  private _rank: NinjaRank;
  private readonly _missionHistory: string[];

  constructor(params: {
    id: string;
    name: string;
    villageId: string;
    externalId?: number;
    rank?: NinjaRank;
    missionHistory?: string[];
  }) {
    const trimmedName = params.name.trim();
    if (!trimmedName) {
      throw new DomainError('Ninja name cannot be empty');
    }
    if (!params.villageId.trim()) {
      throw new DomainError('Ninja must belong to a village');
    }

    this.id = params.id;
    this.name = trimmedName;
    this.villageId = params.villageId;
    this.externalId = params.externalId;
    this._rank = params.rank ?? NinjaRank.Genin;
    this._missionHistory = [...(params.missionHistory ?? [])];
  }

  get rank(): NinjaRank {
    return this._rank;
  }

  get missionHistory(): readonly string[] {
    return this._missionHistory;
  }

  promote(): void {
    const next = getNextRank(this._rank);
    if (!next) {
      throw new DomainError(`Ninja ${this.name} is already at maximum rank (${this._rank})`);
    }
    this._rank = next;
  }

  recordCompletedMission(missionId: string): void {
    if (this._missionHistory.includes(missionId)) {
      return;
    }
    this._missionHistory.push(missionId);
  }
}
