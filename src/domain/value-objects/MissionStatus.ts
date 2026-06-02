export enum MissionStatus {
  Available = 'Available',
  InProgress = 'InProgress',
  Completed = 'Completed',
}

const ALLOWED_TRANSITIONS: Record<MissionStatus, MissionStatus[]> = {
  [MissionStatus.Available]: [MissionStatus.InProgress],
  [MissionStatus.InProgress]: [MissionStatus.Completed],
  [MissionStatus.Completed]: [],
};

export function canTransitionTo(
  from: MissionStatus,
  to: MissionStatus,
): boolean {
  return ALLOWED_TRANSITIONS[from].includes(to);
}
