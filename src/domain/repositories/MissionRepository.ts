import { Mission } from '@/domain/entities/Mission';

export interface MissionRepository {
  /** Returns all missions, optionally filtered by village. */
  findAll(villageId?: string): Promise<Mission[]>;

  /** Returns a mission by id, or null if not found. */
  findById(id: string): Promise<Mission | null>;

  /** Persists the current state of a mission (e.g. after accept or complete). */
  save(mission: Mission): Promise<void>;
}
