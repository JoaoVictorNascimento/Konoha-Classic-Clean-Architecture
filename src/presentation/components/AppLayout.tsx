import { NavLink, Outlet } from 'react-router-dom';
import { ThemeToggle } from '@/presentation/components/ThemeToggle';
import styles from './AppLayout.module.css';

export function AppLayout() {
  return (
    <div className={styles.layout}>
      <header className={styles.header}>
        <div className={styles.headerRow}>
          <h1 className={styles.title}>Konoha — Hokage Panel</h1>
          <ThemeToggle />
        </div>
        <nav className={styles.nav}>
          <NavLink to="/ninjas" className={({ isActive }) => (isActive ? styles.active : undefined)}>
            Ninjas
          </NavLink>
          <NavLink to="/missions" className={({ isActive }) => (isActive ? styles.active : undefined)}>
            Missões
          </NavLink>
        </nav>
      </header>
      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  );
}
