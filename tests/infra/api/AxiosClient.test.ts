import { describe, it, expect, vi, beforeEach } from 'vitest';
import axios from 'axios';
import { AxiosClient } from '@/infra/api/AxiosClient';

vi.mock('axios', () => {
  const get = vi.fn();
  return {
    default: {
      create: vi.fn(() => ({ get })),
    },
  };
});

describe('AxiosClient', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns data from GET requests', async () => {
    const client = new AxiosClient('https://api.test');
    const instance = (axios.create as ReturnType<typeof vi.fn>).mock.results[0]
      .value;
    instance.get.mockResolvedValue({ data: { ok: true } });

    const result = await client.get<{ ok: boolean }>('/characters', {
      page: 1,
    });

    expect(result).toEqual({ ok: true });
    expect(instance.get).toHaveBeenCalledWith('/characters', {
      params: { page: 1 },
    });
  });
});
