import { BGGPlay } from './types';
import { makeRequest } from './makeRequest';

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

const ARRAY_PATHS = [
  'plays.play',
  'plays.play.item.subtypes.subtype',
  'plays.play.players.player',
];

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

  const response = await makeRequest<BGGPlaysResponse>(
    'plays',
    params,
    ARRAY_PATHS
  );

  if (!response) {
    throw new Error('No data returned from BGG');
  }

  const total = parseInt(response.plays.total, 10);
  const numPages = Math.ceil(total / 100);

  let plays = response.plays.play || [];

  for (let page = 2; page <= numPages; page++) {
    const pageResponse = await makeRequest<BGGPlaysResponse>(
      'plays',
      {
        ...params,
        page: page.toString(),
      },
      ARRAY_PATHS
    );

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
