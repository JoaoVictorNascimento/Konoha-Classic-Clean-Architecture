import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { BackLink } from '@/presentation/components/BackLink';
import { useAppControllers } from '@/presentation/context/AppControllersContext';
import type { NinjaViewModel } from '@/presentation/view-models/NinjaViewModel';
import { LoadingState } from '@/presentation/components/LoadingState';
import { ErrorAlert } from '@/presentation/components/ErrorAlert';
import { getErrorMessage } from '@/presentation/utils/getErrorMessage';
import styles from './NinjaDetailsPage.module.css';

const KONOHA_VILLAGE_ID = 'konoha';

export function NinjaDetailsPage() {
  const { ninjaId } = useParams<{ ninjaId: string }>();
  const { listNinjas, promoteNinja } = useAppControllers();
  const [ninja, setNinja] = useState<NinjaViewModel | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [promoting, setPromoting] = useState(false);

  const loadNinja = useCallback(async () => {
    if (!ninjaId) {
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const ninjas = await listNinjas.handle({ villageId: KONOHA_VILLAGE_ID });
      const found = ninjas.find((item: NinjaViewModel) => item.id === ninjaId) ?? null;
      setNinja(found);
      if (!found) {
        setError('Ninja não encontrado.');
      }
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [listNinjas, ninjaId]);

  useEffect(() => {
    void loadNinja();
  }, [loadNinja]);

  async function handlePromote() {
    if (!ninjaId) {
      return;
    }
    setPromoting(true);
    setError(null);
    try {
      const updated = await promoteNinja.handle({ ninjaId });
      setNinja(updated);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setPromoting(false);
    }
  }

  if (loading) {
    return <LoadingState message="Carregando ninja..." />;
  }

  if (!ninja) {
    return (
      <section>
        {error && <ErrorAlert message={error} />}
        <BackLink />
      </section>
    );
  }

  return (
    <section>
      <BackLink />
      <h2 className={styles.heading}>{ninja.name}</h2>
      {error && <ErrorAlert message={error} />}
      <dl className={styles.details}>
        <dt>Rank</dt>
        <dd>{ninja.rank}</dd>
        <dt>Vila</dt>
        <dd>{ninja.villageId}</dd>
        <dt>Histórico de missões</dt>
        <dd>
          {ninja.missionHistory.length > 0 ? (
            <ul>
              {ninja.missionHistory.map((id) => (
                <li key={id}>{id}</li>
              ))}
            </ul>
          ) : (
            'Nenhuma missão completada.'
          )}
        </dd>
      </dl>
      <button type="button" onClick={() => void handlePromote()} disabled={promoting}>
        {promoting ? 'Promovendo...' : 'Promover ninja'}
      </button>
    </section>
  );
}
