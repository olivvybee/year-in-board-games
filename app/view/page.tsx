import { getStatsForUsername } from '@/stats/getStatsForUsername';

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

  return <div>{JSON.stringify(stats, null, 2)}</div>;
};

export default ViewPage;
