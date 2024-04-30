import { Stats } from '@/stats/types';
import { getMonthName } from '@/utils/getMonthName';

interface AltTextParams {
  stats: Stats;
  username: string;
  year: string;
  month?: string;
  sortBy: string;
}

export const generateAltText = ({
  stats,
  username,
  year,
  month,
  sortBy,
}: AltTextParams) => {
  const dateText = !!month ? `${getMonthName(month)} ${year}` : year;

  const hours = Math.round(stats.minutesSpent / 60);

  const mostPlayedGames = stats.mostPlayedGames
    .map((game) => {
      const hours = Math.round(game.minutesPlayed / 60);
      const amount =
        sortBy === 'plays'
          ? `${game.plays} ${game.plays === 1 ? 'play' : 'plays'}`
          : `${hours} ${hours === 1 ? 'hour' : 'hours'}`;
      const newIndicator = game.isNew ? ' - new game' : '';

      return `${game.name} - ${amount}${newIndicator};`;
    })
    .join('\n');

  return `
A year in review style image summarising plays of board games.

${username}'s ${!!month ? 'month' : 'year'} in board games ${dateText}:
${stats.gamesPlayed} ${stats.gamesPlayed === 1 ? 'game' : 'games'} played;
${stats.plays} ${stats.plays === 1 ? 'play' : 'plays'};
${stats.newGames} new ${stats.newGames === 1 ? 'game' : 'games'};
${hours} ${hours === 1 ? 'hour' : 'hours'};
${stats.daysPlayed} ${stats.daysPlayed === 1 ? 'day' : 'days'} played;

Most played games:
${mostPlayedGames}
`.trim();
};
