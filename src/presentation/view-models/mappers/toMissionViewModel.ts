import { Mission } from '@/domain/entities/Mission';
import { MissionViewModel } from '@/presentation/view-models/MissionViewModel';

export function toMissionViewModel(mission: Mission): MissionViewModel {
  return {
    id: mission.id,
    title: mission.title,
    description: mission.description,
    status: mission.status,
    villageId: mission.villageId,
    assignedNinjaId: mission.assignedNinjaId,
  };
}
