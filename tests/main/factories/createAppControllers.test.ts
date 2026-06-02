import { describe, it, expect } from 'vitest';
import { createAppControllers } from '@/main/factories';

describe('createAppControllers', () => {
  it('returns all application controllers', () => {
    const controllers = createAppControllers();

    expect(controllers.listNinjas).toBeDefined();
    expect(controllers.listMissions).toBeDefined();
    expect(controllers.promoteNinja).toBeDefined();
    expect(controllers.acceptMission).toBeDefined();
    expect(controllers.completeMission).toBeDefined();
    expect(typeof controllers.listNinjas.handle).toBe('function');
    expect(typeof controllers.completeMission.handle).toBe('function');
  });
});
