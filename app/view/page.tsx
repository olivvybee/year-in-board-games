import { Result } from '@/components/Result';
import { getStatsForUsername } from '@/stats/getStatsForUsername';

import { DataContextProvider } from '@/context/DataContext';

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

  const params = { username, year, month, sortBy };

  const stats = await getStatsForUsername(params);

  return (
    <DataContextProvider params={params} stats={stats}>
      <Result />
    </DataContextProvider>
  );
};

export default ViewPage;
