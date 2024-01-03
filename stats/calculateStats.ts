import { BggPlaysPlayDto } from 'boardgamegeekclient/dist/esm/dto/concrete/subdto';
import _orderBy from 'lodash/orderBy';

import { MostPlayedGame, Stats } from './types';

interface CalculateStatsParams {
  plays: BggPlaysPlayDto[];
  startDate: string;
  endDate: string;
  username: string;
  sortBy: string;
}

export const calculateStats = ({
  plays,
  startDate,
  endDate,
  username,
  sortBy,
}: CalculateStatsParams): Stats => {
  const playsPerGame: { [id: number]: MostPlayedGame } = {};

  const gamesInDateRange = new Set<number>();
  const previouslySeenGames = new Set<number>();

  const players = new Set<string>();
  const dates = new Set<string>();
  let minutesSpent = 0;
  let playsInDateRange = 0;

  for (let play of plays) {
    const date = play.date;
    const game = play.item.objectid;

    if (date > endDate) {
      continue;
    } else if (date < startDate) {
      previouslySeenGames.add(game);
    } else {
      gamesInDateRange.add(game);
      playsInDateRange += 1;

      if (playsPerGame[game] === undefined) {
        playsPerGame[game] = {
          id: game,
          name: play.item.name,
          plays: 1,
          minutesPlayed: play.length,
        };
      } else {
        playsPerGame[game].plays += 1;
        playsPerGame[game].minutesPlayed += play.length;
      }

      const gamePlayers = play.players
        .filter((player) => player.username !== username)
        .map((player) => player.name);
      gamePlayers.forEach((player) => players.add(player));

      dates.add(play.date);

      minutesSpent += play.length;
    }
  }

  const newGames = Array.from(gamesInDateRange).filter(
    (game) => !previouslySeenGames.has(game)
  );

  const sortParameters =
    sortBy === 'plays'
      ? ['plays', 'minutesPlayed', 'name']
      : ['minutesPlayed', 'plays', 'name'];

  const mostPlayedGames = _orderBy(
    Object.values(playsPerGame),
    sortParameters,
    'desc'
  ).slice(0, 10);

  return {
    gamesPlayed: gamesInDateRange.size,
    plays: playsInDateRange,
    newGames: newGames.length,
    minutesSpent,
    daysPlayed: dates.size,
    players: players.size,
    mostPlayedGames,
  };
};
