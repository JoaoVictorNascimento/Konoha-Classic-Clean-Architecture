import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { NinjaListPage } from '@/presentation/pages/NinjaListPage';
import { AppControllersProvider } from '@/presentation/context/AppControllersContext';
import type { AppControllers } from '@/main/factories';

function renderPage(controllers: AppControllers) {
  return render(
    <AppControllersProvider controllers={controllers}>
      <MemoryRouter>
        <NinjaListPage />
      </MemoryRouter>
    </AppControllersProvider>,
  );
}

describe('NinjaListPage', () => {
  it('renders ninjas from controller', async () => {
    const controllers = {
      listNinjas: {
        handle: vi.fn().mockResolvedValue([
          {
            id: 'n1',
            name: 'Naruto Uzumaki',
            rank: 'Genin',
            villageId: 'konoha',
            missionHistory: [],
          },
        ]),
      },
    } as unknown as AppControllers;

    renderPage(controllers);

    expect(await screen.findByText('Naruto Uzumaki')).toBeInTheDocument();
  });
});
