import { useCallback, useEffect, useState } from 'react';
import type { MissionViewModel } from '@/presentation/view-models/MissionViewModel';
import type { NinjaViewModel } from '@/presentation/view-models/NinjaViewModel';
import { useAppControllers } from '@/presentation/context/AppControllersContext';
import { MissionCard } from '@/presentation/components/MissionCard';
import { LoadingState } from '@/presentation/components/LoadingState';
import { ErrorAlert } from '@/presentation/components/ErrorAlert';
import { getErrorMessage } from '@/presentation/utils/getErrorMessage';
import styles from './MissionListPage.module.css';

const KONOHA_VILLAGE_ID = 'konoha';

export function MissionListPage() {
  const { listMissions, listNinjas, acceptMission, completeMission } =
    useAppControllers();
  const [missions, setMissions] = useState<MissionViewModel[]>([]);
  const [ninjas, setNinjas] = useState<NinjaViewModel[]>([]);
  const [selectedNinjaByMission, setSelectedNinjaByMission] = useState<
    Record<string, string>
  >({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busyMissionId, setBusyMissionId] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [missionList, ninjaList] = await Promise.all([
        listMissions.handle({ villageId: KONOHA_VILLAGE_ID }),
        listNinjas.handle({ villageId: KONOHA_VILLAGE_ID }),
      ]);
      setMissions(missionList);
      setNinjas(ninjaList);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [listMissions, listNinjas]);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  async function handleAccept(missionId: string) {
    const ninjaId = selectedNinjaByMission[missionId];
    if (!ninjaId) {
      return;
    }
    setBusyMissionId(missionId);
    setError(null);
    try {
      await acceptMission.handle({ missionId, ninjaId });
      await loadData();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setBusyMissionId(null);
    }
  }

  async function handleComplete(missionId: string) {
    setBusyMissionId(missionId);
    setError(null);
    try {
      await completeMission.handle({ missionId });
      await loadData();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setBusyMissionId(null);
    }
  }

  if (loading) {
    return <LoadingState message="Carregando missões..." />;
  }

  return (
    <section>
      <h2 className={styles.heading}>Missões de Konoha</h2>
      {error && <ErrorAlert message={error} />}
      {missions.map((mission) => (
        <MissionCard
          key={mission.id}
          mission={mission}
          ninjas={ninjas}
          selectedNinjaId={selectedNinjaByMission[mission.id] ?? ''}
          onSelectNinja={(ninjaId) =>
            setSelectedNinjaByMission((prev) => ({ ...prev, [mission.id]: ninjaId }))
          }
          onAccept={() => void handleAccept(mission.id)}
          onComplete={() => void handleComplete(mission.id)}
          busy={busyMissionId === mission.id}
        />
      ))}
      {missions.length === 0 && !error && <p>Nenhuma missão disponível.</p>}
    </section>
  );
}
