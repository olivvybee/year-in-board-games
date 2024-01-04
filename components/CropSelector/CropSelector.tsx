import { useContext, useEffect } from 'react';

import { MostPlayedGame } from '@/stats/types';
import { dataContext } from '@/context/DataContext';

export type CropMode =
  | 'Fit'
  | 'FillCenter'
  | 'FillLeft'
  | 'FillRight'
  | 'FillTop'
  | 'FillBottom';

export type CropSettings = { [gameId: string]: CropMode };

const buildInitialState = (games: MostPlayedGame[]): CropSettings =>
  games.reduce((processed, game) => ({ ...processed, [game.id]: 'Fit' }), {});

export const CropSelector = () => {
  const { stats, cropSettings, setCropSettings } = useContext(dataContext);

  const games = stats.mostPlayedGames;

  useEffect(() => {
    const initialState = buildInitialState(games);
    setCropSettings(initialState);
  }, [games]);

  const setModeForGame = (gameId: string, mode: CropMode) => {
    const newResults = { ...cropSettings, [gameId]: mode };
    setCropSettings(newResults);
  };

  return (
    <div>
      <p>Crop selector</p>

      {games.map((game) => (
        <p>{game.name}</p>
      ))}
    </div>
  );
};
