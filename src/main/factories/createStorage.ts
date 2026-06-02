import { LocalStorageAdapter } from '@/infra/storage/LocalStorageAdapter';
import { StoragePort } from '@/infra/storage/StoragePort';

export function createStorage(): StoragePort {
  return new LocalStorageAdapter();
}
