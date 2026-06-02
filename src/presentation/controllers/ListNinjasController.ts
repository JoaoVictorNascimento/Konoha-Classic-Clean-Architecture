import { GetNinjasUseCase } from '@/domain/usecases/GetNinjasUseCase';
import { NinjaViewModel } from '@/presentation/view-models/NinjaViewModel';
import { toNinjaViewModel } from '@/presentation/view-models/mappers/toNinjaViewModel';

export class ListNinjasController {
  constructor(private readonly getNinjasUseCase: GetNinjasUseCase) {}

  async handle(input?: { villageId?: string }): Promise<NinjaViewModel[]> {
    const ninjas = await this.getNinjasUseCase.execute(input);
    return ninjas.map(toNinjaViewModel);
  }
}
