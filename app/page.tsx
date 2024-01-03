import { calculateStats } from '@/stats/calculateStats';
import { fetchPlays } from '../bgg/fetchPlays';

const Homepage = async () => {
  const plays = await fetchPlays('olivvybee');

  const stats = calculateStats({
    plays,
    startDate: '2023-01-01',
    endDate: '2023-12-31',
    username: 'olivvybee',
    sortBy: 'plays',
  });

  return <pre>{JSON.stringify(stats, null, 2)}</pre>;
};

export default Homepage;
