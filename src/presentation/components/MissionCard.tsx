import type { MissionViewModel } from '@/presentation/view-models/MissionViewModel';
import type { NinjaViewModel } from '@/presentation/view-models/NinjaViewModel';
import { MissionStatus } from '@/domain/value-objects/MissionStatus';
import styles from './MissionCard.module.css';

interface MissionCardProps {
  mission: MissionViewModel;
  ninjas: NinjaViewModel[];
  selectedNinjaId: string;
  onSelectNinja: (ninjaId: string) => void;
  onAccept: () => void;
  onComplete: () => void;
  busy: boolean;
}

export function MissionCard({
  mission,
  ninjas,
  selectedNinjaId,
  onSelectNinja,
  onAccept,
  onComplete,
  busy,
}: MissionCardProps) {
  return (
    <article className={styles.card}>
      <h2 className={styles.title}>{mission.title}</h2>
      {mission.description && <p className={styles.desc}>{mission.description}</p>}
      <p className={styles.status}>Status: {mission.status}</p>
      {mission.status === MissionStatus.Available && (
        <div className={styles.actions}>
          <select
            value={selectedNinjaId}
            onChange={(e) => onSelectNinja(e.target.value)}
            disabled={busy}
            aria-label="Selecionar ninja"
          >
            <option value="">Selecione um ninja</option>
            {ninjas.map((ninja) => (
              <option key={ninja.id} value={ninja.id}>
                {ninja.name}
              </option>
            ))}
          </select>
          <button type="button" onClick={onAccept} disabled={busy || !selectedNinjaId}>
            Aceitar missão
          </button>
        </div>
      )}
      {mission.status === MissionStatus.InProgress && (
        <div className={styles.actions}>
          <p>Atribuída a: {mission.assignedNinjaId}</p>
          <button type="button" onClick={onComplete} disabled={busy}>
            Completar missão
          </button>
        </div>
      )}
    </article>
  );
}
