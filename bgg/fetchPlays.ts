import { BggClient } from 'boardgamegeekclient';

export const fetchPlays = async (
  username: string,
  startDate?: string,
  endDate?: string
) => {
  const params = {
    username,
    mindate: startDate,
    maxdate: endDate,
    subtype: 'boardgame',
  };

  const client = BggClient.Create();
  const response = await client.play.query({
    username,
    mindate: startDate,
    maxdate: endDate,
    subtype: 'boardgame',
  });

  if (!response || !response.length) {
    throw new Error('No data returned from BGG');
  }

  const { total } = response[0];
  const numPages = Math.ceil(total / 100);

  let plays = response[0].plays;

  for (let page = 2; page <= numPages; page++) {
    const pageResponse = await client.play.query({ ...params, page });

    if (!response || !response.length) {
      throw new Error(`BGG failed to return page ${page}`);
    }

    plays = plays.concat(pageResponse[0].plays);
  }

  const filteredPlays = plays.filter(
    (play) =>
      play.quantity >= 1 &&
      !play.item.subtypes.some((type) => type.value === 'boardgameexpansion')
  );

  return filteredPlays;
};
