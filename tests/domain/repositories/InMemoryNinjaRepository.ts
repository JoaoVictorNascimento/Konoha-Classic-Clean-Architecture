import { Ninja } from '@/domain/entities/Ninja';
import { NinjaRepository } from '@/domain/repositories/NinjaRepository';

export class InMemoryNinjaRepository implements NinjaRepository {
  private readonly store = new Map<string, Ninja>();

  async findAll(villageId?: string): Promise<Ninja[]> {
    const ninjas = Array.from(this.store.values());
    if (!villageId) {
      return ninjas;
    }
    return ninjas.filter((ninja) => ninja.villageId === villageId);
  }

  async findById(id: string): Promise<Ninja | null> {
    return this.store.get(id) ?? null;
  }

  async save(ninja: Ninja): Promise<void> {
    this.store.set(ninja.id, ninja);
  }
}
