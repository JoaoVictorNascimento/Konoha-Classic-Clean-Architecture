import type { NinjaViewModel } from '@/presentation/view-models/NinjaViewModel';

export interface MissionViewModel {
  id: string;
  title: string;
  description?: string;
  status: string;
  villageId: string;
  assignedNinjaId?: string;
}

export interface CompleteMissionViewModel {
  mission: MissionViewModel;
  ninja: NinjaViewModel;
}
