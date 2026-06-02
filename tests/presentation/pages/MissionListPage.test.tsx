import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, waitFor, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { MissionStatus } from '@/domain/value-objects/MissionStatus';
import { MissionListPage } from '@/presentation/pages/MissionListPage';
import { AppControllersProvider } from '@/presentation/context/AppControllersContext';
import type { AppControllers } from '@/main/composition';

afterEach(() => {
  cleanup();
});

function renderPage(controllers: AppControllers) {
  return render(
    <AppControllersProvider controllers={controllers}>
      <MemoryRouter>
        <MissionListPage />
      </MemoryRouter>
    </AppControllersProvider>,
  );
}

describe('MissionListPage', () => {
  it('renders available mission', async () => {
    const controllers = {
      listMissions: {
        handle: vi.fn().mockResolvedValue([
          {
            id: 'm1',
            title: 'Find the cat',
            status: MissionStatus.Available,
            villageId: 'konoha',
          },
        ]),
      },
      listNinjas: {
        handle: vi.fn().mockResolvedValue([
          { id: 'n1', name: 'Naruto', rank: 'Genin', villageId: 'konoha', missionHistory: [] },
        ]),
      },
      acceptMission: { handle: vi.fn() },
      completeMission: { handle: vi.fn() },
    } as unknown as AppControllers;

    renderPage(controllers);

    expect(await screen.findByText('Find the cat')).toBeInTheDocument();
  });

  it('calls acceptMission when accepting', async () => {
    const acceptHandle = vi.fn().mockResolvedValue({
      id: 'm1',
      title: 'Find the cat',
      status: MissionStatus.InProgress,
      villageId: 'konoha',
      assignedNinjaId: 'n1',
    });

    const missionAvailable = {
      id: 'm1',
      title: 'Find the cat',
      status: MissionStatus.Available,
      villageId: 'konoha',
    };

    const missionInProgress = {
      ...missionAvailable,
      status: MissionStatus.InProgress,
      assignedNinjaId: 'n1',
    };

    const controllers = {
      listMissions: {
        handle: vi
          .fn()
          .mockResolvedValueOnce([missionAvailable])
          .mockResolvedValueOnce([missionInProgress]),
      },
      listNinjas: {
        handle: vi.fn().mockResolvedValue([
          { id: 'n1', name: 'Naruto', rank: 'Genin', villageId: 'konoha', missionHistory: [] },
        ]),
      },
      acceptMission: { handle: acceptHandle },
      completeMission: { handle: vi.fn() },
    } as unknown as AppControllers;

    const user = userEvent.setup();
    renderPage(controllers);

    await screen.findByText('Find the cat');
    const select = screen.getByLabelText('Selecionar ninja');
    await user.selectOptions(select, 'n1');
    await user.click(screen.getByRole('button', { name: /aceitar/i }));

    await waitFor(() => {
      expect(acceptHandle).toHaveBeenCalledWith({ missionId: 'm1', ninjaId: 'n1' });
    });
  });
});
