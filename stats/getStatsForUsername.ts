import { fetchPlays } from '@/bgg/fetchPlays';
import { calculateStatsFromPlays } from './calculateStatsFromPlays';

interface Params {
  username: string;
  year: string;
  month?: string;
  sortBy?: string;
}

export const getStatsForUsername = async ({
  username,
  year,
  month,
  sortBy = 'plays',
}: Params) => {
  if (!username) {
    throw new Error("Missing parameter 'username'");
  }

  if (!year) {
    throw new Error("Missing parameter 'year'");
  }

  const startDate = !!month ? `${year}-${month}-01` : `${year}-01-01`;
  const endDate = !!month ? `${year}-${month}-31` : `${year}-12-31`;

  const plays = await fetchPlays(username, startDate, endDate);
  const stats = calculateStatsFromPlays({
    plays,
    sortBy,
    username,
  });

  return stats;
};
