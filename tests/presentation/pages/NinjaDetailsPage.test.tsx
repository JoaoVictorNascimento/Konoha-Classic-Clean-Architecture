import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { NinjaDetailsPage } from '@/presentation/pages/NinjaDetailsPage';
import { AppControllersProvider } from '@/presentation/context/AppControllersContext';
import type { AppControllers } from '@/main/composition';

function renderPage(controllers: AppControllers) {
  return render(
    <AppControllersProvider controllers={controllers}>
      <MemoryRouter initialEntries={['/ninjas/n1']}>
        <Routes>
          <Route path="/ninjas/:ninjaId" element={<NinjaDetailsPage />} />
        </Routes>
      </MemoryRouter>
    </AppControllersProvider>,
  );
}

describe('NinjaDetailsPage', () => {
  it('promotes ninja via controller', async () => {
    const ninja = {
      id: 'n1',
      name: 'Naruto',
      rank: 'Genin',
      villageId: 'konoha',
      missionHistory: [],
    };

    const controllers = {
      listNinjas: { handle: vi.fn().mockResolvedValue([ninja]) },
      promoteNinja: {
        handle: vi.fn().mockResolvedValue({ ...ninja, rank: 'Chunin' }),
      },
    } as unknown as AppControllers;

    renderPage(controllers);
    const user = userEvent.setup();

    expect(await screen.findByText('Naruto')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: /promover/i }));

    await waitFor(() => {
      expect(screen.getByText('Chunin')).toBeInTheDocument();
    });
  });
});
