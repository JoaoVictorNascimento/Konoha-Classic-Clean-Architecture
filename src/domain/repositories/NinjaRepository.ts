import { Ninja } from '@/domain/entities/Ninja';

export interface NinjaRepository {
  /** Returns all ninjas, optionally filtered by village. */
  findAll(villageId?: string): Promise<Ninja[]>;

  /** Returns a ninja by id, or null if not found. */
  findById(id: string): Promise<Ninja | null>;

  /** Persists the current state of a ninja (e.g. after promote or history update). */
  save(ninja: Ninja): Promise<void>;
}
