export { Village } from '@/domain/entities/Village';
export { Ninja } from '@/domain/entities/Ninja';
export { Mission } from '@/domain/entities/Mission';
export { DomainError } from '@/domain/errors/DomainError';
export { NinjaRank, getNextRank, canPromote } from '@/domain/value-objects/NinjaRank';
export {
  MissionStatus,
  canTransitionTo,
} from '@/domain/value-objects/MissionStatus';
export type { NinjaRepository } from '@/domain/repositories/NinjaRepository';
export type { MissionRepository } from '@/domain/repositories/MissionRepository';
export {
  GetNinjasUseCase,
  GetMissionsUseCase,
  PromoteNinjaUseCase,
  AcceptMissionUseCase,
  CompleteMissionUseCase,
} from '@/domain/usecases';
