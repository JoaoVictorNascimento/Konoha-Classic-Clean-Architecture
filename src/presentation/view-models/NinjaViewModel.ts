export interface NinjaViewModel {
  id: string;
  name: string;
  rank: string;
  villageId: string;
  externalId?: number;
  imageUrl?: string;
  missionHistory: string[];
}
