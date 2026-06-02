import { useEffect, useMemo, useState } from 'react';
import { NinjaRank } from '@/domain/value-objects/NinjaRank';
import { useAppControllers } from '@/presentation/context/AppControllersContext';
import type { NinjaViewModel } from '@/presentation/view-models/NinjaViewModel';
import { NinjaCard } from '@/presentation/components/NinjaCard';
import { LoadingState } from '@/presentation/components/LoadingState';
import { ErrorAlert } from '@/presentation/components/ErrorAlert';
import { getErrorMessage } from '@/presentation/utils/getErrorMessage';
import styles from './NinjaListPage.module.css';

const KONOHA_VILLAGE_ID = 'konoha';
const GRID_COLUMNS = 4;
const GRID_ROWS = 5;
const PAGE_SIZE = GRID_COLUMNS * GRID_ROWS;

const RANK_FILTER_OPTIONS: { value: '' | NinjaRank; label: string }[] = [
  { value: '', label: 'Todos os ranks' },
  { value: NinjaRank.Genin, label: NinjaRank.Genin },
  { value: NinjaRank.Chunin, label: NinjaRank.Chunin },
  { value: NinjaRank.Jonin, label: NinjaRank.Jonin },
];

function filterNinjas(
  ninjas: NinjaViewModel[],
  nameQuery: string,
  rankFilter: '' | NinjaRank,
): NinjaViewModel[] {
  const query = nameQuery.trim().toLowerCase();

  return ninjas.filter((ninja) => {
    const matchesName =
      query.length === 0 || ninja.name.toLowerCase().includes(query);
    const matchesRank = rankFilter === '' || ninja.rank === rankFilter;
    return matchesName && matchesRank;
  });
}

export function NinjaListPage() {
  const { listNinjas } = useAppControllers();
  const [ninjas, setNinjas] = useState<NinjaViewModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [nameQuery, setNameQuery] = useState('');
  const [rankFilter, setRankFilter] = useState<'' | NinjaRank>('');

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const result = await listNinjas.handle({ villageId: KONOHA_VILLAGE_ID });
        if (!cancelled) {
          setNinjas(result);
          setPage(1);
          setNameQuery('');
          setRankFilter('');
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

  const filteredNinjas = useMemo(
    () => filterNinjas(ninjas, nameQuery, rankFilter),
    [ninjas, nameQuery, rankFilter],
  );

  const totalPages = Math.max(1, Math.ceil(filteredNinjas.length / PAGE_SIZE));

  const pageNinjas = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filteredNinjas.slice(start, start + PAGE_SIZE);
  }, [filteredNinjas, page]);

  useEffect(() => {
    setPage(1);
  }, [nameQuery, rankFilter]);

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  const hasActiveFilters = nameQuery.trim().length > 0 || rankFilter !== '';

  if (loading) {
    return <LoadingState message="Carregando ninjas de Konoha..." />;
  }

  return (
    <section>
      <h2 className={styles.heading}>Ninjas da Vila da Folha</h2>
      {error && <ErrorAlert message={error} />}

      {!error && ninjas.length > 0 && (
        <div className={styles.filters}>
          <label className={styles.filterField}>
            <span className={styles.filterLabel}>Nome</span>
            <input
              type="search"
              className={styles.filterInput}
              placeholder="Buscar por nome..."
              value={nameQuery}
              onChange={(event) => setNameQuery(event.target.value)}
            />
          </label>
          <label className={styles.filterField}>
            <span className={styles.filterLabel}>Rank</span>
            <select
              className={styles.filterSelect}
              value={rankFilter}
              onChange={(event) =>
                setRankFilter(event.target.value as '' | NinjaRank)
              }
            >
              {RANK_FILTER_OPTIONS.map((option) => (
                <option key={option.label} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        </div>
      )}

      {!error && ninjas.length > 0 && (
        <p className={styles.summary}>
          {hasActiveFilters
            ? `${filteredNinjas.length} de ${ninjas.length} ninjas`
            : `${ninjas.length} ninjas`}
          {' · '}
          página {page} de {totalPages}
        </p>
      )}

      <div className={styles.grid}>
        {pageNinjas.map((ninja) => (
          <NinjaCard key={ninja.id} ninja={ninja} />
        ))}
      </div>

      {!error && ninjas.length === 0 && <p>Nenhum ninja encontrado.</p>}
      {!error && ninjas.length > 0 && filteredNinjas.length === 0 && (
        <p className={styles.emptyFilters}>
          Nenhum ninja corresponde aos filtros selecionados.
        </p>
      )}

      {!error && filteredNinjas.length > PAGE_SIZE && (
        <nav className={styles.pagination} aria-label="Paginação de ninjas">
          <button
            type="button"
            className={styles.pageButton}
            disabled={page <= 1}
            onClick={() => setPage((current) => current - 1)}
          >
            Anterior
          </button>
          <span className={styles.pageInfo}>
            Página {page} de {totalPages}
          </span>
          <button
            type="button"
            className={styles.pageButton}
            disabled={page >= totalPages}
            onClick={() => setPage((current) => current + 1)}
          >
            Próxima
          </button>
        </nav>
      )}
    </section>
  );
}
