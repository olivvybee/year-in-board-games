'use client';

import { CropSettings } from '@/components/CropSelector';
import { Stats } from '@/stats/types';
import { createContext, useState } from 'react';
import { useLocalStorage } from 'usehooks-ts';

interface Params {
  username: string;
  year: string;
  month?: string;
  sortBy: string;
  includeExpansions: boolean;
}

export interface Data extends Params {
  stats: Stats;
  cropSettings?: CropSettings;
  gamesToShow: number;
}

export interface DataContext extends Data {
  setCropSettings: (settings: CropSettings) => void;
  setGamesToShow: (value: number) => void;
}

export const dataContext = createContext<DataContext>({
  username: '',
  year: '',
  month: '',
  sortBy: '',
  stats: {} as any,
  includeExpansions: false,
  cropSettings: undefined,
  setCropSettings: () => {},
  gamesToShow: 10,
  setGamesToShow: () => {},
});

interface DataContextProviderProps {
  children: React.ReactNode;
  params: Params;
  stats: Stats;
}

export const DataContextProvider = ({
  children,
  params,
  stats,
}: DataContextProviderProps) => {
  const [gamesToShow, setGamesToShow] = useLocalStorage<number>(
    'games-to-show',
    10
  );

  const [cropSettings, setCropSettings] = useLocalStorage<CropSettings>(
    'crop-settings',
    {}
  );

  return (
    <dataContext.Provider
      value={{
        ...params,
        stats,
        cropSettings,
        setCropSettings,
        gamesToShow,
        setGamesToShow,
      }}>
      {children}
    </dataContext.Provider>
  );
};
