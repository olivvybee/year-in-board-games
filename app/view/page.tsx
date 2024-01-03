import { Result } from '@/components/Result';
import { getStatsForUsername } from '@/stats/getStatsForUsername';

import styles from './page.module.css';
import { Sidebar } from '@/components/Sidebar';
import { useState } from 'react';

interface ViewPageProps {
  searchParams: {
    username?: string;
    year?: string;
    month?: string;
    sortBy?: string;
  };
}

const ViewPage = async ({ searchParams }: ViewPageProps) => {
  const { username, year, month, sortBy = 'plays' } = searchParams;

  if (!username) {
    return <div>beans</div>;
  }

  if (!year) {
    return <div>BEANS</div>;
  }

  const stats = await getStatsForUsername({ username, year, month, sortBy });

  return <Result stats={stats} />;
};

export default ViewPage;
