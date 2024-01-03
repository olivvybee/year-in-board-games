import { BggPlaysPlayDto } from 'boardgamegeekclient/dist/esm/dto/concrete/subdto';
import { Stats } from './types';

export const calculateStats = (
  plays: BggPlaysPlayDto[],
  oldPlays: BggPlaysPlayDto[],
  username: string
): Stats => {
  const games: { [id: number]: number } = {};
  const previouslySeenGames = new Set<number>();
  const newGames = new Set<number>();
  const players = new Set<string>();
  const dates = new Set<string>();
  let timeSpent = 0;

  for (let play of oldPlays) {
    const game = play.item.objectid;
    previouslySeenGames.add(game);
  }

  for (let play of plays) {
    const game = play.item.objectid;
    if (games[game] === undefined) {
      games[game] = 1;
    } else {
      games[game] += 1;
    }

    if (!previouslySeenGames.has(game)) {
      newGames.add(game);
    }

    const gamePlayers = play.players
      .filter((player) => player.username !== username)
      .map((player) => player.name);
    gamePlayers.forEach((player) => players.add(player));

    dates.add(play.date);

    timeSpent += play.length;
  }

  console.log(Array.from(previouslySeenGames));
  console.log(Array.from(newGames));

  const hours = Math.round(timeSpent / 60);

  return {
    gamesPlayed: Object.keys(games).length,
    plays: plays.length,
    newGames: newGames.size,
    hoursSpent: hours,
    daysPlayed: dates.size,
    players: players.size,
  };
};
