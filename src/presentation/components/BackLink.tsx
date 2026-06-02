import { Link } from 'react-router-dom';
import goBackIcon from '@/presentation/assets/go-back.png';
import styles from './BackLink.module.css';

interface BackLinkProps {
  to?: string;
}

export function BackLink({ to = '/ninjas' }: BackLinkProps) {
  return (
    <Link to={to} className={styles.back}>
      <img src={goBackIcon} alt="Voltar para lista" className={styles.icon} />
    </Link>
  );
}
