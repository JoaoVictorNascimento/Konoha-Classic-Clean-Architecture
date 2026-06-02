export interface DattebayoCharacter {
  id: number;
  name: string;
  images?: string[];
  personal?: {
    affiliation?: string | string[];
  };
  rank?: {
    ninjaRank?: Record<string, string>;
  };
}

export interface DattebayoCharactersResponse {
  characters: DattebayoCharacter[];
  currentPage: number;
  pageSize: number;
  total: number;
}
