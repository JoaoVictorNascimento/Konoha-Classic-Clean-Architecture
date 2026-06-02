import { describe, it, expect } from 'vitest';
import { Village } from '@/domain/entities/Village';
import { DomainError } from '@/domain/errors/DomainError';

describe('Village', () => {
  it('creates a village with valid name', () => {
    const village = new Village({
      id: 'konoha',
      name: 'Konohagakure',
      externalId: 1,
    });

    expect(village.id).toBe('konoha');
    expect(village.name).toBe('Konohagakure');
    expect(village.externalId).toBe(1);
    expect(village.ninjaIds).toEqual([]);
  });

  it('rejects empty name', () => {
    expect(() => new Village({ id: 'v1', name: '   ' })).toThrow(DomainError);
  });

  it('registers and unregisters ninjas', () => {
    const village = new Village({ id: 'konoha', name: 'Konohagakure' });

    village.registerNinja('n1');
    expect(village.ninjaIds).toEqual(['n1']);

    village.unregisterNinja('n1');
    expect(village.ninjaIds).toEqual([]);
  });

  it('prevents duplicate ninja registration', () => {
    const village = new Village({ id: 'konoha', name: 'Konohagakure' });
    village.registerNinja('n1');

    expect(() => village.registerNinja('n1')).toThrow(DomainError);
  });

  it('throws when unregistering unknown ninja', () => {
    const village = new Village({ id: 'konoha', name: 'Konohagakure' });

    expect(() => village.unregisterNinja('unknown')).toThrow(DomainError);
  });
});
