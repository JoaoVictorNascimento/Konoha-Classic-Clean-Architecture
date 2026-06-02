export type { AppControllers } from '@/main/factories/createControllers';
export { createControllers } from '@/main/factories/createControllers';
export { createRepositories } from '@/main/factories/createRepositories';
export { createStorage } from '@/main/factories/createStorage';
export { createUseCases } from '@/main/factories/createUseCases';

import type { AppControllers } from '@/main/factories/createControllers';
import { createControllers } from '@/main/factories/createControllers';
import { createRepositories } from '@/main/factories/createRepositories';
import { createStorage } from '@/main/factories/createStorage';
import { createUseCases } from '@/main/factories/createUseCases';

export function createAppControllers(): AppControllers {
  const storage = createStorage();
  const repositories = createRepositories(storage);
  const useCases = createUseCases(repositories);
  return createControllers(useCases);
}
