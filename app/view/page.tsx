import { Result } from '@/components/Result';
import { getStatsForUsername } from '@/stats/getStatsForUsername';

import { DataContextProvider } from '@/context/DataContext';
import { MessageBanner } from '@/components/MessageBanner';

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
      <MessageBanner severity="error">
        Could not generate an image because a username and year must be
        provided.
      </MessageBanner>
    );
  }

  if (!username) {
    return (
      <MessageBanner severity="error">
        Could not generate an image because a username must be provided.
      </MessageBanner>
    );
  }

  if (!year) {
    return (
      <MessageBanner severity="error">
        Could not generate an image because a year must be provided.
      </MessageBanner>
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
