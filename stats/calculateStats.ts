import { BggPlaysPlayDto } from 'boardgamegeekclient/dist/esm/dto/concrete/subdto';
import { Stats } from './types';

interface CalculateStatsParams {
  plays: BggPlaysPlayDto[];
  startDate: string;
  endDate: string;
  username: string;
}

export const calculateStats = ({
  plays,
  startDate,
  endDate,
  username,
}: CalculateStatsParams): Stats => {
  const playsPerGame: { [id: number]: number } = {};

  const gamesInDateRange = new Set<number>();
  const previouslySeenGames = new Set<number>();

  const players = new Set<string>();
  const dates = new Set<string>();
  let timeSpent = 0;
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
        playsPerGame[game] = 1;
      } else {
        playsPerGame[game] += 1;
      }

      const gamePlayers = play.players
        .filter((player) => player.username !== username)
        .map((player) => player.name);
      gamePlayers.forEach((player) => players.add(player));

      dates.add(play.date);

      timeSpent += play.length;
    }
  }

  const newGames = Array.from(gamesInDateRange).filter(
    (game) => !previouslySeenGames.has(game)
  );

  const hours = Math.round(timeSpent / 60);

  return {
    gamesPlayed: gamesInDateRange.size,
    plays: playsInDateRange,
    newGames: newGames.length,
    hoursSpent: hours,
    daysPlayed: dates.size,
    players: players.size,
  };
};
