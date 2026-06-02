import styles from './LoadingState.module.css';

export function LoadingState({ message = 'Carregando...' }: { message?: string }) {
  return <p className={styles.loading}>{message}</p>;
}
