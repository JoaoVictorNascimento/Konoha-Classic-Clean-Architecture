import axios, { AxiosInstance } from 'axios';
import {
  DATTEBAYO_BASE_URL,
  DATTEBAYO_TIMEOUT_MS,
} from '@/infra/api/dattebayo/DattebayoConfig';

export class AxiosClient {
  private readonly client: AxiosInstance;

  constructor(baseURL: string = DATTEBAYO_BASE_URL) {
    this.client = axios.create({
      baseURL,
      timeout: DATTEBAYO_TIMEOUT_MS,
    });
  }

  async get<T>(path: string, params?: Record<string, unknown>): Promise<T> {
    const response = await this.client.get<T>(path, { params });
    return response.data;
  }
}
