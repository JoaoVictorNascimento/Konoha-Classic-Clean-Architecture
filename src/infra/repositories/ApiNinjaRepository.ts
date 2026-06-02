import { Ninja } from '@/domain/entities/Ninja';
import { NinjaRepository } from '@/domain/repositories/NinjaRepository';
import { AxiosClient } from '@/infra/api/AxiosClient';
import {
  CHARACTERS_MAX_PAGES,
  CHARACTERS_PAGE_LIMIT,
  KONOHA_VILLAGE_ID,
  STORAGE_KEY_NINJA_OVERRIDES,
} from '@/infra/api/dattebayo/DattebayoConfig';
import {
  DattebayoCharacter,
  DattebayoCharactersResponse,
} from '@/infra/api/dattebayo/DattebayoTypes';
import {
  isKonohaCharacter,
  mapCharacterToNinja,
  NinjaOverrides,
  parseExternalId,
} from '@/infra/mappers/NinjaMapper';
import { CachePort } from '@/infra/cache/CachePort';
import { KONOHA_CHARACTERS_CACHE_KEY } from '@/infra/cache/cacheKeys';
import { StoragePort } from '@/infra/storage/StoragePort';

type NinjaOverridesStore = Record<string, NinjaOverrides>;

export class ApiNinjaRepository implements NinjaRepository {
  constructor(
    private readonly httpClient: AxiosClient,
    private readonly storage: StoragePort,
    private readonly cache?: CachePort<DattebayoCharacter[]>,
    private readonly charactersCacheKey: string = KONOHA_CHARACTERS_CACHE_KEY,
  ) {}

  async findAll(villageId?: string): Promise<Ninja[]> {
    const characters = await this.fetchKonohaCharacters();
    const overrides = this.getOverridesStore();

    const ninjas = characters.map((character) =>
      mapCharacterToNinja(character, overrides[this.toOverrideKey(character.id)]),
    );

    if (villageId && villageId !== KONOHA_VILLAGE_ID) {
      return ninjas.filter((ninja) => ninja.villageId === villageId);
    }

    return ninjas;
  }

  async findById(id: string): Promise<Ninja | null> {
    const externalId = parseExternalId(id);
    if (externalId === null) {
      return null;
    }

    const characters = await this.fetchKonohaCharacters();
    const character = characters.find((item) => item.id === externalId);
    if (!character) {
      return null;
    }

    const overrides = this.getOverridesStore();
    return mapCharacterToNinja(
      character,
      overrides[this.toOverrideKey(character.id)],
    );
  }

  async save(ninja: Ninja): Promise<void> {
    const store = this.getOverridesStore();
    const key = ninja.externalId
      ? this.toOverrideKey(ninja.externalId)
      : ninja.id;

    store[key] = {
      rank: ninja.rank,
      missionHistory: [...ninja.missionHistory],
    };

    this.storage.set(STORAGE_KEY_NINJA_OVERRIDES, store);
    this.cache?.delete(this.charactersCacheKey);
  }

  private async fetchKonohaCharacters(): Promise<DattebayoCharacter[]> {
    const cached = this.cache?.get(this.charactersCacheKey);
    if (cached) {
      return cached;
    }

    const collected: DattebayoCharacter[] = [];

    for (let page = 1; page <= CHARACTERS_MAX_PAGES; page += 1) {
      const response = await this.httpClient.get<DattebayoCharactersResponse>(
        '/characters',
        { page, limit: CHARACTERS_PAGE_LIMIT },
      );

      const konohaOnPage = response.characters.filter(isKonohaCharacter);
      collected.push(...konohaOnPage);

      const fetched = page * response.pageSize;
      if (fetched >= response.total) {
        break;
      }
    }

    this.cache?.set(this.charactersCacheKey, collected);
    return collected;
  }

  private getOverridesStore(): NinjaOverridesStore {
    return this.storage.get<NinjaOverridesStore>(STORAGE_KEY_NINJA_OVERRIDES) ?? {};
  }

  private toOverrideKey(externalId: number): string {
    return String(externalId);
  }
}
