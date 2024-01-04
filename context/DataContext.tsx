'use client';

import { Stats } from '@/stats/types';
import { createContext, useState } from 'react';

interface Params {
  username: string;
  year: string;
  month?: string;
  sortBy: string;
}

export interface Data extends Params {
  stats: Stats;
}

export interface DataContext extends Data {}

export const dataContext = createContext<DataContext>({
  username: '',
  year: '',
  month: '',
  sortBy: '',
  stats: {} as any,
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
  return (
    <dataContext.Provider value={{ ...params, stats }}>
      {children}
    </dataContext.Provider>
  );
};
