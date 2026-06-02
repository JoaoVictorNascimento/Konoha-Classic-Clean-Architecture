import { RouterProvider } from 'react-router-dom';
import { AppControllersProvider } from '@/presentation/context/AppControllersContext';
import { ThemeProvider } from '@/presentation/context/ThemeContext';
import type { AppControllers } from '@/main/factories';
import { router } from '@/presentation/routes';

export function App({ controllers }: { controllers: AppControllers }) {
  return (
    <ThemeProvider>
      <AppControllersProvider controllers={controllers}>
        <RouterProvider router={router} />
      </AppControllersProvider>
    </ThemeProvider>
  );
}
