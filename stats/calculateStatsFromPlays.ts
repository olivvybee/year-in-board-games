import _orderBy from 'lodash/orderBy';
import { decode as HTMLDecode } from 'html-entities';

import { BGGPlay } from '@/bgg/types';

import { MostPlayedGame, Stats } from './types';

interface CalculateStatsParams {
  plays: BGGPlay[];
  username: string;
  sortBy: string;
  startDate: string;
}

export const calculateStatsFromPlays = ({
  plays,
  username,
  sortBy,
  startDate,
}: CalculateStatsParams): Stats => {
  const playsPerGame: { [id: number]: MostPlayedGame } = {};

  const historicallyPlayedGames = new Set<number>();
  const newGames = new Set<number>();
  const playedGames = new Set<number>();

  const players = new Set<string>();
  const dates = new Set<string>();

  let playCount = 0;
  let minutesSpent = 0;
  let playsWithoutDuration = 0;

  const sortedPlays = plays.sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  for (let play of sortedPlays) {
    const gameId = parseInt(play.item.objectid, 10);
    const gameName = HTMLDecode(play.item.name);
    const length = parseInt(play.length, 10);
    const count = parseInt(play.quantity, 10);

    if (play.date < startDate) {
      historicallyPlayedGames.add(gameId);
      continue;
    }

    const isNew = !historicallyPlayedGames.has(gameId);
    if (isNew) {
      newGames.add(gameId);
    }

    playedGames.add(gameId);
    playCount += count;

    if (playsPerGame[gameId] === undefined) {
      playsPerGame[gameId] = {
        id: gameId,
        name: gameName,
        plays: count,
        minutesPlayed: length,
        isNew,
      };
    } else {
      playsPerGame[gameId].plays += count;
      playsPerGame[gameId].minutesPlayed += length;
    }

    const otherPlayers = play.players?.player
      .filter(
        (player) => player.username.toLowerCase() !== username.toLowerCase()
      )
      .map((player) => player.name);
    otherPlayers?.forEach((player) => players.add(player));

    dates.add(play.date);

    minutesSpent += length;

    if (length === 0) {
      playsWithoutDuration += 1;
    }
  }

  const sortParameters =
    sortBy === 'plays'
      ? ['plays', 'minutesPlayed', 'name']
      : ['minutesPlayed', 'plays', 'name'];

  const mostPlayedGames = _orderBy(
    Object.values(playsPerGame),
    sortParameters,
    ['desc', 'desc', 'asc']
  ).slice(0, 20);

  return {
    gamesPlayed: playedGames.size,
    plays: playCount,
    newGames: newGames.size,
    minutesSpent,
    playsWithoutDuration,
    daysPlayed: dates.size,
    players: players.size,
    mostPlayedGames,
  };
};
