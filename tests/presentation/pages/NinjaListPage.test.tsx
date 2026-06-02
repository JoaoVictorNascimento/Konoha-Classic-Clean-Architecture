import { describe, it, expect, vi, afterEach } from 'vitest';
import { cleanup, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { NinjaListPage } from '@/presentation/pages/NinjaListPage';
import { AppControllersProvider } from '@/presentation/context/AppControllersContext';
import type { AppControllers } from '@/main/factories';
import type { NinjaViewModel } from '@/presentation/view-models/NinjaViewModel';

function buildNinja(index: number): NinjaViewModel {
  return {
    id: `ninja-${index}`,
    name: `Ninja ${index}`,
    rank: 'Genin',
    villageId: 'konoha',
    missionHistory: [],
  };
}

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
  afterEach(() => {
    cleanup();
  });

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

  it('paginates grid with 20 ninjas per page', async () => {
    const ninjas = Array.from({ length: 25 }, (_, index) => buildNinja(index + 1));
    const controllers = {
      listNinjas: {
        handle: vi.fn().mockResolvedValue(ninjas),
      },
    } as unknown as AppControllers;

    const user = userEvent.setup();
    renderPage(controllers);

    expect(await screen.findByText('Ninja 1')).toBeInTheDocument();
    expect(screen.getByText('Ninja 20')).toBeInTheDocument();
    expect(screen.queryByText('Ninja 21')).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /próxima/i }));

    await waitFor(() => {
      expect(screen.getByText('Ninja 21')).toBeInTheDocument();
    });
    expect(screen.queryByText('Ninja 1')).not.toBeInTheDocument();
  });

  it('renders ninja card as link to details', async () => {
    const controllers = {
      listNinjas: {
        handle: vi.fn().mockResolvedValue([
          {
            id: 'ninja-1',
            name: 'Naruto Uzumaki',
            rank: 'Genin',
            villageId: 'konoha',
            imageUrl: 'https://example.com/naruto.png',
            missionHistory: [],
          },
        ]),
      },
    } as unknown as AppControllers;

    renderPage(controllers);

    const name = await screen.findByText('Naruto Uzumaki');
    const link = name.closest('a');
    expect(link).toHaveAttribute('href', '/ninjas/ninja-1');
  });

  it('filters ninjas by name', async () => {
    const controllers = {
      listNinjas: {
        handle: vi.fn().mockResolvedValue([
          { id: 'n1', name: 'Naruto Uzumaki', rank: 'Genin', villageId: 'konoha', missionHistory: [] },
          { id: 'n2', name: 'Sasuke Uchiha', rank: 'Genin', villageId: 'konoha', missionHistory: [] },
        ]),
      },
    } as unknown as AppControllers;

    const user = userEvent.setup();
    renderPage(controllers);

    await screen.findByText('Naruto Uzumaki');
    expect(screen.getByText('Sasuke Uchiha')).toBeInTheDocument();

    await user.type(screen.getByPlaceholderText(/buscar por nome/i), 'sasuke');

    await waitFor(() => {
      expect(screen.queryByText('Naruto Uzumaki')).not.toBeInTheDocument();
    });
    expect(screen.getByText('Sasuke Uchiha')).toBeInTheDocument();
  });

  it('filters ninjas by rank', async () => {
    const controllers = {
      listNinjas: {
        handle: vi.fn().mockResolvedValue([
          { id: 'n1', name: 'Naruto Uzumaki', rank: 'Genin', villageId: 'konoha', missionHistory: [] },
          { id: 'n2', name: 'Kakashi Hatake', rank: 'Jonin', villageId: 'konoha', missionHistory: [] },
        ]),
      },
    } as unknown as AppControllers;

    const user = userEvent.setup();
    renderPage(controllers);

    await screen.findByText('Naruto Uzumaki');

    await user.selectOptions(screen.getByLabelText(/rank/i), 'Jonin');

    await waitFor(() => {
      expect(screen.queryByText('Naruto Uzumaki')).not.toBeInTheDocument();
    });
    expect(screen.getByText('Kakashi Hatake')).toBeInTheDocument();
  });
});
