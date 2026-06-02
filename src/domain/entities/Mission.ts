import { DomainError } from '@/domain/errors/DomainError';
import {
  canTransitionTo,
  MissionStatus,
} from '@/domain/value-objects/MissionStatus';

export class Mission {
  readonly id: string;
  readonly title: string;
  readonly description?: string;
  readonly villageId: string;
  private _status: MissionStatus;
  private _assignedNinjaId?: string;

  constructor(params: {
    id: string;
    title: string;
    description?: string;
    villageId: string;
    status?: MissionStatus;
    assignedNinjaId?: string;
  }) {
    const trimmedTitle = params.title.trim();
    if (!trimmedTitle) {
      throw new DomainError('Mission title cannot be empty');
    }
    if (!params.villageId.trim()) {
      throw new DomainError('Mission must belong to a village');
    }

    this.id = params.id;
    this.title = trimmedTitle;
    this.description = params.description;
    this.villageId = params.villageId;
    this._status = params.status ?? MissionStatus.Available;
    this._assignedNinjaId = params.assignedNinjaId;
  }

  get status(): MissionStatus {
    return this._status;
  }

  get assignedNinjaId(): string | undefined {
    return this._assignedNinjaId;
  }

  canBeAcceptedBy(ninjaId: string): boolean {
    return (
      this._status === MissionStatus.Available &&
      Boolean(ninjaId.trim())
    );
  }

  accept(ninjaId: string): void {
    if (!this.canBeAcceptedBy(ninjaId)) {
      throw new DomainError(
        `Mission "${this.title}" cannot be accepted in status ${this._status}`,
      );
    }

    if (!canTransitionTo(this._status, MissionStatus.InProgress)) {
      throw new DomainError(
        `Invalid transition from ${this._status} to ${MissionStatus.InProgress}`,
      );
    }

    this._assignedNinjaId = ninjaId;
    this._status = MissionStatus.InProgress;
  }

  complete(): void {
    if (this._status !== MissionStatus.InProgress) {
      throw new DomainError(
        `Mission "${this.title}" can only be completed when in progress`,
      );
    }

    if (!this._assignedNinjaId) {
      throw new DomainError(
        `Mission "${this.title}" must have an assigned ninja to complete`,
      );
    }

    if (!canTransitionTo(this._status, MissionStatus.Completed)) {
      throw new DomainError(
        `Invalid transition from ${this._status} to ${MissionStatus.Completed}`,
      );
    }

    this._status = MissionStatus.Completed;
  }
}
