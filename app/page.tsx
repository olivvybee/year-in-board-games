import { fetchPlays } from '../bgg/fetchPlays';

const Homepage = async () => {
  const plays = await fetchPlays('olivvybee', '2024-01-01', '2024-12-31');

  console.log({
    'plays.length': plays.length,
  });

  return <pre>{JSON.stringify(plays, null, 2)}</pre>;
};

export default Homepage;
