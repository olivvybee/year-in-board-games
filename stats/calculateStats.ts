import _orderBy from 'lodash/orderBy';

import { BGGPlay } from '@/bgg/types';

import { MostPlayedGame, Stats } from './types';

interface CalculateStatsParams {
  plays: BGGPlay[];
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
    const game = parseInt(play.item.objectid, 10);
    const length = parseInt(play.length, 10);

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
          minutesPlayed: length,
        };
      } else {
        playsPerGame[game].plays += 1;
        playsPerGame[game].minutesPlayed += length;
      }

      const gamePlayers = play.players.player
        .filter((player) => player.username !== username)
        .map((player) => player.name);
      gamePlayers.forEach((player) => players.add(player));

      dates.add(play.date);

      minutesSpent += length;
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
