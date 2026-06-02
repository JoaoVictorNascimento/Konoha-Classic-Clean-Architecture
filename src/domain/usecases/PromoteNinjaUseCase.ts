import { Ninja } from '@/domain/entities/Ninja';
import { DomainError } from '@/domain/errors/DomainError';
import { NinjaRepository } from '@/domain/repositories/NinjaRepository';

export class PromoteNinjaUseCase {
  constructor(private readonly ninjaRepository: NinjaRepository) {}

  async execute(input: { ninjaId: string }): Promise<Ninja> {
    const ninja = await this.ninjaRepository.findById(input.ninjaId);
    if (!ninja) {
      throw new DomainError(`Ninja ${input.ninjaId} not found`);
    }

    ninja.promote();
    await this.ninjaRepository.save(ninja);
    return ninja;
  }
}
