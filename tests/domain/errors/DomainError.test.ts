import { describe, it, expect } from 'vitest';
import { DomainError } from '@/domain/errors/DomainError';

describe('DomainError', () => {
  it('exposes name and message', () => {
    const error = new DomainError('Invalid ninja rank');

    expect(error).toBeInstanceOf(Error);
    expect(error).toBeInstanceOf(DomainError);
    expect(error.name).toBe('DomainError');
    expect(error.message).toBe('Invalid ninja rank');
  });
});
