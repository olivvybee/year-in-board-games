import _chunk from 'lodash/chunk';

import { BGGGame, Game } from './types';
import { makeRequest } from './makeRequest';

export interface BGGGamesResponse {
  items: {
    item?: BGGGame[];
  };
}

const ARRAY_PATHS = ['items.item.name'];

export const fetchGames = async (gameIds: string[]): Promise<Game[]> => {
  const games: Game[] = [];
  const chunks = _chunk(gameIds, 20);

  for (let chunk of chunks) {
    const params = {
      id: chunk.join(','),
      thing: 'boardgame',
    };

    const response = await makeRequest<BGGGamesResponse>(
      'thing',
      params,
      ARRAY_PATHS
    );

    if (!response) {
      throw new Error('No data returned from BGG');
    }

    games.push(
      ...(response.items.item?.map((game) => ({
        id: game.id,
        name: game.name.find((name) => name.type === 'primary')!.value,
        image: game.image,
        thumbnail: game.thumbnail,
      })) || [])
    );
  }

  return games;
};
