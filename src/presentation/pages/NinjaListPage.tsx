import { useEffect, useState } from 'react';
import { useAppControllers } from '@/presentation/context/AppControllersContext';
import type { NinjaViewModel } from '@/presentation/view-models/NinjaViewModel';
import { NinjaCard } from '@/presentation/components/NinjaCard';
import { LoadingState } from '@/presentation/components/LoadingState';
import { ErrorAlert } from '@/presentation/components/ErrorAlert';
import { getErrorMessage } from '@/presentation/utils/getErrorMessage';
import styles from './NinjaListPage.module.css';

const KONOHA_VILLAGE_ID = 'konoha';

export function NinjaListPage() {
  const { listNinjas } = useAppControllers();
  const [ninjas, setNinjas] = useState<NinjaViewModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const result = await listNinjas.handle({ villageId: KONOHA_VILLAGE_ID });
        if (!cancelled) {
          setNinjas(result);
        }
      } catch (err) {
        if (!cancelled) {
          setError(getErrorMessage(err));
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, [listNinjas]);

  if (loading) {
    return <LoadingState message="Carregando ninjas de Konoha..." />;
  }

  return (
    <section>
      <h2 className={styles.heading}>Ninjas da Vila da Folha</h2>
      {error && <ErrorAlert message={error} />}
      <div className={styles.list}>
        {ninjas.map((ninja) => (
          <NinjaCard key={ninja.id} ninja={ninja} />
        ))}
      </div>
      {!error && ninjas.length === 0 && <p>Nenhum ninja encontrado.</p>}
    </section>
  );
}
