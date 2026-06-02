import { Ninja } from '@/domain/entities/Ninja';
import { NinjaViewModel } from '@/presentation/view-models/NinjaViewModel';

export function toNinjaViewModel(ninja: Ninja): NinjaViewModel {
  return {
    id: ninja.id,
    name: ninja.name,
    rank: ninja.rank,
    villageId: ninja.villageId,
    externalId: ninja.externalId,
    imageUrl: ninja.imageUrl,
    missionHistory: [...ninja.missionHistory],
  };
}
