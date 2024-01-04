import { Result } from '@/components/Result';
import { getStatsForUsername } from '@/stats/getStatsForUsername';

import { DataContextProvider } from '@/context/DataContext';
import { ErrorBanner } from '@/components/ErrorBanner';

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

  if (!username && !year) {
    return (
      <ErrorBanner>
        Could not generate an image because a username and year must be
        provided.
      </ErrorBanner>
    );
  }

  if (!username) {
    return (
      <ErrorBanner>
        Could not generate an image because a username must be provided.
      </ErrorBanner>
    );
  }

  if (!year) {
    return (
      <ErrorBanner>
        Could not generate an image because a year must be provided.
      </ErrorBanner>
    );
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
