import { XMLParser } from 'fast-xml-parser';

import { BASE_URL } from './constants';
import { BGGPlay } from './types';

export interface BGGPlaysResponse {
  plays: {
    play?: BGGPlay[];
    username: string;
    userid: string;
    total: string;
    page: string;
  };
}

export const fetchPlays = async (
  username: string,
  startDate: string,
  endDate: string
) => {
  const params = {
    username,
    mindate: startDate,
    maxdate: endDate,
    subtype: 'boardgame',
  };

  const response = await makeRequest('plays', params);

  if (!response) {
    throw new Error('No data returned from BGG');
  }

  const total = parseInt(response.plays.total, 10);
  const numPages = Math.ceil(total / 100);

  let plays = response.plays.play || [];

  for (let page = 2; page <= numPages; page++) {
    const pageResponse = await makeRequest('plays', {
      ...params,
      page: page.toString(),
    });

    if (!response) {
      throw new Error(`BGG failed to return page ${page}`);
    }

    plays = plays.concat(pageResponse.plays.play || []);
  }

  const filteredPlays = plays.filter(
    (play) =>
      parseInt(play.quantity, 10) >= 1 &&
      !play.item.subtypes.subtype.some(
        (type) => type.value === 'boardgameexpansion'
      )
  );

  return filteredPlays;
};

const ARRAY_PATHS = [
  'plays.play',
  'plays.play.item.subtypes.subtype',
  'plays.play.players.player',
];

const makeRequest = async (
  path: string,
  params: Record<string, string>
): Promise<BGGPlaysResponse> => {
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
