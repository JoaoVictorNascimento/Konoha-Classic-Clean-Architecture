import { Link } from 'react-router-dom';
import type { NinjaViewModel } from '@/presentation/view-models/NinjaViewModel';
import styles from './NinjaCard.module.css';

export function NinjaCard({ ninja }: { ninja: NinjaViewModel }) {
  return (
    <Link to={`/ninjas/${ninja.id}`} className={styles.card}>
      {ninja.imageUrl ? (
        <img
          src={ninja.imageUrl}
          alt=""
          className={styles.image}
          loading="lazy"
        />
      ) : (
        <div className={styles.placeholder} aria-hidden />
      )}
      <div className={styles.overlay}>
        <h2 className={styles.name}>{ninja.name}</h2>
        <p className={styles.meta}>{ninja.rank}</p>
      </div>
    </Link>
  );
}
