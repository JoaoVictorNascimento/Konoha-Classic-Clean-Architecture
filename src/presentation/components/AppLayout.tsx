import type { CSSProperties } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import konohaBackground from '@/presentation/assets/konoha.jpg';
import { ThemeToggle } from '@/presentation/components/ThemeToggle';
import styles from './AppLayout.module.css';

const layoutStyle = {
  '--konoha-bg': `url(${konohaBackground})`,
} as CSSProperties;

export function AppLayout() {
  return (
    <div className={styles.layout} style={layoutStyle}>
      <header className={styles.header}>
        <div className={styles.headerRow}>
          <h1 className={styles.title}>Konoha — Hokage Panel</h1>
          <div className={styles.headerEnd}>
            <nav className={styles.nav}>
              <NavLink to="/ninjas" className={({ isActive }) => (isActive ? styles.active : undefined)}>
                Ninjas
              </NavLink>
              <NavLink to="/missions" className={({ isActive }) => (isActive ? styles.active : undefined)}>
                Missões
              </NavLink>
            </nav>
            <ThemeToggle />
          </div>
        </div>
      </header>
      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  );
}
