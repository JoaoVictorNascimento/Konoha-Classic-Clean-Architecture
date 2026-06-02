import { RouterProvider } from 'react-router-dom';
import { AppControllersProvider } from '@/presentation/context/AppControllersContext';
import type { AppControllers } from '@/main/composition';
import { router } from '@/presentation/routes';

export function App({ controllers }: { controllers: AppControllers }) {
  return (
    <AppControllersProvider controllers={controllers}>
      <RouterProvider router={router} />
    </AppControllersProvider>
  );
}
