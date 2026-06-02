import { Link } from 'react-router-dom';
import type { NinjaViewModel } from '@/presentation/view-models/NinjaViewModel';
import styles from './NinjaCard.module.css';

export function NinjaCard({ ninja }: { ninja: NinjaViewModel }) {
  return (
    <article className={styles.card}>
      <h2 className={styles.name}>
        <Link to={`/ninjas/${ninja.id}`}>{ninja.name}</Link>
      </h2>
      <p className={styles.meta}>Rank: {ninja.rank}</p>
    </article>
  );
}
