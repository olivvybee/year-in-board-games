import imageDataURI from 'image-data-uri';

import { fetchPlays } from '@/bgg/fetchPlays';
import { fetchGames } from '@/bgg/fetchGames';

import { calculateStatsFromPlays } from './calculateStatsFromPlays';
import { getImageSize } from '@/utils/getImageSize';

interface Params {
  username: string;
  year: string;
  month?: string;
  sortBy?: string;
  includeExpansions?: boolean;
}

export const getStatsForUsername = async ({
  username,
  year,
  month,
  sortBy = 'plays',
  includeExpansions = false,
}: Params) => {
  if (!username) {
    throw new Error("Missing parameter 'username'");
  }

  if (!year) {
    throw new Error("Missing parameter 'year'");
  }

  const startDate = !!month ? `${year}-${month}-01` : `${year}-01-01`;
  const endDate = !!month ? `${year}-${month}-31` : `${year}-12-31`;

  const plays = await fetchPlays({
    username,
    startDate,
    endDate,
    includeExpansions,
  });
  const stats = calculateStatsFromPlays({
    plays,
    sortBy,
    username,
  });

  const mostPlayedGameIds = stats.mostPlayedGames.map((game) =>
    game.id.toString()
  );
  const games = await fetchGames(mostPlayedGameIds);

  await Promise.all(
    mostPlayedGameIds.map(async (id, index) => {
      const imageUrl = games.find((game) => game.id === id)?.thumbnail;
      if (imageUrl) {
        const dataUrl = await imageDataURI.encodeFromURL(imageUrl);
        stats.mostPlayedGames[index].image = dataUrl;
      }
    })
  );

  return stats;
};
