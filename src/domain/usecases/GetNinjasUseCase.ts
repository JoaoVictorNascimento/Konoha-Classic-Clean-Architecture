import { Ninja } from '@/domain/entities/Ninja';
import { NinjaRepository } from '@/domain/repositories/NinjaRepository';

export class GetNinjasUseCase {
  constructor(private readonly ninjaRepository: NinjaRepository) {}

  async execute(input?: { villageId?: string }): Promise<Ninja[]> {
    return this.ninjaRepository.findAll(input?.villageId);
  }
}
