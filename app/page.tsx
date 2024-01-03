import { calculateStats } from '@/stats/calculateStats';
import { fetchPlays } from '../bgg/fetchPlays';

const Homepage = async () => {
  const plays = await fetchPlays('olivvybee', '2023-01-01', '2023-12-31');
  const oldPlays = await fetchPlays('olivvybee', '1970-01-01', '2022-12-31');

  const stats = calculateStats(plays, oldPlays, 'olivvybee');

  return <pre>{JSON.stringify(stats, null, 2)}</pre>;
};

export default Homepage;
