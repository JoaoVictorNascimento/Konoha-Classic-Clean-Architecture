import { createContext, useContext, type ReactNode } from 'react';
import type { AppControllers } from '@/main/composition';

const AppControllersContext = createContext<AppControllers | null>(null);

export function AppControllersProvider({
  controllers,
  children,
}: {
  controllers: AppControllers;
  children: ReactNode;
}) {
  return (
    <AppControllersContext.Provider value={controllers}>
      {children}
    </AppControllersContext.Provider>
  );
}

export function useAppControllers(): AppControllers {
  const context = useContext(AppControllersContext);
  if (!context) {
    throw new Error('useAppControllers must be used within AppControllersProvider');
  }
  return context;
}
