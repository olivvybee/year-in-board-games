import { XMLParser } from 'fast-xml-parser';

import { BASE_URL } from './constants';
import { BGGGame } from './types';

export interface BGGGamesResponse {
  items: {
    item?: BGGGame[];
  };
}

export const fetchGames = async (gameIds: string[]) => {
  const params = {
    id: gameIds.join(','),
    thing: 'boardgame',
  };

  const response = await makeRequest('thing', params);

  if (!response) {
    throw new Error('No data returned from BGG');
  }

  return (
    response.items.item?.map((game) => ({
      id: game.id,
      name: game.name.find((name) => name.type === 'primary')?.value,
      image: game.image,
    })) || []
  );
};

const ARRAY_PATHS = ['items.item.name'];

const makeRequest = async (
  path: string,
  params: Record<string, string>
): Promise<BGGGamesResponse> => {
  const queryParams = new URLSearchParams(params);
  const url = `${BASE_URL}/${path}?${queryParams.toString()}`;

  const response = await fetch(url);
  const body = await response.text();

  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: '',
    ignoreDeclaration: true,
    isArray: (tagName, jPath, isLeafNode, isAttribute) =>
      ARRAY_PATHS.includes(jPath),
  });
  const parsedResponse = parser.parse(body);

  return parsedResponse;
};
