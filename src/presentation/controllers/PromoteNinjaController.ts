import { PromoteNinjaUseCase } from '@/domain/usecases/PromoteNinjaUseCase';
import { NinjaViewModel } from '@/presentation/view-models/NinjaViewModel';
import { toNinjaViewModel } from '@/presentation/view-models/mappers/toNinjaViewModel';

export class PromoteNinjaController {
  constructor(private readonly promoteNinjaUseCase: PromoteNinjaUseCase) {}

  async handle(input: { ninjaId: string }): Promise<NinjaViewModel> {
    const ninja = await this.promoteNinjaUseCase.execute(input);
    return toNinjaViewModel(ninja);
  }
}
