import _orderBy from 'lodash/orderBy';
import { decode as HTMLDecode } from 'html-entities';

import { BGGPlay } from '@/bgg/types';

import { MostPlayedGame, Stats } from './types';

interface CalculateStatsParams {
  plays: BGGPlay[];
  username: string;
  sortBy: string;
}

export const calculateStatsFromPlays = ({
  plays,
  username,
  sortBy,
}: CalculateStatsParams): Stats => {
  const playsPerGame: { [id: number]: MostPlayedGame } = {};

  const playedGames = new Set<number>();

  const players = new Set<string>();
  const dates = new Set<string>();

  let playCount = 0;
  let minutesSpent = 0;
  let playsWithoutDuration = 0;
  let newGames = 0;

  for (let play of plays) {
    const gameId = parseInt(play.item.objectid, 10);
    const gameName = HTMLDecode(play.item.name);
    const length = parseInt(play.length, 10);
    const count = parseInt(play.quantity, 10);

    playedGames.add(gameId);
    playCount += count;

    if (playsPerGame[gameId] === undefined) {
      playsPerGame[gameId] = {
        id: gameId,
        name: gameName,
        plays: count,
        minutesPlayed: length,
      };
    } else {
      playsPerGame[gameId].plays += count;
      playsPerGame[gameId].minutesPlayed += length;
    }

    const self = play.players?.player.find(
      (player) => player.username.toLowerCase() === username.toLowerCase()
    );
    const isNew = self?.new === '1';
    if (isNew) {
      newGames += 1;
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
  ).slice(0, 10);

  return {
    gamesPlayed: playedGames.size,
    plays: playCount,
    newGames,
    minutesSpent,
    playsWithoutDuration,
    daysPlayed: dates.size,
    players: players.size,
    mostPlayedGames,
  };
};
