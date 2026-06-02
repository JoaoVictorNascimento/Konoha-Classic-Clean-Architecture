import { DomainError } from '@/domain/errors/DomainError';

export class Village {
  readonly id: string;
  readonly name: string;
  readonly externalId?: number;
  private readonly _ninjaIds: string[];

  constructor(params: {
    id: string;
    name: string;
    externalId?: number;
    ninjaIds?: string[];
  }) {
    const trimmedName = params.name.trim();
    if (!trimmedName) {
      throw new DomainError('Village name cannot be empty');
    }

    this.id = params.id;
    this.name = trimmedName;
    this.externalId = params.externalId;
    this._ninjaIds = [...(params.ninjaIds ?? [])];
  }

  get ninjaIds(): readonly string[] {
    return this._ninjaIds;
  }

  registerNinja(ninjaId: string): void {
    if (this._ninjaIds.includes(ninjaId)) {
      throw new DomainError(`Ninja ${ninjaId} is already registered in this village`);
    }
    this._ninjaIds.push(ninjaId);
  }

  unregisterNinja(ninjaId: string): void {
    const index = this._ninjaIds.indexOf(ninjaId);
    if (index === -1) {
      throw new DomainError(`Ninja ${ninjaId} is not registered in this village`);
    }
    this._ninjaIds.splice(index, 1);
  }
}
