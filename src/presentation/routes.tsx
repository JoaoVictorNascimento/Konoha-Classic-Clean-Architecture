import { createBrowserRouter, Navigate } from 'react-router-dom';
import { AppLayout } from '@/presentation/components/AppLayout';
import { NinjaListPage } from '@/presentation/pages/NinjaListPage';
import { NinjaDetailsPage } from '@/presentation/pages/NinjaDetailsPage';
import { MissionListPage } from '@/presentation/pages/MissionListPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { index: true, element: <Navigate to="/ninjas" replace /> },
      { path: 'ninjas', element: <NinjaListPage /> },
      { path: 'ninjas/:ninjaId', element: <NinjaDetailsPage /> },
      { path: 'missions', element: <MissionListPage /> },
    ],
  },
]);
