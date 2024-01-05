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

interface FetchPlaysParams {
  username: string;
  startDate?: string;
  endDate: string;
  includeExpansions: boolean;
}

const getPlaySubtypes = (play: BGGPlay) =>
  play.item.subtypes.subtype.map((subtype) => subtype.value);

export const fetchPlays = async ({
  username,
  startDate,
  endDate,
  includeExpansions,
}: FetchPlaysParams) => {
  const params = {
    username,
    maxdate: endDate,
    subtype: 'boardgame',
    ...(!!startDate ? { mindate: startDate } : {}),
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

  const playsWithNonZeroQuantity = plays.filter(
    (play) => parseInt(play.quantity, 10) >= 1
  );

  const filteredPlays = includeExpansions
    ? playsWithNonZeroQuantity
    : playsWithNonZeroQuantity.filter((play) => {
        const subtypes = getPlaySubtypes(play);
        return (
          !subtypes.includes('boardgameexpansion') ||
          subtypes.includes('boardgameintegration')
        );
      });

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
