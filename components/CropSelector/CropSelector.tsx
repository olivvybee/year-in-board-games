import { useContext, useEffect } from 'react';

import { MostPlayedGame } from '@/stats/types';
import { dataContext } from '@/context/DataContext';

import { CropSelectorItem } from './CropSelectorItem';

import styles from './CropSelector.module.css';

export type CropMode =
  | 'Fit'
  | 'FillCenter'
  | 'FillLeft'
  | 'FillRight'
  | 'FillTop'
  | 'FillBottom';

export type CropSettings = { [gameId: number]: CropMode };

const buildInitialState = (
  games: MostPlayedGame[],
  existingSettings: CropSettings
): CropSettings =>
  games.reduce(
    (processed, game) => ({
      ...processed,
      [game.id]: existingSettings[game.id] || 'Fit',
    }),
    existingSettings
  );

export const CropSelector = () => {
  const { stats, cropSettings = {}, setCropSettings } = useContext(dataContext);

  const games = stats.mostPlayedGames;

  useEffect(() => {
    const initialState = buildInitialState(games, cropSettings);
    setCropSettings(initialState);
  }, [games]);

  const setModeForGame = (gameId: number, mode: CropMode) => {
    const newResults = { ...cropSettings, [gameId]: mode };
    setCropSettings(newResults);
  };

  if (!cropSettings) {
    return null;
  }

  return (
    <div className={styles.cropSelector}>
      {games
        .filter((game) => !!game.image)
        .map((game) => (
          <CropSelectorItem
            gameId={game.id}
            gameName={game.name}
            imageUrl={game.image!}
            mode={cropSettings[game.id]}
            onChange={(mode) => setModeForGame(game.id, mode)}
            key={game.id}
          />
        ))}
    </div>
  );
};
