import imageDataURI from 'image-data-uri';

import { fetchPlays } from '@/bgg/fetchPlays';
import { fetchGames } from '@/bgg/fetchGames';

import { calculateStatsFromPlays } from './calculateStatsFromPlays';

interface Params {
  username: string;
  year: string;
  month?: string;
  sortBy?: string;
  includeExpansions?: boolean;
}

const createDateString = (year: string, month: string, day: string) => {
  const paddedMonth = month.padStart(2, '0');
  const paddedDay = day.toString().padStart(2, '0');
  return `${year}-${paddedMonth}-${paddedDay}`;
};

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

  const startDate = createDateString(year, month || '01', '01');
  const endDate = createDateString(year, month || '12', '31');

  const plays = await fetchPlays({
    username,
    endDate,
    includeExpansions,
  });
  const stats = calculateStatsFromPlays({
    plays,
    sortBy,
    username,
    startDate,
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
